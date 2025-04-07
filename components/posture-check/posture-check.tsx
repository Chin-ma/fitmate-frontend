"use client"

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Camera, UploadCloud } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

// Interface for the posture analysis data
interface PostureAnalysisResult {
  posture_score: number;
  posture_issues: string[];
  recommendations: string[];
  analysis: string;
}

export function PostureCheck() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [postureAnalysis, setPostureAnalysis] = useState<PostureAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize and get user ID when component mounts
  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      setUserId(userEmail);
    } else {
      // As a fallback, check if there's a userId in localStorage
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
        setUserId(storedUserId);
      }
    }
  }, []);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an image under 5MB",
          variant: "destructive",
        });
        return;
      }
      
      setIsUploading(true);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setUploadedImage(e.target.result as string);
        }
        setIsUploading(false);
      };
      
      reader.readAsDataURL(file);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Analyze posture from uploaded image
  const analyzePosture = async () => {
    if (!uploadedImage) {
      toast({
        title: "No Image Selected",
        description: "Please upload an image first",
        variant: "destructive",
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // First, we need to convert the image to base64
      const response = await fetch(uploadedImage);
      const blob = await response.blob();
      
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        
        // Send to backend for Gemini API processing
        const analysisResponse = await fetch('/api/posture/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: base64data.split(',')[1], // Remove the data:image/jpeg;base64, part
          }),
        });

        if (!analysisResponse.ok) {
          throw new Error('Failed to analyze posture image');
        }

        const analysisData = await analysisResponse.json();
        setPostureAnalysis(analysisData);

        toast({
          title: "Posture Analysis Complete",
          description: `Posture Score: ${analysisData.posture_score || 'Unknown'}/100`,
        });
      };
    } catch (error) {
      console.error('Error analyzing posture image:', error);
      toast({
        title: "Analysis Failed",
        description: "There was a problem analyzing your posture image.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Reset the posture analysis
  const resetPostureAnalysis = () => {
    setUploadedImage(null);
    setPostureAnalysis(null);
  };

  // Get progress color based on score
  const getProgressColorClass = (score: number) => {
    if (score > 70) return "bg-green-500";
    if (score > 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        ref={fileInputRef}
        className="hidden"
      />
      
      {!uploadedImage ? (
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center">
          <UploadCloud className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-4">
            Upload a photo of yourself for posture analysis
          </p>
          <Button onClick={triggerFileInput} disabled={isUploading}>
            {isUploading ? 'Uploading...' : 'Select Image'}
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="aspect-video relative rounded-lg overflow-hidden">
            <img 
              src={uploadedImage} 
              alt="Posture" 
              className="object-cover w-full h-full"
            />
          </div>
          
          {postureAnalysis ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Analysis Results</h3>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={resetPostureAnalysis}
                  >
                    Analyze Another
                  </Button>
                </div>
              </div>
              
              {/* Posture Score Display */}
              <div className="p-6 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Posture Score</h4>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="font-bold text-primary text-xl">{postureAnalysis.posture_score}</span>
                  </div>
                  <div>
                    <div className="w-48">
                      <Progress 
                        value={postureAnalysis.posture_score} 
                        className={cn("h-2.5", getProgressColorClass(postureAnalysis.posture_score))}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {postureAnalysis.posture_score > 70 
                        ? "Good posture" 
                        : postureAnalysis.posture_score > 40 
                          ? "Needs improvement" 
                          : "Poor posture - needs attention"
                      }
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Posture Issues */}
              {postureAnalysis.posture_issues.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Identified Issues</h4>
                  <ul className="space-y-1 list-disc pl-5">
                    {postureAnalysis.posture_issues.map((issue, index) => (
                      <li key={index} className="text-sm">
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Recommendations */}
              {postureAnalysis.recommendations.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Recommendations</h4>
                  <ul className="space-y-1 list-disc pl-5">
                    {postureAnalysis.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm">
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Analysis */}
              {postureAnalysis.analysis && (
                <div className="space-y-2">
                  <h4 className="font-medium">Overall Analysis</h4>
                  <div className="text-sm bg-muted/30 rounded-lg p-4">
                    <p>{postureAnalysis.analysis}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex justify-center">
              <Button 
                onClick={analyzePosture} 
                disabled={isAnalyzing}
                className="gap-2"
              >
                {isAnalyzing ? 'Analyzing Posture...' : 'Analyze Posture'}
                {isAnalyzing && (
                  <svg 
                    className="animate-spin h-4 w-4" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    ></circle>
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 