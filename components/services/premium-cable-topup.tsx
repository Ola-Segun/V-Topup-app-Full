"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { ArrowLeft, Tv, Loader2, CheckCircle, Zap, Clock, RotateCcw } from "lucide-react"
import Link from "next/link"
import { PremiumMobileNav } from "@/components/navigation/premium-mobile-nav"
import { motion, AnimatePresence } from "framer-motion"
import { saveRecentAction, getRecentActionsByType } from "@/lib/recent-actions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { InputPin } from "@/components/input-pin/input-pin"

const cableSchema = z.object({
  provider: z.string().min(1, "Please select a provider"),
  package: z.string().min(1, "Please select a package"),
  smartCardNumber: z.string().min(10, "Please enter a valid smart card number"),
})

type CableForm = z.infer<typeof cableSchema>

const providers = [
  { value: "dstv", label: "DSTV" },
  { value: "gotv", label: "GOtv" },
  { value: "startimes", label: "StarTimes" },
  { value: "showmax", label: "Showmax" },
]

const packages = {
  dstv: [
    { value: "compact", label: "DStv Compact", price: 9000 },
    { value: "compact-plus", label: "DStv Compact Plus", price: 14250 },
    { value: "premium", label: "DStv Premium", price: 21000 },
    { value: "family", label: "DStv Family", price: 4000 },
  ],
  gotv: [
    { value: "smallie", label: "GOtv Smallie", price: 900 },
    { value: "jinja", label: "GOtv Jinja", price: 2250 },
    { value: "jolli", label: "GOtv Jolli", price: 2800 },
    { value: "max", label: "GOtv Max", price: 4150 },
  ],
  startimes: [
    { value: "nova", label: "StarTimes Nova", price: 900 },
    { value: "basic", label: "StarTimes Basic", price: 1800 },
    { value: "smart", label: "StarTimes Smart", price: 2500 },
    { value: "super", label: "StarTimes Super", price: 4200 },
  ],
  showmax: [
    { value: "mobile", label: "Showmax Mobile", price: 1200 },
    { value: "standard", label: "Showmax Standard", price: 2900 },
    { value: "pro", label: "Showmax Pro", price: 3200 },
  ],
}

