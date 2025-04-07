import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Define types for posture analysis
interface PostureAnalysisResult {
  posture_score: number; // 0-100 score
  posture_issues: string[]; // List of identified issues
  recommendations: string[]; // List of recommendations
  analysis: string; // Overall analysis
}

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

async function analyzeWithGeminiAI(imageBase64: string): Promise<PostureAnalysisResult> {
  try {
    // Create a model instance - use gemini-2.0-flash for image analysis
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    // Prepare the image data for Gemini
    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: 'image/jpeg', // Adjust based on your image format
      },
    };
    
    // Structured prompt requesting specific JSON format
    const prompt = `
      Analyze this image showing a person's posture and provide a detailed posture assessment.
      
      Evaluate the posture from different aspects including:
      - Head position
      - Shoulder alignment
      - Spine curvature
      - Hip alignment
      - Knee positioning
      - Any other relevant posture aspects
      
      Return ONLY a valid JSON object with this exact structure:
      {
        "posture_score": number from 0-100 indicating overall posture health,
        "posture_issues": [
          "detailed issue 1",
          "detailed issue 2",
          ...
        ],
        "recommendations": [
          "detailed recommendation 1",
          "detailed recommendation 2",
          ...
        ],
        "analysis": "Overall analysis of the posture as plain text"
      }
      
      Ensure the posture_score is a number, not a string.
      Do not include any text outside of this JSON structure.
    `;
    
    // Send to Gemini for analysis
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text().trim();
    
    // Extract the JSON part from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    let parsedData: PostureAnalysisResult = { 
      posture_score: 0,
      posture_issues: [],
      recommendations: [],
      analysis: "Could not analyze posture."
    };
    
    if (jsonMatch) {
      try {
        parsedData = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        // Fall back to regex extraction if JSON parsing fails
        parsedData = extractStructuredData(text);
      }
    } else {
      // If no JSON structure found, try to extract structured data
      parsedData = extractStructuredData(text);
    }
    
    return parsedData;
  } catch (error) {
    console.error('Error with Gemini AI API:', error);
    throw new Error('Failed to analyze image with Gemini AI');
  }
}

// Backup function to extract structured data using regex if JSON parsing fails
function extractStructuredData(text: string): PostureAnalysisResult {
  // Default response structure
  const result: PostureAnalysisResult = {
    posture_score: 50, // Default middle score
    posture_issues: [],
    recommendations: [],
    analysis: "Could not analyze posture in detail."
  };
  
  try {
    // Try to extract posture score
    const scoreMatch = text.match(/["']?posture_score["']?\s*:\s*(\d+)/);
    if (scoreMatch) {
      result.posture_score = parseInt(scoreMatch[1], 10);
    }
    
    // Try to extract posture issues - using regex without 's' flag
    const issuesRegex = /["']?(posture_issues|issues)["']?\s*:\s*\[\s*([\s\S]*?)\s*\]/g;
    const issuesMatches = text.match(issuesRegex);
    if (issuesMatches && issuesMatches.length > 0) {
      const issuesText = issuesMatches[0];
      const issues = issuesText.match(/["']([^"']+)["']/g);
      if (issues) {
        result.posture_issues = issues.map(issue => issue.replace(/["']/g, ''));
      }
    }
    
    // Try to extract recommendations - using regex without 's' flag
    const recsRegex = /["']?(recommendations|recs)["']?\s*:\s*\[\s*([\s\S]*?)\s*\]/g;
    const recsMatches = text.match(recsRegex);
    if (recsMatches && recsMatches.length > 0) {
      const recsText = recsMatches[0];
      const recs = recsText.match(/["']([^"']+)["']/g);
      if (recs) {
        result.recommendations = recs.map(rec => rec.replace(/["']/g, ''));
      }
    }
    
    // Try to extract analysis text
    const analysisMatch = text.match(/["']?analysis["']?\s*:\s*["']([^"']+)["']/);
    if (analysisMatch) {
      result.analysis = analysisMatch[1];
    }
    
  } catch (error) {
    console.error('Error extracting structured data:', error);
  }
  
  return result;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image } = body;
    
    if (!image) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }
    
    // Analyze the image with Gemini AI
    const analysisResult = await analyzeWithGeminiAI(image);
    
    // Format the response for the frontend
    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error('Error analyzing posture image:', error);
    
    // Return a well-structured error response
    const fallbackResponse: PostureAnalysisResult = {
      posture_score: 50,
      posture_issues: ["Unable to analyze image"],
      recommendations: ["Try again with a clearer photo"],
      analysis: "Could not analyze the posture image. Please try again with a clearer photo showing your full body posture."
    };
    
    return NextResponse.json(
      { 
        error: 'Failed to analyze posture image',
        ...fallbackResponse
      },
      { status: 500 }
    );
  }
} 