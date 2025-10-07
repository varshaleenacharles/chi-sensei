import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AuthPage = () => {
  const { user, signIn, signUp, loading } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signInError, setSignInError] = useState('');
  const [signUpError, setSignUpError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSignInError('');
    setSignUpError(''); // Clear sign up errors
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      console.log('Attempting sign in with:', { email, passwordLength: password.length });
      const { data, error } = await signIn(email, password);
      
      if (error) {
        console.log('Sign in error details:', error);
        let errorMessage = error.message;
        
        // Provide more user-friendly error messages for common sign-in errors
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Please check your email and click the confirmation link before signing in. If you just signed up, check your email inbox.';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Too many login attempts. Please wait a moment before trying again.';
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'Please enter a valid email address.';
        } else if (error.message.includes('User not found')) {
          errorMessage = 'No account found with this email address. Please sign up first.';
        } else if (error.message.includes('Wrong password')) {
          errorMessage = 'Incorrect password. Please try again or reset your password.';
        }
        
        setSignInError(errorMessage);
        // Only show toast for critical errors, not validation errors
        if (!error.message.includes('Invalid login credentials') && !error.message.includes('Email not confirmed')) {
          toast({
            title: "Sign In Failed",
            description: errorMessage,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred. Please try again.';
      setSignInError(errorMessage);
      toast({
        title: "Sign In Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
    
    setIsSubmitting(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSignUpError('');
    setSignInError(''); // Clear sign in errors
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;
    const role = formData.get('role') as string;

    try {
      console.log('Starting signup process...');
      const { data, error } = await signUp(email, password, {
        full_name: fullName,
        role: role
      });
      
      console.log('Signup completed:', { data, error });
      
      if (error) {
        let errorMessage = error.message;
        
        // Provide more user-friendly error messages for common sign-up errors
        if (error.message.includes('User already registered') || error.message.includes('already registered')) {
          errorMessage = 'An account with this email already exists. Please sign in instead.';
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = 'Password must be at least 6 characters long.';
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'Please enter a valid email address.';
        } else if (error.message.includes('Signup is disabled')) {
          errorMessage = 'New account registration is currently disabled. Please contact support.';
        } else if (error.message.includes('Email rate limit exceeded')) {
          errorMessage = 'Too many signup attempts. Please wait before trying again.';
        }
        
        setSignUpError(errorMessage);
        // Only show toast for critical errors, not validation errors
        if (!error.message.includes('already registered') && !error.message.includes('Password should be at least') && !error.message.includes('Invalid email')) {
          toast({
            title: "Sign Up Failed",
            description: errorMessage,
            variant: "destructive",
          });
        }
      } else {
        // Clear any previous errors
        setSignUpError('');
        
        // Check if user was created and if email confirmation is required
        if (data?.user) {
          console.log('Signup successful, user created:', {
            id: data.user.id,
            email: data.user.email,
            email_confirmed_at: data.user.email_confirmed_at
          });
          
          if (data.user.email_confirmed_at) {
            // User is already confirmed (shouldn't happen with email confirmation enabled)
            toast({
              title: "Sign Up Successful!",
              description: "Your account has been created successfully. You can now sign in.",
            });
          } else {
            // User needs email confirmation
            toast({
              title: "Sign Up Successful!",
              description: "Please check your email and click the confirmation link to complete your registration.",
              duration: 10000,
            });
          }
        } else {
          // No user data returned - this might indicate an issue
          console.warn('No user data returned from signup:', data);
          toast({
            title: "Sign Up Successful!",
            description: "Please check your email and click the confirmation link to complete your registration.",
            duration: 10000,
          });
        }
      }
    } catch (error) {
      console.error('Signup catch block error:', error);
      const errorMessage = 'An unexpected error occurred during registration. Please try again.';
      setSignUpError(errorMessage);
      toast({
        title: "Sign Up Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
    
    setIsSubmitting(false);
  };

  const handleResendConfirmation = async () => {
    if (!user?.email) return;
    
    setResendLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Confirmation email sent",
          description: "Please check your email for the confirmation link.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend confirmation email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setResendLoading(false);
    }
  };

  const clearErrors = () => {
    setSignInError('');
    setSignUpError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">KMRL Dashboard</CardTitle>
          <CardDescription>Access your role-based dashboard</CardDescription>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-2 space-x-2">
              <button
                onClick={() => {
                  console.log('Testing signup...');
                  (window as any).testAuth?.testSignup('test@example.com', 'password123');
                }}
                className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
              >
                Test Signup
              </button>
              <button
                onClick={() => {
                  console.log('Testing email verification...');
                  (window as any).testAuth?.testEmailVerification();
                }}
                className="text-xs bg-green-200 text-green-700 px-2 py-1 rounded hover:bg-green-300"
              >
                Test Email Verification
              </button>
              <button
                onClick={() => {
                  console.log('Testing complete auth flow...');
                  (window as any).testAuth?.testCompleteAuthFlow();
                }}
                className="text-xs bg-blue-200 text-blue-700 px-2 py-1 rounded hover:bg-blue-300"
              >
                Test Full Flow
              </button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="space-y-4" onValueChange={clearErrors}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="signin-password">Password</Label>
                    <button
                      type="button"
                      className="text-sm text-blue-600 hover:text-blue-800 underline"
                      onClick={() => {
                        toast({
                          title: "Password Reset",
                          description: "Password reset functionality will be implemented soon.",
                        });
                      }}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <Input
                    id="signin-password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                {signInError && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {signInError}
                      {signInError.includes('Invalid email or password') && (
                        <div className="mt-2 text-sm">
                          <p className="font-medium">Troubleshooting tips:</p>
                          <ul className="list-disc list-inside mt-1 space-y-1">
                            <li>Make sure you're using the correct email address</li>
                            <li>Check if Caps Lock is enabled</li>
                            <li>If you just signed up, check your email for a confirmation link</li>
                            <li>Try signing up if you don't have an account yet</li>
                          </ul>
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-role">Role</Label>
                  <Select name="role" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="System Admin">System Admin</SelectItem>
                      <SelectItem value="Chairman">Chairman</SelectItem>
                      <SelectItem value="MD">MD</SelectItem>
                      <SelectItem value="Chief Secretary">Chief Secretary</SelectItem>
                      <SelectItem value="Executive">Executive</SelectItem>
                      <SelectItem value="Director">Director</SelectItem>
                      <SelectItem value="Finance Director">Finance Director</SelectItem>
                      <SelectItem value="Projects Director">Projects Director</SelectItem>
                      <SelectItem value="Systems Director">Systems Director</SelectItem>
                      <SelectItem value="Legal Director">Legal Director</SelectItem>
                      <SelectItem value="Safety Director">Safety Director</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Finance Manager">Finance Manager</SelectItem>
                      <SelectItem value="Projects Manager">Projects Manager</SelectItem>
                      <SelectItem value="Systems Manager">Systems Manager</SelectItem>
                      <SelectItem value="Legal Manager">Legal Manager</SelectItem>
                      <SelectItem value="Safety Manager">Safety Manager</SelectItem>
                      <SelectItem value="Staff">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    required
                    minLength={6}
                  />
                </div>
                {signUpError && (
                  <Alert variant="destructive">
                    <AlertDescription>{signUpError}</AlertDescription>
                  </Alert>
                )}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;