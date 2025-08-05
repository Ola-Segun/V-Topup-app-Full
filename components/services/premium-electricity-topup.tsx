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
import { ArrowLeft, Zap, Loader2, CheckCircle, Clock, RotateCcw } from "lucide-react"
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

const electricitySchema = z.object({
  provider: z.string().min(1, "Please select a provider"),
  meterNumber: z.string().min(10, "Please enter a valid meter number"),
  amount: z.number().min(500, "Minimum amount is ₦500"),
})

type ElectricityForm = z.infer<typeof electricitySchema>

const providers = [
  { value: "ekedc", label: "Eko Electricity (EKEDC)" },
  { value: "ikedc", label: "Ikeja Electric (IKEDC)" },
  { value: "aedc", label: "Abuja Electricity (AEDC)" },
  { value: "phed", label: "Port Harcourt Electric (PHED)" },
  { value: "kedco", label: "Kano Electricity (KEDCO)" },
  { value: "jedc", label: "Jos Electricity (JEDC)" },
]

const quickAmounts = [1000, 2000, 3000, 5000, 10000, 15000]

export function PremiumElectricityTopup() {
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [recentActions, setRecentActions] = useState<any[]>([])
  const [customAmount, setCustomAmount] = useState("")
  const [showPinModal, setShowPinModal] = useState(false)
  const [pin, setPin] = useState("")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ElectricityForm>({
    resolver: zodResolver(electricitySchema),
  })

  const watchedProvider = watch("provider")
  const watchedMeterNumber = watch("meterNumber")
  const watchedAmount = watch("amount")

  useEffect(() => {
    const recent = getRecentActionsByType("electricity")
    setRecentActions(recent)
  }, [])

  const onSubmit = async (data: ElectricityForm) => {
    setShowPinModal(true)
  }

  const handlePinSubmit = async () => {
    setShowPinModal(false)
    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Save recent action
      saveRecentAction({
        type: "electricity",
        provider: watchedProvider,
        meterNumber: watchedMeterNumber,
        amount: watchedAmount,
      })

      setShowSuccess(true)

      setTimeout(() => {
        toast.success("Electricity Payment Successful!", {
          description: `₦${watchedAmount.toLocaleString()} credited to meter ${watchedMeterNumber}`,
        })

        // Reset form
        setValue("meterNumber", "")
        setValue("amount", 0)
        setValue("provider", "")
        setCustomAmount("")
        setShowSuccess(false)

        // Refresh recent actions
        const recent = getRecentActionsByType("electricity")
        setRecentActions(recent)
      }, 2000)
    } catch (error) {
      toast.error("Payment Failed", {
        description: "Please try again or contact support.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRecentAction = (action: any) => {
    setValue("provider", action.provider)
    setValue("meterNumber", action.meterNumber)
    setValue("amount", action.amount)
    setCustomAmount(action.amount.toString())

    toast.success("Recent action applied!", {
      description: "Form filled with your recent transaction details",
    })
  }

  const handleQuickAmount = (amount: number) => {
    setValue("amount", amount)
    setCustomAmount(amount.toString())
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    const numValue = Number.parseInt(value) || 0
    setValue("amount", numValue)
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
            <h1 className="text-2xl font-bold">Electricity Payment</h1>
            <p className="text-muted-foreground">Pay your electricity bills instantly</p>
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
                <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
                <p className="text-muted-foreground">Your electricity bill has been paid</p>
              </div>
              <div className="w-full max-w-sm">
                <Card className="glass-card">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Amount Paid</p>
                    <p className="text-xl font-bold">₦{watchedAmount?.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground mt-1">Meter: {watchedMeterNumber}</p>
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
                                  {providers.find((p) => p.value === action.provider)?.label} - {action.meterNumber}
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
                    <Zap className="w-5 h-5 mr-2" />
                    Select Provider
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select onValueChange={(value) => setValue("provider", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose electricity provider" />
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

              {/* Meter Number */}
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="floating-label">
                    <Input
                      type="text"
                      placeholder=" "
                      {...register("meterNumber")}
                      className={`h-14 bg-background/30 border-border/50 text-foreground placeholder-transparent ${
                        errors.meterNumber ? "border-red-500" : ""
                      }`}
                    />
                    <label className="floating-label-text">Meter Number</label>
                    {errors.meterNumber && <p className="text-sm text-red-500 mt-1">{errors.meterNumber.message}</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Amount Selection */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Select Amount</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Quick Amounts */}
                  <div className="grid grid-cols-3 gap-3">
                    {quickAmounts.map((amount) => (
                      <motion.button
                        key={amount}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleQuickAmount(amount)}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                          watchedAmount === amount
                            ? "border-primary bg-primary/10"
                            : "border-border/50 hover:border-border/80"
                        }`}
                      >
                        <span className="font-semibold">₦{amount.toLocaleString()}</span>
                      </motion.button>
                    ))}
                  </div>

                  {/* Custom Amount */}
                  <div className="floating-label">
                    <Input
                      type="number"
                      placeholder=" "
                      value={customAmount}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                      className={`h-14 bg-background/30 border-border/50 text-foreground placeholder-transparent ${
                        errors.amount ? "border-red-500" : ""
                      }`}
                    />
                    <label className="floating-label-text">Custom Amount</label>
                    {errors.amount && <p className="text-sm text-red-500 mt-1">{errors.amount.message}</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Transaction Summary */}
              {watchedAmount && watchedAmount > 0 && (
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
                          <span className="text-muted-foreground">Meter Number:</span>
                          <span className="font-medium">{watchedMeterNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Amount:</span>
                          <span className="font-medium">₦{watchedAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Fee:</span>
                          <span className="font-medium text-green-500">₦0</span>
                        </div>
                        <div className="border-t border-border/30 pt-3">
                          <div className="flex justify-between">
                            <span className="font-semibold">Total:</span>
                            <span className="font-bold text-lg">₦{watchedAmount.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Pay Button */}
              <Dialog open={showPinModal} onOpenChange={setShowPinModal}>
                <DialogTrigger asChild>
                  <Button
                    onClick={handleSubmit(onSubmit)}
                    disabled={loading || !watchedProvider || !watchedAmount || watchedAmount < 500}
                    className="w-full h-14 emerald-gradient text-white font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-5 w-5" />
                        Pay Now
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
