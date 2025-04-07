import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Define types for food analysis
interface FoodItem {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface FoodAnalysisResult {
  calorie_data: Record<string, FoodItem>;
  total_calories: number;
  analysis: string;
}

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

async function analyzeWithGeminiAI(imageBase64: string): Promise<FoodAnalysisResult> {
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
      Analyze this food image and provide a detailed nutritional breakdown.
      
      Identify each distinct food item visible in the image. For each item, provide:
      - Estimated calories
      - Protein content (in grams)
      - Carbohydrate content (in grams)
      - Fat content (in grams)
      
      Return ONLY a valid JSON object with this exact structure:
      {
        "calorie_data": {
          "food_item_name": {
            "calories": number,
            "protein": number,
            "carbs": number,
            "fat": number
          },
          "another_food_item": {
            "calories": number,
            "protein": number,
            "carbs": number,
            "fat": number
          }
        },
        "total_calories": number,
        "analysis": "Brief overall nutrition analysis as plain text"
      }
      
      Replace "food_item_name" with the actual name of each food item you identify.
      Ensure all values except "analysis" are numbers, not strings.
      Do not include any text outside of this JSON structure.
    `;
    
    // Send to Gemini for analysis
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text().trim();
    
    // Extract the JSON part from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    let parsedData: FoodAnalysisResult = { 
      calorie_data: {},
      total_calories: 0,
      analysis: "Could not analyze food items."
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
function extractStructuredData(text: string): FoodAnalysisResult {
  // Default response structure
  const result: FoodAnalysisResult = {
    calorie_data: {},
    total_calories: 0,
    analysis: "Could not analyze food items in detail."
  };
  
  try {
    // Try to find food items and their calorie values
    const foodItemMatches = text.matchAll(/["']?(\w+(\s+\w+)*)["']?\s*:\s*{[^}]*calories["']?\s*:\s*(\d+)[^}]*}/g);
    
    let totalCalories = 0;
    for (const match of foodItemMatches) {
      const foodName = match[1];
      const calories = parseInt(match[3], 10);
      
      // Extract nutrition data for this food item
      const itemDataMatch = match[0].match(new RegExp(
        `["']?${foodName}["']?\\s*:\\s*{\\s*` +
        `["']?calories["']?\\s*:\\s*(\\d+)\\s*,?\\s*` +
        `["']?protein["']?\\s*:\\s*(\\d+)\\s*,?\\s*` +
        `["']?carbs["']?\\s*:\\s*(\\d+)\\s*,?\\s*` +
        `["']?fat["']?\\s*:\\s*(\\d+)`, 'i'
      ));
      
      if (itemDataMatch) {
        result.calorie_data[foodName] = {
          calories: parseInt(itemDataMatch[1], 10) || 0,
          protein: parseInt(itemDataMatch[2], 10) || 0,
          carbs: parseInt(itemDataMatch[3], 10) || 0,
          fat: parseInt(itemDataMatch[4], 10) || 0
        };
        totalCalories += (parseInt(itemDataMatch[1], 10) || 0);
      } else {
        // Simpler extraction if detailed pattern doesn't match
        result.calorie_data[foodName] = {
          calories: calories || 0,
          protein: 0,
          carbs: 0,
          fat: 0
        };
        totalCalories += (calories || 0);
      }
    }
    
    result.total_calories = totalCalories;
    
    // Try to extract analysis text
    const analysisMatch = text.match(/["']?analysis["']?\s*:\s*["']([^"']+)["']/);
    if (analysisMatch) {
      result.analysis = analysisMatch[1];
    }
    
    // If no food items were found, estimate total calories
    if (Object.keys(result.calorie_data).length === 0) {
      const calorieMatch = text.match(/total_calories["']?\s*:\s*(\d+)/i);
      if (calorieMatch) {
        result.total_calories = parseInt(calorieMatch[1], 10);
        
        // Create a generic food item entry
        result.calorie_data["meal"] = {
          calories: result.total_calories,
          protein: 0,
          carbs: 0,
          fat: 0
        };
      } else {
        // Default calories as last resort
        result.total_calories = 350;
        result.calorie_data["meal"] = {
          calories: 350,
          protein: 0,
          carbs: 0,
          fat: 0
        };
      }
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
    console.error('Error analyzing food image:', error);
    
    // Return a well-structured error response
    const fallbackResponse: FoodAnalysisResult = {
      calorie_data: {
        "meal": {
          calories: 350,
          protein: 0,
          carbs: 0,
          fat: 0
        }
      },
      total_calories: 350,
      analysis: "Could not analyze the food image. Please try again with a clearer photo."
    };
    
    return NextResponse.json(
      { 
        error: 'Failed to analyze food image',
        ...fallbackResponse
      },
      { status: 500 }
    );
  }
} 