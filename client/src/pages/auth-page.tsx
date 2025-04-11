import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Shield, ShieldAlert, Lock, User, Mail, UserCircle } from "lucide-react";

// Login form schema
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Register form schema
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  bio: z.string().optional(),
  avatarUrl: z.string().optional(),
});

export default function AuthPage() {
  const [tab, setTab] = useState("login");
  const [location, navigate] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();

  // If user is already logged in, redirect to home
  if (user) {
    navigate("/");
    return null;
  }

  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      fullName: "",
      bio: "",
      avatarUrl: "",
    },
  });

  // Form submission handlers
  const onLoginSubmit = (data: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: z.infer<typeof registerSchema>) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-black">
      {/* Left section with form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md border border-gray-800 hover:border-red-700/70 bg-gray-900 text-white shadow-xl shadow-red-900/10 transition-colors duration-300">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-red-900/20 via-transparent to-transparent blur-xl opacity-50 -z-10"></div>
          <CardHeader className="space-y-2">
            <div className="mx-auto mb-2 rounded-full bg-black/30 p-2 border border-red-700/30 w-12 h-12 flex items-center justify-center">
              {tab === "login" ? (
                <Lock className="w-6 h-6 text-red-500" />
              ) : (
                <UserCircle className="w-6 h-6 text-red-500" />
              )}
            </div>
            <CardTitle className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">
              {tab === "login" ? "Access Your Account" : "Join Cyber Iraq"}
            </CardTitle>
            <CardDescription className="text-center text-gray-400">
              {tab === "login" 
                ? "Enter your credentials to continue your training" 
                : "Create an account to start your cybersecurity journey"}
            </CardDescription>
          </CardHeader>
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6 bg-black/50 p-1 rounded-lg mx-6 border border-gray-800">
              <TabsTrigger 
                value="login" 
                className="rounded data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-800 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="register" 
                className="rounded data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-800 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
              >
                Register
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Username</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-2 top-2.5 h-5 w-5 text-gray-500" />
                            <Input 
                              placeholder="username" 
                              className="pl-9 bg-gray-900 border-gray-700" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-2 top-2.5 h-5 w-5 text-gray-500" />
                            <Input 
                              type="password" 
                              placeholder="••••••••" 
                              className="pl-9 bg-gray-900 border-gray-700" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        <span>Logging in...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        <span>Login</span>
                      </div>
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="register">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Username</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-2 top-2.5 h-5 w-5 text-gray-500" />
                            <Input 
                              placeholder="username" 
                              className="pl-9 bg-gray-900 border-gray-700" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-2 top-2.5 h-5 w-5 text-gray-500" />
                            <Input 
                              type="email" 
                              placeholder="your@email.com" 
                              className="pl-9 bg-gray-900 border-gray-700" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <UserCircle className="absolute left-2 top-2.5 h-5 w-5 text-gray-500" />
                            <Input 
                              placeholder="John Doe" 
                              className="pl-9 bg-gray-900 border-gray-700" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-2 top-2.5 h-5 w-5 text-gray-500" />
                            <Input 
                              type="password" 
                              placeholder="••••••••" 
                              className="pl-9 bg-gray-900 border-gray-700" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        <span>Creating account...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="h-5 w-5" />
                        <span>Create Account</span>
                      </div>
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
      
      {/* Right section with hero content */}
      <div className="hidden lg:flex flex-1 flex-col justify-center p-12 bg-gradient-to-br from-black to-gray-900">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            <span className="block">Master Cybersecurity with</span>
            <span className="block mt-2 text-6xl text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">Cyber Iraq</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-md">
            Join our premium cybersecurity education platform and learn from industry experts through hands-on courses, labs, and challenges.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="border border-red-500 rounded-lg p-4 bg-black bg-opacity-50">
              <h3 className="font-bold text-white">Immersive Learning</h3>
              <p className="text-gray-400">Practical labs and real-world scenarios</p>
            </div>
            <div className="border border-red-500 rounded-lg p-4 bg-black bg-opacity-50">
              <h3 className="font-bold text-white">Expert Instructors</h3>
              <p className="text-gray-400">Learn from industry professionals</p>
            </div>
            <div className="border border-red-500 rounded-lg p-4 bg-black bg-opacity-50">
              <h3 className="font-bold text-white">Live Workshops</h3>
              <p className="text-gray-400">Interactive sessions with experts</p>
            </div>
            <div className="border border-red-500 rounded-lg p-4 bg-black bg-opacity-50">
              <h3 className="font-bold text-white">Community Support</h3>
              <p className="text-gray-400">Connect with other security enthusiasts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}