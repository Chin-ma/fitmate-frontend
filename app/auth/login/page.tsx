"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/header';
import { useRouter } from 'next/navigation';

interface UserData {
  email: string;
}

export default function LoginPage() {
  const [userData, setUserData] = useState<UserData>({
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Send user data to the backend
      const response = await fetch('http://127.0.0.1:5000/api/user/login_or_signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      // If login successful, redirect to onboarding or dashboard
      const responseData = await response.json();
      // Store email in localStorage for use in other components
      localStorage.setItem('userEmail', userData.email);
      
      router.push('/dashboard/onboarding');
    } catch (error) {
      console.error('Failed to authenticate:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome to FitMate AI</CardTitle>
            <CardDescription>
              Enter your email to get started with your fitness journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={userData.email}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    We'll use this to save your fitness data
                  </p>
                </div>
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Continue"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              By continuing, you agree to our{' '}
              <a href="/terms" className="underline underline-offset-4 hover:text-primary">
                Terms of Service
              </a>
              {' '}and{' '}
              <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
                Privacy Policy
              </a>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
} 