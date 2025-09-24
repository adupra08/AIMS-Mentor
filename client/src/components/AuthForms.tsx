import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { EyeIcon, EyeOffIcon, Mail, Lock, User } from "lucide-react";

// Form schemas matching backend validation
const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const requestPasswordSetupSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const completePasswordSetupSchema = z.object({
  email: z.string().email("Invalid email address"),
  token: z.string().min(1, "Setup token is required"),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});


type RegisterData = z.infer<typeof registerSchema>;
type LoginData = z.infer<typeof loginSchema>;
type RequestPasswordSetupData = z.infer<typeof requestPasswordSetupSchema>;
type CompletePasswordSetupData = z.infer<typeof completePasswordSetupSchema>;

interface AuthFormsProps {
  onSuccess?: () => void;
}

export default function AuthForms({ onSuccess }: AuthFormsProps) {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [setupEmail, setSetupEmail] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  // Registration form
  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Login form
  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Password setup request form  
  const requestSetupForm = useForm<RequestPasswordSetupData>({
    resolver: zodResolver(requestPasswordSetupSchema),
    defaultValues: {
      email: "",
    },
  });

  // Password setup completion form
  const completeSetupForm = useForm<CompletePasswordSetupData>({
    resolver: zodResolver(completePasswordSetupSchema),
    defaultValues: {
      email: setupEmail,
      token: "",
      password: "",
      confirmPassword: "",
    },
  });


  // Registration mutation
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await apiRequest("POST", "/api/auth/register", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Registration Successful!",
        description: "You can now log in with your account.",
      });
      setActiveTab("login");
      registerForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Login Successful!",
        description: "Welcome back to AIMS.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      // Navigate to home page on successful login
      setLocation("/home");
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });


  const onRegister = (data: RegisterData) => {
    registerMutation.mutate(data);
  };

  const onLogin = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  // Password setup request mutation
  const requestSetupMutation = useMutation({
    mutationFn: async (data: RequestPasswordSetupData) => {
      const response = await apiRequest("POST", "/api/auth/request-password-setup", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Setup Instructions Sent!",
        description: "If an account exists with that email, we've sent password setup instructions.",
      });
      const email = requestSetupForm.getValues("email");
      setSetupEmail(email);
      completeSetupForm.reset({ email, token: "", password: "", confirmPassword: "" });
      setActiveTab("complete-setup");
      requestSetupForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Request Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Password setup completion mutation
  const completeSetupMutation = useMutation({
    mutationFn: async (data: CompletePasswordSetupData) => {
      const response = await apiRequest("POST", "/api/auth/complete-password-setup", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Password Set Successfully!",
        description: "Your password has been set. You can now log in.",
      });
      setActiveTab("login");
      completeSetupForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Setup Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onRequestSetup = (data: RequestPasswordSetupData) => {
    requestSetupMutation.mutate(data);
  };

  const onCompleteSetup = (data: CompletePasswordSetupData) => {
    completeSetupMutation.mutate(data);
  };


  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome to AIMS</CardTitle>
        <CardDescription>
          Sign in to your account or create a new one to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="login" data-testid="tab-login">Login</TabsTrigger>
            <TabsTrigger value="register" data-testid="tab-register">Register</TabsTrigger>
            <TabsTrigger value="setup-password" data-testid="tab-setup-password">Set Password</TabsTrigger>
            <TabsTrigger value="complete-setup" data-testid="tab-complete-setup">Complete Setup</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login" className="space-y-4">
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    data-testid="input-login-email"
                    {...loginForm.register("email")}
                  />
                </div>
                {loginForm.formState.errors.email && (
                  <p className="text-sm text-red-600" data-testid="error-login-email">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                    data-testid="input-login-password"
                    {...loginForm.register("password")}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                    data-testid="toggle-login-password"
                  >
                    {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
                {loginForm.formState.errors.password && (
                  <p className="text-sm text-red-600" data-testid="error-login-password">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
                data-testid="button-login"
              >
                {loginMutation.isPending ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>

          {/* Register Tab */}
          <TabsContent value="register" className="space-y-4">
            <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="register-firstName">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="register-firstName"
                      placeholder="First name"
                      className="pl-10"
                      data-testid="input-register-firstName"
                      {...registerForm.register("firstName")}
                    />
                  </div>
                  {registerForm.formState.errors.firstName && (
                    <p className="text-sm text-red-600" data-testid="error-register-firstName">
                      {registerForm.formState.errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-lastName">Last Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="register-lastName"
                      placeholder="Last name"
                      className="pl-10"
                      data-testid="input-register-lastName"
                      {...registerForm.register("lastName")}
                    />
                  </div>
                  {registerForm.formState.errors.lastName && (
                    <p className="text-sm text-red-600" data-testid="error-register-lastName">
                      {registerForm.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    data-testid="input-register-email"
                    {...registerForm.register("email")}
                  />
                </div>
                {registerForm.formState.errors.email && (
                  <p className="text-sm text-red-600" data-testid="error-register-email">
                    {registerForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    className="pl-10 pr-10"
                    data-testid="input-register-password"
                    {...registerForm.register("password")}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                    data-testid="toggle-register-password"
                  >
                    {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
                {registerForm.formState.errors.password && (
                  <p className="text-sm text-red-600" data-testid="error-register-password">
                    {registerForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="register-confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="pl-10 pr-10"
                    data-testid="input-register-confirmPassword"
                    {...registerForm.register("confirmPassword")}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    data-testid="toggle-register-confirmPassword"
                  >
                    {showConfirmPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
                {registerForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-600" data-testid="error-register-confirmPassword">
                    {registerForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={registerMutation.isPending}
                data-testid="button-register"
              >
                {registerMutation.isPending ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>

          {/* Password Setup Request Tab */}
          <TabsContent value="setup-password" className="space-y-4">
            <div className="text-center text-sm text-gray-600 mb-4">
              Enter your email to set up a password for your existing account.
            </div>
            <form onSubmit={requestSetupForm.handleSubmit(onRequestSetup)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="setup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="setup-email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    data-testid="input-setup-email"
                    {...requestSetupForm.register("email")}
                  />
                </div>
                {requestSetupForm.formState.errors.email && (
                  <p className="text-sm text-red-600" data-testid="error-setup-email">
                    {requestSetupForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={requestSetupMutation.isPending}
                data-testid="button-request-setup"
              >
                {requestSetupMutation.isPending ? "Sending instructions..." : "Send Setup Instructions"}
              </Button>
            </form>
          </TabsContent>

          {/* Password Setup Completion Tab */}
          <TabsContent value="complete-setup" className="space-y-4">
            <div className="text-center text-sm text-gray-600 mb-4">
              Enter the setup code sent to your email and choose a new password.
            </div>
            <form onSubmit={completeSetupForm.handleSubmit(onCompleteSetup)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="complete-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="complete-email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    data-testid="input-complete-email"
                    {...completeSetupForm.register("email")}
                  />
                </div>
                {completeSetupForm.formState.errors.email && (
                  <p className="text-sm text-red-600" data-testid="error-complete-email">
                    {completeSetupForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="setup-token">Setup Code</Label>
                <Input
                  id="setup-token"
                  placeholder="Enter setup code"
                  data-testid="input-setup-token"
                  {...completeSetupForm.register("token")}
                />
                {completeSetupForm.formState.errors.token && (
                  <p className="text-sm text-red-600" data-testid="error-setup-token">
                    {completeSetupForm.formState.errors.token.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="setup-password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="setup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className="pl-10 pr-10"
                    data-testid="input-setup-password"
                    {...completeSetupForm.register("password")}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                    data-testid="toggle-setup-password"
                  >
                    {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
                {completeSetupForm.formState.errors.password && (
                  <p className="text-sm text-red-600" data-testid="error-setup-password">
                    {completeSetupForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="setup-confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="setup-confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    className="pl-10 pr-10"
                    data-testid="input-setup-confirmPassword"
                    {...completeSetupForm.register("confirmPassword")}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    data-testid="toggle-setup-confirmPassword"
                  >
                    {showConfirmPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
                {completeSetupForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-600" data-testid="error-setup-confirmPassword">
                    {completeSetupForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={completeSetupMutation.isPending}
                data-testid="button-complete-setup"
              >
                {completeSetupMutation.isPending ? "Setting password..." : "Set Password"}
              </Button>
            </form>
          </TabsContent>

        </Tabs>
      </CardContent>
    </Card>
  );
}