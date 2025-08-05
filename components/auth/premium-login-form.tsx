"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Eye, EyeOff, Smartphone, Shield, Fingerprint } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useAuth } from "@/components/auth-provider"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

export function PremiumLoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await signIn(formData.email, formData.password)
      toast.success("Welcome back!", {
        description: "You have been successfully logged in.",
      })
      router.push("/dashboard")
    } catch (error) {
      toast.error("Login failed", {
        description: "Please check your credentials and try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="mobile-container py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm" className="material-card">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="mobile-container py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Logo and Title */}
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 blur-2xl rounded-full"></div>
              <div className="relative w-20 h-20 mx-auto bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Smartphone className="w-10 h-10 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
              <p className="text-muted-foreground">Sign in to your TopUp Pro account</p>
            </div>
          </div>

          {/* Login Form */}
          <Card className="material-card border-border/50 bg-card shadow-2xl">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-xl font-bold text-foreground">Sign In</CardTitle>
              <CardDescription className="text-muted-foreground">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="material-input bg-background border-border text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="material-input bg-background border-border text-foreground placeholder:text-muted-foreground pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) => setFormData({ ...formData, rememberMe: checked as boolean })}
                    />
                    <Label htmlFor="remember" className="text-sm text-muted-foreground">
                      Remember me
                    </Label>
                  </div>
                  <Link href="/auth/forgot-password">
                    <Button variant="link" className="text-primary p-0 h-auto">
                      Forgot password?
                    </Button>
                  </Link>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full material-button bg-gradient-to-r from-primary to-purple-600 text-primary-foreground shadow-xl hover:shadow-2xl h-12 text-lg font-semibold"
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              {/* Biometric Login */}
              <Button
                variant="outline"
                className="w-full material-button border-border bg-background text-foreground hover:bg-muted h-12"
              >
                <Fingerprint className="w-5 h-5 mr-2" />
                Use Biometric Login
              </Button>

              {/* Security Badge */}
              <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>Protected by 256-bit SSL encryption</span>
              </div>
            </CardContent>
          </Card>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-primary font-semibold hover:underline">
                Create one now
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
