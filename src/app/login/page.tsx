"use client";

import { useAuth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageTransition } from "@/components/page-transition";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const { user, loading, signInWithGoogle, emailSignIn, emailSignUp } = useAuth();
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (!loading && user) {
      router.push("/journal");
    }
  }, [user, loading, router]);

  const handleEmailAuth: SubmitHandler<FormValues> = async (data, event) => {
    setAuthError(null);
    const isSignIn = (event?.nativeEvent as SubmitEvent).submitter?.innerText.includes("Sign In");
    try {
      if (isSignIn) {
        await emailSignIn(data.email, data.password);
      } else {
        await emailSignUp(data.email, data.password);
      }
      router.push("/journal");
    } catch (error: any) {
        handleAuthError(error);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setAuthError(null);
    try {
        await signInWithGoogle();
        router.push('/journal');
    } catch (error: any) {
        handleAuthError(error);
    }
  }

  const handleAuthError = (error: any) => {
    switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setAuthError('Invalid email or password. Please try again.');
          break;
        case 'auth/email-already-in-use':
          setAuthError('An account with this email already exists.');
          break;
        default:
          setAuthError('An unexpected error occurred. Please try again.');
          break;
      }
  }


  if (loading || user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="flex items-center justify-center min-h-screen p-4">
        <Tabs defaultValue="signin" className="w-full max-w-sm">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>Sign in to continue your journey.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(handleEmailAuth)} className="space-y-4">
                  {authError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Authentication Error</AlertTitle>
                      <AlertDescription>{authError}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email-signin">Email</Label>
                    <Input id="email-signin" type="email" placeholder="m@example.com" {...register("email")} />
                    {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signin">Password</Label>
                    <Input id="password-signin" type="password" {...register("password")} />
                    {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                  </div>
                  <Button type="submit" className="w-full">Sign In</Button>
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or continue with</span></div>
                  </div>
                  <Button variant="outline" className="w-full" type="button" onClick={handleGoogleSignIn}>
                    Sign in with Google
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="signup">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle>Create an Account</CardTitle>
                <CardDescription>Start your journey with EchoJournal today.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(handleEmailAuth)} className="space-y-4">
                 {authError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Authentication Error</AlertTitle>
                      <AlertDescription>{authError}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email-signup">Email</Label>
                    <Input id="email-signup" type="email" placeholder="m@example.com" {...register("email")} />
                     {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signup">Password</Label>
                    <Input id="password-signup" type="password" {...register("password")} />
                    {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                  </div>
                  <Button type="submit" className="w-full">Sign Up</Button>
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or continue with</span></div>
                  </div>
                  <Button variant="outline" className="w-full" type="button" onClick={handleGoogleSignIn}>
                    Sign up with Google
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
}
