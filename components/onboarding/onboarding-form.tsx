"use client"
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import React from 'react';

const bodyTypes = [
  {
    id: 'ectomorph',
    title: 'Ectomorph',
    description: 'Lean and long, difficulty gaining weight',
    image: '/images/body-types/ectomorph.png'
  },
  {
    id: 'mesomorph',
    title: 'Mesomorph',
    description: 'Athletic and muscular, easy to gain/lose weight',
    image: '/images/body-types/mesomorph.png'
  },
  {
    id: 'endomorph',
    title: 'Endomorph',
    description: 'Soft and round, difficulty losing weight',
    image: '/images/body-types/endomorph.png'
  }
];

const formSchema = z.object({
  height: z.string().min(1, 'Height is required'),
  weight: z.string().min(1, 'Weight is required'),
  bodyType: z.enum(['ectomorph', 'mesomorph', 'endomorph']),
  goal: z.enum(['weight_loss', 'bulk', 'fit_body']),
  mealPreference: z.enum(['vegetarian', 'non_vegetarian', 'vegan']),
  allergies: z.array(z.string()),
  exerciseLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  pushUpCount: z.string().optional(),
  pullUpCount: z.string().optional()
});

export function OnboardingForm() {
  const [allergies, setAllergies] = useState<string[]>([]);
  const [allergyInput, setAllergyInput] = useState('');
  const [showFitnessTest, setShowFitnessTest] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      height: '',
      weight: '',
      bodyType: 'mesomorph',
      goal: 'fit_body',
      mealPreference: 'non_vegetarian',
      allergies: [],
      exerciseLevel: 'beginner',
      pushUpCount: '',
      pullUpCount: ''
    }
  });

  const [bmi, setBmi] = useState<number | null>(null);

  // Watch for changes in exerciseLevel
  const exerciseLevel = form.watch('exerciseLevel');
  
  // Update showFitnessTest when exerciseLevel changes
  React.useEffect(() => {
    setShowFitnessTest(['intermediate', 'advanced'].includes(exerciseLevel));
  }, [exerciseLevel]);

  const calculateBMI = (height: string, weight: string) => {
    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    if (heightInMeters > 0 && weightInKg > 0) {
      const bmi = weightInKg / (heightInMeters * heightInMeters);
      setBmi(Math.round(bmi * 10) / 10);
    }
  };

  const addAllergy = (allergy: string) => {
    if (allergy.trim() && !allergies.includes(allergy.trim())) {
      const newAllergies = [...allergies, allergy.trim()];
      setAllergies(newAllergies);
      form.setValue('allergies', newAllergies);
      setAllergyInput('');
    }
  };

  const removeAllergy = (allergy: string) => {
    const newAllergies = allergies.filter(a => a !== allergy);
    setAllergies(newAllergies);
    form.setValue('allergies', newAllergies);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Here you would typically send the data to your backend
  }

  return (
    <div className="container max-w-3xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            Help us create a personalized fitness and nutrition plan for you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Body Measurements */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (cm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            calculateBMI(e.target.value, form.getValues('weight'));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            calculateBMI(form.getValues('height'), e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* BMI Display */}
              {bmi && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-medium">Your BMI: {bmi}</p>
                  <p className="text-sm text-muted-foreground">
                    {bmi < 18.5 ? 'Underweight' :
                     bmi < 25 ? 'Normal weight' :
                     bmi < 30 ? 'Overweight' : 'Obese'}
                  </p>
                </div>
              )}

              {/* Body Type Selection */}
              <FormField
                control={form.control}
                name="bodyType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Body Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-3 gap-4"
                      >
                        {bodyTypes.map((type) => (
                          <div key={type.id} className="relative">
                            <RadioGroupItem
                              value={type.id}
                              id={type.id}
                              className="sr-only"
                            />
                            <label
                              htmlFor={type.id}
                              className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-accent ${
                                field.value === type.id ? 'border-primary' : 'border-muted'
                              }`}
                            >
                              <img
                                src={type.image}
                                alt={type.title}
                                className="w-24 h-40 object-contain mb-2"
                              />
                              <h4 className="font-medium">{type.title}</h4>
                              <p className="text-sm text-muted-foreground text-center">
                                {type.description}
                              </p>
                            </label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Goal Selection */}
              <FormField
                control={form.control}
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Goal</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your goal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="weight_loss">Weight Loss</SelectItem>
                        <SelectItem value="bulk">Muscle Gain</SelectItem>
                        <SelectItem value="fit_body">Overall Fitness</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Meal Preference */}
              <FormField
                control={form.control}
                name="mealPreference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meal Preference</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select meal preference" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="non_vegetarian">Non-Vegetarian</SelectItem>
                        <SelectItem value="vegan">Vegan</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Allergies */}
              <FormItem>
                <FormLabel>Allergies</FormLabel>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={allergyInput}
                      onChange={(e) => setAllergyInput(e.target.value)}
                      placeholder="Type an allergy and press Enter"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addAllergy(allergyInput);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addAllergy(allergyInput)}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {allergies.map((allergy) => (
                      <Badge key={allergy} variant="secondary">
                        {allergy}
                        <button
                          type="button"
                          onClick={() => removeAllergy(allergy)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </FormItem>

              {/* Exercise Level */}
              <FormField
                control={form.control}
                name="exerciseLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exercise Experience</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your experience level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      This helps us tailor the exercise intensity to your level
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Conditional Fitness Test Fields */}
              {showFitnessTest && (
                <div className="space-y-4 rounded-lg border p-4 bg-muted/50">
                  <h3 className="font-medium">Fitness Assessment</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Please complete a quick fitness test to help us better customize your workout plan
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="pushUpCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Push-ups</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Number of push-ups"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Maximum push-ups in one set
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pullUpCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Pull-ups</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Number of pull-ups"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Maximum pull-ups in one set
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full">
                Complete Profile
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 