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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';

// Interface for the food analysis data
interface FoodItem {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface FoodAnalysisData {
  calorie_data: {
    [key: string]: FoodItem;
  };
  total_calories: number;
  analysis: string;
}

export function DailyUpdate() {
  const [workoutCompleted, setWorkoutCompleted] = useState(false);
  const [workoutConfirmed, setWorkoutConfirmed] = useState(false);
  const [workoutNotes, setWorkoutNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [foodAnalysis, setFoodAnalysis] = useState<FoodAnalysisData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSavingAnalysis, setIsSavingAnalysis] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize and get user ID when component mounts
  useEffect(() => {
    // First try to get user email, which is the primary identifier
    const userEmail = localStorage.getItem('userEmail');
    
    if (userEmail) {
      // If we have an email, create a deterministic user ID from it
      // This ensures the same email always generates the same ID
      const emailBasedId = `user_${btoa(userEmail).replace(/[+/=]/g, '')}`;
      localStorage.setItem('uid', emailBasedId);
      setUserId(emailBasedId);
      console.log('Using email-based user ID:', emailBasedId, 'for email:', userEmail);
    } else {
      // Fallback to existing ID or create new one if no email is found
      let storedUserId = localStorage.getItem('uid');
      
      if (!storedUserId) {
        // Create a unique ID combining timestamp and random string
        const timestamp = new Date().getTime();
        const randomStr = Math.random().toString(36).substring(2, 10);
        storedUserId = `anonymous_${timestamp}_${randomStr}`;
        
        // Store the generated ID
        localStorage.setItem('uid', storedUserId);
        console.log('Generated anonymous user ID:', storedUserId);
      } else if (!storedUserId.startsWith('user_') && !storedUserId.startsWith('anonymous_')) {
        // If it's an old format ID, upgrade it to the new format
        const newId = `anonymous_${storedUserId}`;
        localStorage.setItem('uid', newId);
        storedUserId = newId;
        console.log('Upgraded legacy user ID to:', newId);
      } else {
        console.log('Using existing user ID:', storedUserId);
      }
      
      setUserId(storedUserId);
    }
    
    // Clear the component state when user email changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userEmail') {
        // User has logged in or out, need to refresh
        window.location.reload();
      }
    };
    
    // Listen for changes to localStorage (like login/logout events)
    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Handle workout status update
  const handleWorkoutStatusUpdate = async () => {
    if (!userId) {
      toast({
        title: "User Data Error",
        description: "Unable to identify user. Please refresh the page and try again.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      console.log('Sending workout update with UID:', userId);
      
      const response = await fetch('http://127.0.0.1:5000/api/daily/update_workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: userId,
          have_done_workout: workoutCompleted,
          notes: workoutNotes,
          date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update workout status');
      }

      const data = await response.json();
      console.log('Workout update response:', data);
      setWorkoutConfirmed(true);

      // Also save locally for offline access
      try {
        const savedWorkouts = JSON.parse(localStorage.getItem('workouts') || '[]');
        savedWorkouts.push({
          date: new Date().toISOString().split('T')[0],
          completed: workoutCompleted,
          notes: workoutNotes,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('workouts', JSON.stringify(savedWorkouts));
      } catch (e) {
        console.error('Error saving workout locally:', e);
      }

      toast({
        title: "Workout Status Updated",
        description: workoutCompleted ? "Great job completing your workout today!" : "Don't worry, you'll get back on track tomorrow!",
      });
    } catch (error) {
      console.error('Error updating workout status:', error);
      toast({
        title: "Update Failed",
        description: "There was a problem updating your workout status.",
        variant: "destructive",
      });
    }
  };

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    // Create a URL for the image file
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);
    setIsUploading(false);
  };

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Analyze food image with Gemini AI
  const analyzeFood = async () => {
    if (!uploadedImage) return;

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
        const analysisResponse = await fetch('/api/food/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: base64data.split(',')[1], // Remove the data:image/jpeg;base64, part
          }),
        });

        if (!analysisResponse.ok) {
          throw new Error('Failed to analyze food image');
        }

        const analysisData = await analysisResponse.json();
        setFoodAnalysis(analysisData);

        toast({
          title: "Food Analysis Complete",
          description: `Estimated total calories: ${analysisData.total_calories || 'Unknown'}`,
        });
      };
    } catch (error) {
      console.error('Error analyzing food image:', error);
      toast({
        title: "Analysis Failed",
        description: "There was a problem analyzing your food image.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Save food analysis to database
  const saveFoodAnalysis = async () => {
    if (!foodAnalysis) return;
    if (!userId) {
      toast({
        title: "User Data Error",
        description: "Unable to identify user. Please refresh the page and try again.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSavingAnalysis(true);
    
    try {
      console.log('Sending food analysis with UID:', userId);
      
      // Get the calorie data from the analysis
      const calorie_data = foodAnalysis.calorie_data;
      console.log('Sending calorie_data:', calorie_data);
      
      const response = await fetch('http://127.0.0.1:5000/api/daily/update_consumption', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: userId,
          calorie_data: calorie_data,
          date: new Date().toISOString().split('T')[0], // Current date
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error response:', errorData);
        throw new Error(`Failed to save food consumption data: ${errorData.message || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('Food analysis save response:', data);

      // Also save locally for offline access
      try {
        const savedMeals = JSON.parse(localStorage.getItem('meals') || '[]');
        savedMeals.push({
          date: new Date().toISOString().split('T')[0],
          analysis: foodAnalysis,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('meals', JSON.stringify(savedMeals));
      } catch (e) {
        console.error('Error saving meal locally:', e);
      }

      toast({
        title: "Food Data Saved",
        description: "Your food consumption data has been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving food consumption data:', error);
      toast({
        title: "Save Failed",
        description: "There was a problem saving your food consumption data.",
        variant: "destructive",
      });
    } finally {
      setIsSavingAnalysis(false);
    }
  };

  // Reset the food analysis
  const resetFoodAnalysis = () => {
    setUploadedImage(null);
    setFoodAnalysis(null);
  };

  // Calculate total macros
  const calculateTotalMacros = () => {
    if (!foodAnalysis) return { protein: 0, carbs: 0, fat: 0 };
    
    let protein = 0, carbs = 0, fat = 0;
    
    Object.values(foodAnalysis.calorie_data).forEach(item => {
      protein += item.protein || 0;
      carbs += item.carbs || 0;
      fat += item.fat || 0;
    });
    
    return { protein, carbs, fat };
  };

  // Calculate percentage for macro chart
  const calculateMacroPercentage = () => {
    const { protein, carbs, fat } = calculateTotalMacros();
    const total = protein + carbs + fat;
    
    if (total === 0) return { protein: 33, carbs: 33, fat: 34 }; // Default even split
    
    return {
      protein: Math.round((protein / total) * 100) || 0,
      carbs: Math.round((carbs / total) * 100) || 0,
      fat: Math.round((fat / total) * 100) || 0
    };
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Daily Update</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Workout Tracking Card */}
        <Card>
          <CardHeader>
            <CardTitle>Track Your Workout</CardTitle>
            <CardDescription>
              Let us know if you completed your scheduled workout today
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Switch
                id="workout-completed"
                checked={workoutCompleted}
                onCheckedChange={setWorkoutCompleted}
              />
              <Label htmlFor="workout-completed" className="text-base">
                I completed my workout today
              </Label>
              
              {workoutCompleted && (
                <Badge className="ml-auto bg-green-500">Completed</Badge>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="workout-notes">Notes (optional)</Label>
              <Textarea
                id="workout-notes"
                placeholder="Add any notes about your workout..."
                value={workoutNotes}
                onChange={(e) => setWorkoutNotes(e.target.value)}
                className="resize-none"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleWorkoutStatusUpdate}
              disabled={workoutConfirmed}
            >
              {workoutConfirmed ? "Workout Status Saved" : "Save Workout Status"}
            </Button>
          </CardFooter>
        </Card>

        {/* Food Analysis Card */}
        <Card>
          <CardHeader>
            <CardTitle>Food Calorie Analysis</CardTitle>
            <CardDescription>
              Upload a photo of your food to estimate calorie and nutritional content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!uploadedImage ? (
              <div 
                className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={handleUploadClick}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-10 w-10 text-muted-foreground"
                  >
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
                    <line x1="16" x2="22" y1="5" y2="5" />
                    <line x1="19" x2="19" y1="2" y2="8" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                  <span className="text-sm font-medium">
                    {isUploading ? 'Uploading...' : 'Click to upload food image'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    PNG, JPG or JPEG
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="aspect-video relative rounded-lg overflow-hidden">
                  <img 
                    src={uploadedImage} 
                    alt="Food" 
                    className="object-cover w-full h-full"
                  />
                </div>
                
                {foodAnalysis ? (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Analysis Results</h3>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={resetFoodAnalysis}
                        >
                          Analyze Another
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={saveFoodAnalysis}
                          disabled={isSavingAnalysis}
                        >
                          {isSavingAnalysis ? "Saving..." : "Save to Database"}
                        </Button>
                      </div>
                    </div>
                    
                    {/* Total Calories Display */}
                    <div className="p-4 bg-muted rounded-lg flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="font-bold text-primary text-xl">{foodAnalysis.total_calories}</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Total Calories</h4>
                        <p className="text-sm text-muted-foreground">Based on visual analysis</p>
                      </div>
                    </div>
                    
                    {/* Macro Nutrients Bar */}
                    {Object.keys(foodAnalysis.calorie_data).length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Macro Nutrients</h4>
                        <div className="h-8 w-full rounded-lg overflow-hidden flex">
                          {(() => {
                            const { protein, carbs, fat } = calculateMacroPercentage();
                            return (
                              <>
                                <div 
                                  className="bg-blue-500 h-full flex items-center justify-center text-xs text-white font-medium"
                                  style={{ width: `${protein}%` }}
                                  title={`Protein: ${calculateTotalMacros().protein}g`}
                                >
                                  {protein >= 10 ? `${protein}%` : ''}
                                </div>
                                <div 
                                  className="bg-green-500 h-full flex items-center justify-center text-xs text-white font-medium"
                                  style={{ width: `${carbs}%` }}
                                  title={`Carbs: ${calculateTotalMacros().carbs}g`}
                                >
                                  {carbs >= 10 ? `${carbs}%` : ''}
                                </div>
                                <div 
                                  className="bg-yellow-500 h-full flex items-center justify-center text-xs text-white font-medium"
                                  style={{ width: `${fat}%` }}
                                  title={`Fat: ${calculateTotalMacros().fat}g`}
                                >
                                  {fat >= 10 ? `${fat}%` : ''}
                                </div>
                              </>
                            );
                          })()}
                        </div>
                        <div className="flex text-xs justify-between px-1">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span>Protein: {calculateTotalMacros().protein}g</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span>Carbs: {calculateTotalMacros().carbs}g</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            <span>Fat: {calculateTotalMacros().fat}g</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Food Items Breakdown */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Food Items</h4>
                      <div className="rounded-lg border overflow-hidden">
                        <table className="min-w-full divide-y divide-muted">
                          <thead className="bg-muted/50">
                            <tr>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Food Item</th>
                              <th scope="col" className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider">Calories</th>
                              <th scope="col" className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider">Protein</th>
                              <th scope="col" className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider">Carbs</th>
                              <th scope="col" className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider">Fat</th>
                            </tr>
                          </thead>
                          <tbody className="bg-background divide-y divide-muted">
                            {Object.entries(foodAnalysis.calorie_data).map(([foodName, item], index) => (
                              <tr key={index} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium capitalize">
                                  {foodName}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                                  {item.calories}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                                  {item.protein}g
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                                  {item.carbs}g
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                                  {item.fat}g
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    {/* Analysis */}
                    {foodAnalysis.analysis && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Nutritional Analysis</h4>
                        <div className="text-sm bg-muted/30 rounded-lg p-4">
                          <p>{foodAnalysis.analysis}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <Button 
                      onClick={analyzeFood} 
                      disabled={isAnalyzing}
                      className="gap-2"
                    >
                      {isAnalyzing ? 'Analyzing...' : 'Analyze Food'}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}