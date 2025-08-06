"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Home,
  Smartphone,
  Wifi,
  Wallet,
  History,
  Settings,
  Menu,
  Tv,
  Zap,
  BarChart3,
  Gift,
  User,
  LogOut,
  MessageCircle
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/components/auth-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { FloatingSupportButton } from "../ui/floating-support-button"

const mainNavItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/dashboard/airtime", icon: Smartphone, label: "Airtime" },
  { href: "/dashboard/data", icon: Wifi, label: "Data" },
  { href: "/dashboard/wallet", icon: Wallet, label: "Wallet" },
  { href: "/dashboard/history", icon: History, label: "History" },
]

const serviceItems = [
  { href: "/dashboard/cable", icon: Tv, label: "Cable TV" },
  { href: "/dashboard/electricity", icon: Zap, label: "Electricity" },
  { href: "/dashboard/stats", icon: BarChart3, label: "Statistics" },
  { href: "/dashboard/rewards", icon: Gift, label: "Rewards" },
]

export function PremiumMobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  const isActive = (href: string) => pathname === href

  const handleSignOut = async () => {
    await signOut()
    setIsOpen(false)
  }

  return (
    <>
      <FloatingSupportButton />
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="mobile-container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="material-card shadow-lg bg-card">
                    <Menu className="w-5 h-5 text-foreground" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 bg-background border-border overflow-y-auto">
                  <SheetHeader className="text-left">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Smartphone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <SheetTitle className="text-foreground">TopUp Pro</SheetTitle>
                        <p className="text-sm text-muted-foreground">Digital Wallet</p>
                      </div>
                    </div>
                  </SheetHeader>

                  <div className="space-y-6 flex flex-col justify-between items-stretch h-full">
                    <div>
                      {/* User Profile */}
                      {user && (
                        <Link href="/dashboard/settings" onClick={() => setIsOpen(false)}>
                          <div className="p-4 bg-muted/50 rounded-xl hover:bg-muted/70 transition-colors cursor-pointer">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <p className="font-semibold text-foreground">{user.user_metadata?.full_name || "User"}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      )}

                      {/* Main Navigation */}
                      <div className="space-y-2 m-2">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-2">
                          Main
                        </h3>
                        {mainNavItems.map((item, index) => (
                          <motion.div
                            key={item.href}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Link href={item.href} onClick={() => setIsOpen(false)}>
                              <Button
                                variant={isActive(item.href) ? "default" : "ghost"}
                                className={`w-full justify-start material-button ${
                                  isActive(item.href)
                                    ? "bg-primary text-primary-foreground shadow-lg"
                                    : "text-foreground hover:bg-muted"
                                }`}
                              >
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.label}
                              </Button>
                            </Link>
                          </motion.div>
                        ))}
                      </div>

                      {/* Services */}
                      <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-2">
                          Services
                        </h3>
                        {serviceItems.map((item, index) => (
                          <motion.div
                            key={item.href}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (mainNavItems.length + index) * 0.1 }}
                          >
                            <Link href={item.href} onClick={() => setIsOpen(false)}>
                              <Button
                                variant={isActive(item.href) ? "default" : "ghost"}
                                className={`w-full justify-start material-button ${
                                  isActive(item.href)
                                    ? "bg-primary text-primary-foreground shadow-lg"
                                    : "text-foreground hover:bg-muted"
                                }`}
                              >
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.label}
                              </Button>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                      {/* Settings & Account */}
                      <div className="space-y-2 pt-4 h-fit border-t border-border">
                        <Link href="/dashboard/support" onClick={() => setIsOpen(false)}>
                          <Button
                            variant={isActive("/dashboard/settings") ? "default" : "ghost"}
                            className={`w-full justify-start material-button ${
                              isActive("/dashboard/settings")
                                ? "bg-primary text-primary-foreground shadow-lg"
                                : "text-foreground hover:bg-muted"
                            }`}
                          >
                            <MessageCircle className="w-5 h-5 mr-3" />
                            Customer Support
                          </Button>
                        </Link>


                        <Link href="/dashboard/settings" onClick={() => setIsOpen(false)}>
                          <Button
                            variant={isActive("/dashboard/settings") ? "default" : "ghost"}
                            className={`w-full justify-start material-button ${
                              isActive("/dashboard/settings")
                                ? "bg-primary text-primary-foreground shadow-lg"
                                : "text-foreground hover:bg-muted"
                            }`}
                          >
                            <Settings className="w-5 h-5 mr-3" />
                            Settings
                          </Button>
                        </Link>

                        <Button
                          onClick={handleSignOut}
                          variant="ghost"
                          className="w-full justify-start material-button text-red-500 hover:bg-red-500/10"
                        >
                          <LogOut className="w-5 h-5 mr-3" />
                          Sign Out
                        </Button>
                      </div>
                  </div>
                </SheetContent>
              </Sheet>

              <div>
                <h1 className="font-bold text-lg text-foreground">TopUp Pro</h1>
                <p className="text-xs text-muted-foreground">Digital Wallet</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <NotificationCenter />
              {/* <ThemeToggle /> */}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-t border-border/50">
        <div className="mobile-container py-2">
          <div className="flex items-center justify-around">
            {mainNavItems.slice(0, 5).map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex flex-col items-center space-y-1 h-auto py-2 px-3 ${
                    isActive(item.href) ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {/* <span className="text-xs font-medium">{item.label}</span> */}
                  {isActive(item.href) && <div className="w-1 h-1 bg-primary rounded-full"></div>}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>


    </>
  )
}
