"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { Button } from "../../../../components/ui/button";
import { Skeleton } from "../../../../components/ui/skeleton";
import { DietPlan, MealPlan } from "../../../../lib/types";

export default function RecommendedPage() {
  const [loading, setLoading] = useState(true);
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [activeTab, setActiveTab] = useState("diet");
  const [error, setError] = useState<string | null>(null);

  // Fetch diet plan from backend
  const fetchDietPlan = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/diet/recommended');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch diet plan: ${response.status}`);
      }
      
      const data = await response.json();
      setDietPlan(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching diet plan:", error);
      setError("Failed to load your personalized diet plan. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDietPlan();
  }, []);

  const renderMealPlan = (mealPlan: MealPlan, mealType: string) => {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl">{mealPlan.name}</CardTitle>
          <CardDescription>{mealPlan.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4 font-medium text-sm text-muted-foreground">
              <div>Food Item</div>
              <div>Portion</div>
              <div>Calories</div>
              <div className="grid grid-cols-3">
                <div>Protein</div>
                <div>Carbs</div>
                <div>Fat</div>
              </div>
            </div>
            
            {mealPlan.foodItems.map((item, index) => (
              <div key={`${mealType}-${index}`} className="grid grid-cols-1 lg:grid-cols-4 gap-4 py-3 border-b">
                <div className="font-medium">{item.name}</div>
                <div>{item.portion}</div>
                <div>{item.details.calories} kcal</div>
                <div className="grid grid-cols-3">
                  <div>{item.details.protein}g</div>
                  <div>{item.details.carbs}g</div>
                  <div>{item.details.fat}g</div>
                </div>
              </div>
            ))}
            
            <div className="flex justify-between pt-2">
              <div className="font-medium">Total Calories:</div>
              <div className="font-bold">{mealPlan.totalCalories} kcal</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderLoadingSkeleton = () => {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[200px] w-full rounded-lg" />
        <Skeleton className="h-[200px] w-full rounded-lg" />
        <Skeleton className="h-[200px] w-full rounded-lg" />
        <Skeleton className="h-[200px] w-full rounded-lg" />
      </div>
    );
  };
  
  return (
    <div className="container px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Recommended Plan</h1>
          <p className="text-muted-foreground mt-1">
            Personalized diet and exercise plans based on your fitness goals and preferences.
          </p>
        </div>
        <Button className="mt-4 md:mt-0" onClick={fetchDietPlan}>Refresh Plan</Button>
      </div>
      
      <Tabs defaultValue="diet" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="diet">Diet Plan</TabsTrigger>
          <TabsTrigger value="exercises">Exercise Plan</TabsTrigger>
        </TabsList>
        
        <TabsContent value="diet" className="space-y-6">
          {loading ? (
            renderLoadingSkeleton()
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground text-center mb-4">{error}</p>
              <Button onClick={fetchDietPlan}>Retry</Button>
            </div>
          ) : dietPlan ? (
            <>
              <div className="grid grid-cols-1 gap-6">
                <h2 className="text-xl font-semibold tracking-tight mt-6">Breakfast</h2>
                {renderMealPlan(dietPlan.breakfast, "breakfast")}
                
                <h2 className="text-xl font-semibold tracking-tight mt-6">Lunch</h2>
                {renderMealPlan(dietPlan.lunch, "lunch")}
                
                <h2 className="text-xl font-semibold tracking-tight mt-6">Dinner</h2>
                {renderMealPlan(dietPlan.dinner, "dinner")}
                
                <h2 className="text-xl font-semibold tracking-tight mt-6">Snacks</h2>
                {renderMealPlan(dietPlan.snacks, "snacks")}
                
                <div className="mt-6 p-6 bg-muted rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Diet Plan Summary</h3>
                  <p className="text-muted-foreground">
                    Total daily calories: {dietPlan.breakfast.totalCalories + dietPlan.lunch.totalCalories + dietPlan.dinner.totalCalories + dietPlan.snacks.totalCalories} kcal
                  </p>
                  <p className="text-muted-foreground mt-2">
                    This plan is designed to help you achieve your fitness goals while maintaining a balanced diet.
                    Adjust portions as needed based on your specific calorie needs and activity level.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground text-center mb-4">
                Unable to load your personalized diet plan. Please try again.
              </p>
              <Button onClick={fetchDietPlan}>Retry</Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="exercises" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exercise Plan Coming Soon</CardTitle>
              <CardDescription>
                We're working on your personalized exercise recommendations. Check back soon!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your AI-powered exercise plan will be tailored to your fitness level, goals, and preferences.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 