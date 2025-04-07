"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/header';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Here you would call your API to send OTP
      // const response = await fetch('/api/auth/send-otp', {
      //   method: 'POST',
      //   body: JSON.stringify({ phoneNumber }),
      // });

      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsOtpSent(true);
    } catch (error) {
      console.error('Failed to send OTP:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Here you would call your API to verify OTP
      // const response = await fetch('/api/auth/verify-otp', {
      //   method: 'POST',
      //   body: JSON.stringify({ phoneNumber, otp }),
      // });

      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // If verification successful, redirect to onboarding or dashboard
      router.push('/dashboard/onboarding');
    } catch (error) {
      console.error('Failed to verify OTP:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome to FitMate AI</CardTitle>
            <CardDescription>
              {isOtpSent 
                ? "Enter the OTP sent to your mobile number" 
                : "Enter your mobile number to get started"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isOtpSent ? (
              <form onSubmit={handleSendOtp}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Mobile Number</Label>
                    <div className="flex gap-2">
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your mobile number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="flex-1"
                        pattern="[0-9]*"
                        maxLength={10}
                        required
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      We'll send you a one-time password
                    </p>
                  </div>
                  <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? "Sending OTP..." : "Send OTP"}
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="otp">Enter OTP</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      pattern="[0-9]*"
                      maxLength={6}
                      required
                    />
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        OTP sent to {phoneNumber}
                      </p>
                      <Button
                        variant="link"
                        className="p-0 h-auto font-normal text-sm"
                        onClick={() => setIsOtpSent(false)}
                        type="button"
                      >
                        Change number
                      </Button>
                    </div>
                  </div>
                  <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? "Verifying..." : "Verify OTP"}
                  </Button>
                  <Button
                    variant="link"
                    className="w-full"
                    onClick={handleSendOtp}
                    type="button"
                    disabled={isLoading}
                  >
                    Resend OTP
                  </Button>
                </div>
              </form>
            )}
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