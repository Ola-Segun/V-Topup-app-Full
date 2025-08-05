"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { ArrowLeft, Smartphone, Loader2, CheckCircle, Zap, Clock, RotateCcw } from "lucide-react"
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

const airtimeSchema = z.object({
  network: z.string().min(1, "Please select a network"),
  phoneNumber: z.string().min(11, "Please enter a valid phone number"),
  amount: z.string().min(1, "Please enter an amount"),
})

type AirtimeForm = z.infer<typeof airtimeSchema>

const networks = [
  { value: "mtn", label: "MTN", color: "network-mtn", logo: "/placeholder.svg?height=40&width=40" },
  { value: "airtel", label: "Airtel", color: "network-airtel", logo: "/placeholder.svg?height=40&width=40" },
  { value: "glo", label: "Glo", color: "network-glo", logo: "/placeholder.svg?height=40&width=40" },
  { value: "9mobile", label: "9mobile", color: "network-9mobile", logo: "/placeholder.svg?height=40&width=40" },
]

const quickAmounts = [100, 200, 500, 1000, 2000, 5000]

export function PremiumAirtimeTopup() {
  const [loading, setLoading] = useState(false)
  const [selectedNetwork, setSelectedNetwork] = useState("")
  // const [phoneNumber, setPhoneNumber] = useState("")
  const [selectedAmount, setSelectedAmount] = useState("")
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
  } = useForm<AirtimeForm>({
    resolver: zodResolver(airtimeSchema),
  })

  const watchedAmount = watch("amount")
  const watchedPhone = watch("phoneNumber")

  useEffect(() => {
    const recent = getRecentActionsByType("airtime")
    setRecentActions(recent)
  }, [])

  const onSubmit = async (data: AirtimeForm) => {
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
        type: "airtime",
        network: selectedNetwork,
        phoneNumber: watchedPhone,
        amount: Number.parseInt(watchedAmount),
      })

      setShowSuccess(true)

      setTimeout(() => {
        toast.success("Airtime Purchase Successful!", {
          description: `₦${watchedAmount} airtime sent to ${watchedPhone}`,
        })

        // Reset form
        setValue("phoneNumber", "")
        setValue("amount", "")
        setSelectedAmount("")
        setShowSuccess(false)

        // Refresh recent actions
        const recent = getRecentActionsByType("airtime")
        setRecentActions(recent)
      }, 10000)
    } catch (error) {
      toast.error("Purchase Failed", {
        description: "Please try again or contact support.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleNetworkSelect = (network: string) => {
    setSelectedNetwork(network)
    setValue("network", network)
  }

  const handleQuickAmount = (amount: number) => {
    setValue("amount", amount.toString())
    setSelectedAmount(amount.toString())
  }

  const handleRecentAction = (action: any) => {
    setSelectedNetwork(action.network)
    setValue("network", action.network)
    setValue("phoneNumber", action.phoneNumber)
    setValue("amount", action.amount.toString())
    setSelectedAmount(action.amount.toString())

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
            <h1 className="text-2xl font-bold">Buy Airtime</h1>
            <p className="text-muted-foreground">Instant top-up for all networks</p>
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
                <h2 className="text-2xl font-bold mb-2">Purchase Successful!</h2>
                <p className="text-muted-foreground">
                  {selectedAmount} data has been sent to {watchedPhone} successfully.
                </p>
              </div>
              <div className="w-full max-w-sm">
                <Card className="glass-card">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Amount</p>
                    <p className="text-2xl font-bold">₦{watchedAmount}</p>
                    <p className="text-sm text-muted-foreground mt-1">to {watchedPhone}</p>
                  </CardContent>
                </Card>
              </div>
              <Button
                asChild
                onClick={setShowSuccess.bind(null, false)}
                className="w-fit h-14 bg-red-400 text-white font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
              >
                <Link href="/dashboard">Close</Link>
              </Button>
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
                          className="w-full p-3 bg-background/30 rounded-xl hover:bg-background/50 transition-colors text-left border border-border/30"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                                <RotateCcw className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">
                                  {networks.find((n) => n.value === action.network)?.label} - {action.phoneNumber}
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

              {/* Network Selection */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Smartphone className="w-5 h-5 mr-2" />
                    Select Network
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {networks.map((network) => (
                      <motion.button
                        key={network.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleNetworkSelect(network.value)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          selectedNetwork === network.value
                            ? "border-primary bg-primary/10"
                            : "border-border/50 hover:border-border"
                        }`}
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <img src={network.logo || "/placeholder.svg"} alt={network.label} className="w-10 h-10" />
                          <span className="font-medium text-sm">{network.label}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                  {errors.network && <p className="text-sm text-red-500 mt-2">{errors.network.message}</p>}
                </CardContent>
              </Card>

              {/* Phone Number */}
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="floating-label">
                    <Input
                      type="tel"
                      placeholder=" "
                      {...register("phoneNumber")}
                      className={`h-14 bg-background/30 border-border/50 text-foreground placeholder-transparent ${
                        errors.phoneNumber ? "border-red-500" : ""
                      }`}
                    />
                    <label className="floating-label-text">Phone Number</label>
                    {errors.phoneNumber && <p className="text-sm text-red-500 mt-1">{errors.phoneNumber.message}</p>}
                  </div>
                </CardContent>
              </Card>


              {/* Quick Amount Selection */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Quick Amount</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {quickAmounts.map((amount) => (
                      <motion.button
                        key={amount}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleQuickAmount(amount)}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                          selectedAmount === amount.toString()
                            ? "border-primary bg-primary/10"
                            : "border-border/50 hover:border-border"
                        }`}
                      >
                        <span className="font-semibold">₦{amount}</span>
                      </motion.button>
                    ))}
                  </div>

                  <div className="floating-label">
                    <Input
                      type="number"
                      placeholder=" "
                      {...register("amount")}
                      className={`h-14 bg-background/30 border-border/50 text-foreground placeholder-transparent ${
                        errors.amount ? "border-red-500" : ""
                      }`}
                      onChange={(e) => setSelectedAmount(e.target.value)}
                    />
                    <label className="floating-label-text">Custom Amount (₦)</label>
                    {errors.amount && <p className="text-sm text-red-500 mt-1">{errors.amount.message}</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Transaction Summary */}
              {selectedNetwork && watchedAmount && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="glass-card border-primary/20">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-4 flex items-center">
                        <Zap className="w-4 h-4 mr-2 text-primary" />
                        Transaction Summary
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Network:</span>
                          <span className="font-medium">
                            {networks.find((n) => n.value === selectedNetwork)?.label}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Amount:</span>
                          <span className="font-medium">₦{watchedAmount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Fee:</span>
                          <span className="font-medium text-green-500">₦0</span>
                        </div>
                        <div className="border-t border-border/30 pt-3">
                          <div className="flex justify-between">
                            <span className="font-semibold">Total:</span>
                            <span className="font-bold text-lg">₦{watchedAmount}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Purchase Button */}
              <Dialog open={showPinModal} onOpenChange={setShowPinModal}>
                <DialogTrigger asChild>
                  <Button
                    onClick={handleSubmit(onSubmit)}
                    disabled={loading || !selectedNetwork || !watchedAmount}
                    className="w-full h-14 premium-gradient text-white font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing Purchase...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-5 w-5" />
                        Purchase Airtime
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
