// Diet plan data types
export interface FoodItem {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealPlan {
  name: string;
  description: string;
  foodItems: {
    name: string;
    details: FoodItem;
    portion: string;
  }[];
  totalCalories: number;
}

export interface DietPlan {
  breakfast: MealPlan;
  lunch: MealPlan;
  dinner: MealPlan;
  snacks: MealPlan;
} 