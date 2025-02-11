"use client"
import React, { FormEvent } from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from "js-cookie"


const LoginForm = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");
  const router = useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const loginData = {
      email,
      password,
    };
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
    const response = await fetch("/api/auth/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    const data = await response.json();
    // Check if the login was successful
    if (response.ok) {
      // generate a cookie
      Cookies.set('isAdmin', 'true', { 
        expires: 365,
        secure: true,
        sameSite: 'strict'
      });

      // Redirect to the dashboard  
      router.push("/dashboard");
    }else {
      setError(data.message || "Login failed. Please try again.");
    }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  }
  


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        
        <CardHeader >
          <CardDescription className="text-xl font-bold text-center">
            Login to LogoLab Nepal Dashboard
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>
            {error && <p className="text-red-500 text-start text-sm">{error}</p>}
          </CardContent>
          
          <CardFooter>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
           
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginForm;