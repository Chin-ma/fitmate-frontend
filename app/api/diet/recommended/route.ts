import { NextRequest, NextResponse } from 'next/server';
import { DietPlan } from '../../../../lib/types';

export async function GET(request: NextRequest) {
  try {
    // TODO: In a real implementation, we would:
    // 1. Get the user ID from the session/token
    // 2. Fetch user's profile, preferences, and goals from the database
    // 3. Use an AI model or algorithm to generate a personalized diet plan
    // 4. Return the personalized plan
    
    // For now, return a static mock diet plan
    const mockDietPlan: DietPlan = {
      breakfast: {
        name: "High Protein Breakfast",
        description: "Start your day with protein-rich foods for sustained energy",
        foodItems: [
          {
            name: "Scrambled Eggs",
            details: { calories: 220, protein: 14, carbs: 2, fat: 16 },
            portion: "3 eggs"
          },
          {
            name: "Whole Grain Toast",
            details: { calories: 80, protein: 4, carbs: 15, fat: 1 },
            portion: "1 slice"
          },
          {
            name: "Avocado",
            details: { calories: 120, protein: 1, carbs: 6, fat: 10 },
            portion: "1/2 medium"
          },
          {
            name: "Black Coffee",
            details: { calories: 5, protein: 0, carbs: 1, fat: 0 },
            portion: "1 cup"
          }
        ],
        totalCalories: 425
      },
      lunch: {
        name: "Balanced Protein Bowl",
        description: "Balance of lean protein, complex carbs, and healthy fats",
        foodItems: [
          {
            name: "Grilled Chicken Breast",
            details: { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
            portion: "100g"
          },
          {
            name: "Brown Rice",
            details: { calories: 150, protein: 3, carbs: 32, fat: 1 },
            portion: "1/2 cup cooked"
          },
          {
            name: "Mixed Vegetables",
            details: { calories: 50, protein: 2, carbs: 10, fat: 0 },
            portion: "1 cup"
          },
          {
            name: "Olive Oil",
            details: { calories: 40, protein: 0, carbs: 0, fat: 4.5 },
            portion: "1 tsp"
          }
        ],
        totalCalories: 405
      },
      dinner: {
        name: "Lean Dinner",
        description: "Light on carbs, focus on protein and vegetables",
        foodItems: [
          {
            name: "Baked Salmon",
            details: { calories: 206, protein: 22, carbs: 0, fat: 13 },
            portion: "100g"
          },
          {
            name: "Steamed Broccoli",
            details: { calories: 55, protein: 3.7, carbs: 11, fat: 0.5 },
            portion: "1 cup"
          },
          {
            name: "Sweet Potato",
            details: { calories: 115, protein: 2, carbs: 27, fat: 0 },
            portion: "1 small"
          }
        ],
        totalCalories: 376
      },
      snacks: {
        name: "Healthy Snacks",
        description: "Protein-rich snacks to maintain energy levels throughout the day",
        foodItems: [
          {
            name: "Greek Yogurt",
            details: { calories: 100, protein: 17, carbs: 6, fat: 0 },
            portion: "3/4 cup"
          },
          {
            name: "Mixed Nuts",
            details: { calories: 173, protein: 5, carbs: 6, fat: 16 },
            portion: "1 oz (28g)"
          },
          {
            name: "Apple",
            details: { calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
            portion: "1 medium"
          }
        ],
        totalCalories: 368
      }
    };

    return NextResponse.json(mockDietPlan);
  } catch (error) {
    console.error('Error generating diet plan:', error);
    return NextResponse.json(
      { error: 'Failed to generate diet plan' },
      { status: 500 }
    );
  }
} 