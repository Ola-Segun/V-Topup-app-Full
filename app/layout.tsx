import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { AuthProvider } from "@/components/auth-provider"
import { FloatingSupportButton } from "@/components/ui/floating-support-button"
import { Router } from "next/router"
import path from "path"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "TopUp Pro - Airtime & Data Services",
  description: "Secure and instant airtime and data top-up services for all networks",
  manifest: "/manifest.json",
    generator: 'v0.dev'
}

// const currentPath = 
// console.log(currentPath);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} font-poppins bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
            
            {/* only show on dashboard pages */}
            
            {/* <FloatingSupportButton /> */}
            <Toaster richColors position="top-center" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