export function PremiumCableTopup() {
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [recentActions, setRecentActions] = useState<any[]>([])
  const [showPinModal, setShowPinModal] = useState(false)
  const [pin, setPin] = useState("")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CableForm>({
    resolver: zodResolver(cableSchema),
  })

  const watchedProvider = watch("provider")
  const watchedPackage = watch("package")
  const watchedSmartCard = watch("smartCardNumber")

  const selectedPackage =
    watchedProvider && watchedPackage
      ? packages[watchedProvider as keyof typeof packages]?.find((pkg) => pkg.value === watchedPackage)
      : null

  useEffect(() => {
    const recent = getRecentActionsByType("cable")
    setRecentActions(recent)
  }, [])

  const onSubmit = async (data: CableForm) => {
    setShowPinModal(true)
  }

  const handlePinSubmit = async () => {
    setShowPinModal(false)
    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Save recent action
      if (selectedPackage) {
        saveRecentAction({
          type: "cable",
          provider: watchedProvider,
          package: watchedPackage,
          smartCardNumber: watchedSmartCard,
          amount: selectedPackage.price,
        })
      }

      setShowSuccess(true)

      setTimeout(() => {
        toast.success("Cable Subscription Successful!", {
          description: `${selectedPackage?.label} activated for ${watchedSmartCard}`,
        })

        // Reset form
        setValue("smartCardNumber", "")
        setValue("package", "")
        setValue("provider", "")
        setShowSuccess(false)

        // Refresh recent actions
        const recent = getRecentActionsByType("cable")
        setRecentActions(recent)
      }, 2000)
    } catch (error) {
      toast.error("Subscription Failed", {
        description: "Please try again or contact support.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRecentAction = (action: any) => {
    setValue("provider", action.provider)
    setValue("package", action.package)
    setValue("smartCardNumber", action.smartCardNumber)

    console.log(action.provider);
    

    toast.success("Recent action applied!", {
      description: "Form filled with your recent transaction details",
    })
  }

  return (
    <div className="min-h-screen">
      <PremiumMobileNav />

      <div className="mobile-container py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-4"
        >
          {/* <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="glass-card">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link> */}
          <div>
            <h1 className="text-2xl font-bold">Cable TV Subscription</h1>
            <p className="text-muted-foreground">Subscribe to your favorite TV packages</p>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center justify-center py-20 space-y-6"
            >
              <div className="w-24 h-24 emerald-gradient rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Subscription Successful!</h2>
                <p className="text-muted-foreground">Your cable TV subscription has been activated</p>
              </div>
              <div className="w-full max-w-sm">
                <Card className="glass-card">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Package</p>
                    <p className="text-xl font-bold">{selectedPackage?.label}</p>
                    <p className="text-sm text-muted-foreground mt-1">Smart Card: {watchedSmartCard}</p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Recent Actions */}
              {recentActions.length > 0 && (
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      Recent Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {recentActions.slice(0, 3).map((action, index) => (
                        <motion.button
                          key={action.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => handleRecentAction(action)}
                          className="w-full p-3 bg-background/30 rounded-xl hover:bg-background/50 transition-colors text-left"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                                <RotateCcw className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">
                                  {providers.find((p) => p.value === action.provider)?.label} - {action.smartCardNumber}
                                </p>
                                <p className="text-xs text-muted-foreground">₦{action.amount}</p>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(action.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Provider Selection */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Tv className="w-5 h-5 mr-2" />
                    Select Provider
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select onValueChange={(value) => setValue("provider", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose TV provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {providers.map((provider) => (
                        <SelectItem key={provider.value} value={provider.value}>
                          {provider.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.provider && <p className="text-sm text-red-500 mt-2">{errors.provider.message}</p>}
                </CardContent>
              </Card>

              {/* Smart Card Number */}
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="floating-label">
                    <Input
                      type="text"
                      placeholder=" "
                      {...register("smartCardNumber")}
                      className={`h-14 bg-background/30 border-border/50 text-foreground placeholder-transparent ${
                        errors.smartCardNumber ? "border-red-500" : ""
                      }`}
                    />
                    <label className="floating-label-text">Smart Card Number</label>
                    {errors.smartCardNumber && (
                      <p className="text-sm text-red-500 mt-1">{errors.smartCardNumber.message}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Package Selection */}
              {watchedProvider && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>Choose Package</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {packages[watchedProvider as keyof typeof packages]?.map((pkg) => (
                          <motion.button
                            key={pkg.value}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => setValue("package", pkg.value)}
                            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                              watchedPackage === pkg.value
                                ? "border-primary bg-primary/10"
                                : "border-border/50 hover:border-border/80"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="text-left">
                                <span className="font-semibold">{pkg.label}</span>
                                <p className="text-sm text-muted-foreground">Monthly subscription</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg">₦{pkg.price.toLocaleString()}</p>
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                      {errors.package && <p className="text-sm text-red-500 mt-2">{errors.package.message}</p>}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Transaction Summary */}
              {selectedPackage && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="glass-card border-primary/20">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-4 flex items-center">
                        <Zap className="w-4 h-4 mr-2 text-primary" />
                        Transaction Summary
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Provider:</span>
                          <span className="font-medium">
                            {providers.find((p) => p.value === watchedProvider)?.label}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Package:</span>
                          <span className="font-medium">{selectedPackage.label}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Amount:</span>
                          <span className="font-medium">₦{selectedPackage.price.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Fee:</span>
                          <span className="font-medium text-green-500">₦0</span>
                        </div>
                        <div className="border-t border-border/30 pt-3">
                          <div className="flex justify-between">
                            <span className="font-semibold">Total:</span>
                            <span className="font-bold text-lg">₦{selectedPackage.price.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Subscribe Button */}
              <Dialog open={showPinModal} onOpenChange={setShowPinModal}>
                <DialogTrigger asChild>
                  <Button
                    onClick={handleSubmit(onSubmit)}
                    disabled={loading || !watchedProvider || !watchedPackage}
                    className="w-full h-14 emerald-gradient text-white font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing Subscription...
                      </>
                    ) : (
                      <>
                        <Tv className="mr-2 h-5 w-5" />
                        Subscribe Now
                      </>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Enter PIN</DialogTitle>
                    <DialogDescription>
                      Enter your 4-digit PIN to authorize this transaction.
                    </DialogDescription>
                  </DialogHeader>
                  <InputPin value={pin} onChange={setPin} />
                  <Button
                    onClick={handlePinSubmit}
                    disabled={pin.length < 4}
                    className="w-full"
                  >
                    Submit
                  </Button>
                </DialogContent>
              </Dialog>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
