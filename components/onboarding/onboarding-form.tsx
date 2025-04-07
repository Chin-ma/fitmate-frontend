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
    image: '/ectomoprh.png'
  },
  {
    id: 'mesomorph',
    title: 'Mesomorph',
    description: 'Athletic and muscular, easy to gain/lose weight',
    image: '/mesomorph.png'
  },
  {
    id: 'endomorph',
    title: 'Endomorph',
    description: 'Soft and round, difficulty losing weight',
    image: '/endomorph.png'
  }
];

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  age: z.coerce.number().min(1, 'Age is required'),
  height: z.coerce.number().min(1, 'Height is required'),
  weight: z.coerce.number().min(1, 'Weight is required'),
  body_type: z.enum(['ectomorph', 'mesomorph', 'endomorph']),
  goal: z.enum(['weight_loss', 'bulk', 'fit_body']),
  meal_pref: z.enum(['vegetarian', 'non_vegetarian', 'vegan']),
  allergies: z.array(z.string()),
  exercise: z.enum(['beginner', 'intermediate', 'advanced']),
  push_up: z.coerce.number().optional(),
  pull_up: z.coerce.number().optional()
});

export function OnboardingForm() {
  const [allergies, setAllergies] = useState<string[]>([]);
  const [allergyInput, setAllergyInput] = useState('');
  const [showFitnessTest, setShowFitnessTest] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      age: 1,
      height: 0,
      weight: 0,
      body_type: 'mesomorph',
      goal: 'fit_body',
      meal_pref: 'non_vegetarian',
      allergies: [],
      exercise: 'beginner',
      push_up: 0,
      pull_up: 0
    }
  });

  // Fetch user data when component mounts
  React.useEffect(() => {
    // Try to get email from localStorage first (for client-side persistence)
    const storedEmail = localStorage.getItem('userEmail');
    
    if (storedEmail) {
      form.setValue('email', storedEmail);
    } else {
      // If not in localStorage, try to fetch from backend
      fetch('http://127.0.0.1:5000/api/user/current')
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }
          return response.json();
        })
        .then(data => {
          if (data.email) {
            form.setValue('email', data.email);
            // Save to localStorage for future use
            localStorage.setItem('userEmail', data.email);
          }
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
    }
  }, [form]);

  const [bmi, setBmi] = useState<number | null>(null);

  // Watch for changes in exerciseLevel
  const exercise = form.watch('exercise');
  
  // Update showFitnessTest when exerciseLevel changes
  React.useEffect(() => {
    setShowFitnessTest(['intermediate', 'advanced'].includes(exercise));
  }, [exercise]);

  const calculateBMI = (height: number | string, weight: number | string) => {
    const heightInMeters = Number(height) / 100;
    const weightInKg = Number(weight);
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
    // Calculate BMI before sending data
    const heightInMeters = values.height / 100;
    const weightInKg = values.weight;
    const calculatedBMI = weightInKg / (heightInMeters * heightInMeters);
    const roundedBMI = Math.round(calculatedBMI * 10) / 10;

    // Prepare the data to send to backend
    const formData = {
      name: values.name,
      email: values.email,
      age: values.age,
      height: values.height,
      weight: values.weight,
      bmi: roundedBMI,
      body_type: values.body_type,
      goal: values.goal,
      meal_pref: values.meal_pref,
      allergies: values.allergies,
      exercise: values.exercise,
      push_up: values.push_up || null,
      pull_up: values.pull_up || null
    };

    // Send form data to backend
    fetch('http://127.0.0.1:5000/api/user/update_user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update user data');
      }
      return response.json();
    })
    .then(data => {
      console.log('User data updated successfully:', data);
      // Save email to localStorage for future reference
      localStorage.setItem('userEmail', values.email);
      // You can add navigation or success message here
    })
    .catch(error => {
      console.error('Error updating user data:', error);
      // You can add error handling here
    });
  }

  return (
    <div className="container max-w-3xl py-10">
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-primary/5 rounded-t-lg pb-6">
          <CardTitle className="text-2xl font-bold text-primary">Complete Your Profile</CardTitle>
          <CardDescription className="text-base">
            Help us create a personalized fitness and nutrition plan for you
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8 px-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Personal Information Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium border-b pb-2">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your full name"
                            className="h-10"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email Field */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your email"
                            className="h-10"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Age Field */}
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Age</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Your age"
                            className="h-10"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Body Metrics Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium border-b pb-2">Body Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Height (cm)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Your height in cm"
                            className="h-10"
                            {...field}
                            onChange={(e) => {
                              field.onChange(Number(e.target.value));
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
                        <FormLabel className="font-medium">Weight (kg)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Your weight in kg"
                            className="h-10"
                            {...field}
                            onChange={(e) => {
                              field.onChange(Number(e.target.value));
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
                  <div className="p-4 bg-muted rounded-lg flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="font-bold text-primary">{bmi}</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Your BMI</h4>
                      <p className="text-sm text-muted-foreground">
                        {bmi < 18.5 ? 'Underweight' :
                         bmi < 25 ? 'Normal weight' :
                         bmi < 30 ? 'Overweight' : 'Obese'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Body Type Selection */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium border-b pb-2">Body Type</h3>
                <FormField
                  control={form.control}
                  name="body_type"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-1 md:grid-cols-3 gap-4"
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
                                className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-accent/50 hover:shadow-md ${
                                  field.value === type.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-muted'
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
              </div>

              {/* Fitness Goals & Preferences */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium border-b pb-2">Fitness Goals & Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="goal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Your Goal</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-10">
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

                  <FormField
                    control={form.control}
                    name="meal_pref"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Meal Preference</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-10">
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

                  <FormField
                    control={form.control}
                    name="exercise"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="font-medium">Exercise Experience</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-10">
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
                </div>
              </div>

              {/* Allergies */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">Dietary Restrictions</h3>
                <FormItem>
                  <FormLabel className="font-medium">Allergies</FormLabel>
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
                        className="h-10"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => addAllergy(allergyInput)}
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 min-h-10">
                      {allergies.map((allergy) => (
                        <Badge key={allergy} variant="secondary" className="px-3 py-1 text-sm">
                          {allergy}
                          <button
                            type="button"
                            onClick={() => removeAllergy(allergy)}
                            className="ml-2 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </FormItem>
              </div>

              {/* Conditional Fitness Test Fields */}
              {showFitnessTest && (
                <div className="space-y-6 rounded-lg border p-6 bg-muted/30">
                  <h3 className="text-lg font-medium">Fitness Assessment</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Please complete a quick fitness test to help us better customize your workout plan
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="push_up"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium">Max Push-ups</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Number of push-ups"
                              className="h-10"
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
                      name="pull_up"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium">Max Pull-ups</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Number of pull-ups"
                              className="h-10"
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

              <Button type="submit" className="w-full h-12 mt-8 text-base font-medium">
                Complete Profile
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 