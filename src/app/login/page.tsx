"use client";

import { useFirebase, initiateEmailSignUp, initiateEmailSignIn } from "@/firebase";
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
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { signInWithPopup, GoogleAuthProvider, updateProfile, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

const signUpSchema = z.object({
    nickname: z.string().min(2, { message: "Nickname must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type SignInValues = z.infer<typeof signInSchema>;
type SignUpValues = z.infer<typeof signUpSchema>;

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" {...props}>
        <path
        fill="currentColor"
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.3 1.62-3.9 1.62-3.03 0-5.49-2.3-5.49-5.09s2.46-5.09 5.49-5.09c1.3 0 2.23.51 3.03 1.25l2.19-2.19C18.01 3.99 15.47 3 12.48 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c4.97 0 9-4.03 9-9 0-.61-.05-1.22-.16-1.84h-8.84z"
        />
    </svg>
);


export default function LoginPage() {
  const { user, isUserLoading, auth, firestore } = useFirebase();
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("signin");
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  const { register: registerSignIn, handleSubmit: handleSubmitSignIn, formState: { errors: errorsSignIn } } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
  });

  const { register: registerSignUp, handleSubmit: handleSubmitSignUp, formState: { errors: errorsSignUp } } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
  });

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push("/journal");
    }
  }, [user, isUserLoading, router]);
  
  const handleTabChange = (value: string) => {
    setAuthError(null);
    setActiveTab(value);
  }

  const handleSignIn: SubmitHandler<SignInValues> = async (data) => {
    setAuthError(null);
    try {
        initiateEmailSignIn(auth, data.email, data.password);
    } catch (error: any) {
        handleAuthError(error);
    }
  };

  const handleSignUp: SubmitHandler<SignUpValues> = async (data) => {
    setAuthError(null);
    try {
      // We handle user creation manually here to also create the user doc
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const newUser = userCredential.user;
      if (newUser) {
          await updateProfile(newUser, { displayName: data.nickname });
          const userDocRef = doc(firestore, "users", newUser.uid);
          await setDoc(userDocRef, {
              id: newUser.uid,
              nickname: data.nickname,
              email: newUser.email,
              createdAt: new Date().toISOString(),
          });
      }
      router.push("/journal");
    } catch (error: any) {
        handleAuthError(error);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setAuthError(null);
    try {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        const newUser = userCredential.user;
         if (newUser) {
            const userDocRef = doc(firestore, "users", newUser.uid);
            await setDoc(userDocRef, {
                id: newUser.uid,
                nickname: newUser.displayName,
                email: newUser.email,
                createdAt: new Date().toISOString(),
            }, { merge: true }); // Merge to avoid overwriting existing data
        }
        router.push('/journal');
    } catch (error: any) {
        handleAuthError(error);
    }
  }

  const handleAuthError = (error: any) => {
    switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          setAuthError('Invalid email or password. Please try again.');
          break;
        case 'auth/email-already-in-use':
          setAuthError('An account with this email already exists.');
          break;
        default:
          setAuthError('An unexpected error occurred. Please try again.');
          console.error(error);
          break;
      }
  }


  if (isUserLoading || user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="flex items-center justify-center min-h-screen p-4">
        <Tabs defaultValue="signin" className="w-full max-w-sm" onValueChange={handleTabChange} value={activeTab}>
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
                <form onSubmit={handleSubmitSignIn(handleSignIn)} className="space-y-4">
                  {authError && activeTab === 'signin' && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Authentication Error</AlertTitle>
                      <AlertDescription>{authError}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email-signin">Email</Label>
                    <Input id="email-signin" type="email" placeholder="m@example.com" {...registerSignIn("email")} />
                    {errorsSignIn.email && <p className="text-sm text-destructive">{errorsSignIn.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signin">Password</Label>
                    <div className="relative">
                      <Input id="password-signin" type={showSignInPassword ? 'text' : 'password'} {...registerSignIn("password")} />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-1/2 right-2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                        onClick={() => setShowSignInPassword(prev => !prev)}
                      >
                        {showSignInPassword ? <EyeOff /> : <Eye />}
                      </Button>
                    </div>
                    {errorsSignIn.password && <p className="text-sm text-destructive">{errorsSignIn.password.message}</p>}
                  </div>
                  <Button type="submit" className="w-full">Sign In</Button>
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or continue with</span></div>
                  </div>
                  <Button variant="outline" className="w-full" type="button" onClick={handleGoogleSignIn}>
                    <GoogleIcon className="mr-2 h-4 w-4" />
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
                <form onSubmit={handleSubmitSignUp(handleSignUp)} className="space-y-4">
                 {authError && activeTab === 'signup' && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Authentication Error</AlertTitle>
                      <AlertDescription>{authError}</AlertDescription>
                    </Alert>
                  )}
                   <div className="space-y-2">
                    <Label htmlFor="nickname-signup">Nickname</Label>
                    <Input id="nickname-signup" type="text" placeholder="Your Nickname" {...registerSignUp("nickname")} />
                     {errorsSignUp.nickname && <p className="text-sm text-destructive">{errorsSignUp.nickname.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-signup">Email</Label>
                    <Input id="email-signup" type="email" placeholder="m@example.com" {...registerSignUp("email")} />
                     {errorsSignUp.email && <p className="text-sm text-destructive">{errorsSignUp.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signup">Password</Label>
                    <div className="relative">
                      <Input id="password-signup" type={showSignUpPassword ? 'text' : 'password'} {...registerSignUp("password")} />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-1/2 right-2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                        onClick={() => setShowSignUpPassword(prev => !prev)}
                      >
                        {showSignUpPassword ? <EyeOff /> : <Eye />}
                      </Button>
                    </div>
                    {errorsSignUp.password && <p className="text-sm text-destructive">{errorsSignUp.password.message}</p>}
                  </div>
                  <Button type="submit" className="w-full">Sign Up</Button>
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or continue with</span></div>
                  </div>
                  <Button variant="outline" className="w-full" type="button" onClick={handleGoogleSignIn}>
                    <GoogleIcon className="mr-2 h-4 w-4" />
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
