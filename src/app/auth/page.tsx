'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';

type AuthMode = 'signin' | 'signup';

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  useEffect(() => {
    const urlMode = searchParams?.get('mode');
    if (urlMode === 'signin' || urlMode === 'signup') {
      setMode(urlMode);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Add authentication logic here
    setTimeout(() => setLoading(false), 1000);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Add forgot password logic here
    setTimeout(() => {
      setLoading(false);
      setShowForgotPassword(false);
    }, 1000);
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">Reset Password</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>

          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                required 
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Sending reset link...
                </div>
              ) : (
                'Send Reset Link'
              )}
            </Button>

            <button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              className="w-full text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Back to Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            {mode === 'signin' ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {mode === 'signin' 
              ? 'Sign in to access your account' 
              : 'Sign up to get started with The City Flyers'}
          </p>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {/* Add Google auth */}}
          >
            <FcGoogle className="mr-2 h-4 w-4" />
            Google
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {/* Add Apple auth */}}
          >
            <FaApple className="mr-2 h-4 w-4" />
            Apple
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-gray-800 px-2 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'signup' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" required />
              </div>

              <div className="space-y-2">
                <Label>Gender</Label>
                <RadioGroup defaultValue="male" className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input 
                  id="mobile" 
                  type="tel" 
                  placeholder="+880 1XXX-XXXXXX"
                  pattern="^\+880[0-9]{10}$"
                  required 
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@example.com" 
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              required 
            />
          </div>

          {mode === 'signin' && (
            <div className="text-sm text-right">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-primary hover:text-primary/80"
              >
                Forgot password?
              </button>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
              </div>
            ) : (
              mode === 'signin' ? 'Sign in' : 'Create account'
            )}
          </Button>
        </form>

        <div className="text-center text-sm">
          {mode === 'signin' ? (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => setMode('signup')}
                className="font-semibold text-primary hover:text-primary/80"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => setMode('signin')}
                className="font-semibold text-primary hover:text-primary/80"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}