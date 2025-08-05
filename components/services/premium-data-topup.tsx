"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Wifi, Smartphone, CheckCircle, Clock, Zap } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { saveRecentAction, getRecentActionsByType } from "@/lib/recent-actions"
import { PremiumMobileNav } from "@/components/navigation/premium-mobile-nav"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { InputPin } from "@/components/input-pin/input-pin"

interface DataPlan {
  id: string
  name: string
  size: string
  validity: string
  price: number
  popular?: boolean
}

import { RecentAction } from "@/lib/recent-actions"

const networks = [
  {
    id: "mtn",
    name: "MTN",
    color: "bg-yellow-500",
    plans: [
      { id: "mtn-1gb", name: "1GB Monthly", size: "1GB", validity: "30 days", price: 1000 },
      { id: "mtn-2gb", name: "2GB Monthly", size: "2GB", validity: "30 days", price: 1800, popular: true },
      { id: "mtn-5gb", name: "5GB Monthly", size: "5GB", validity: "30 days", price: 4000 },
      { id: "mtn-10gb", name: "10GB Monthly", size: "10GB", validity: "30 days", price: 7500 },
    ],
  },
  {
    id: "airtel",
    name: "Airtel",
    color: "bg-red-500",
    plans: [
      { id: "airtel-1gb", name: "1GB Monthly", size: "1GB", validity: "30 days", price: 950 },
      { id: "airtel-2gb", name: "2GB Monthly", size: "2GB", validity: "30 days", price: 1700, popular: true },
      { id: "airtel-5gb", name: "5GB Monthly", size: "5GB", validity: "30 days", price: 3800 },
      { id: "airtel-10gb", name: "10GB Monthly", size: "10GB", validity: "30 days", price: 7200 },
    ],
  },
  {
    id: "glo",
    name: "Glo",
    color: "bg-green-500",
    plans: [
      { id: "glo-1gb", name: "1GB Monthly", size: "1GB", validity: "30 days", price: 1000 },
      { id: "glo-2gb", name: "2GB Monthly", size: "2GB", validity: "30 days", price: 1800 },
      { id: "glo-5gb", name: "5GB Monthly", size: "5GB", validity: "30 days", price: 4000, popular: true },
      { id: "glo-10gb", name: "10GB Monthly", size: "10GB", validity: "30 days", price: 7500 },
    ],
  },
  {
    id: "9mobile",
    name: "9mobile",
    color: "bg-green-600",
    plans: [
      { id: "9mobile-1gb", name: "1GB Monthly", size: "1GB", validity: "30 days", price: 1000 },
      { id: "9mobile-2gb", name: "2GB Monthly", size: "2GB", validity: "30 days", price: 1800 },
      { id: "9mobile-5gb", name: "5GB Monthly", size: "5GB", validity: "30 days", price: 4000 },
      { id: "9mobile-10gb", name: "10GB Monthly", size: "10GB", validity: "30 days", price: 7500, popular: true },
    ],
  },
]

export function PremiumDataTopup() {
  const [selectedNetwork, setSelectedNetwork] = useState("")
  const [selectedPlan, setSelectedPlan] = useState<DataPlan | null>(null)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [recentActions, setRecentActions] = useState<RecentAction[]>([])
  const [showPinModal, setShowPinModal] = useState(false)
  const [pin, setPin] = useState("")

  useEffect(() => {
    const actions = getRecentActionsByType("data")
    setRecentActions(actions.slice(0, 3))
  }, [])

  const selectedNetworkData = networks.find((n) => n.id === selectedNetwork)
  const availablePlans = selectedNetworkData?.plans || []

  const handlePlanSelect = (plan: DataPlan) => {
    setSelectedPlan(plan)
  }

  const handleRecentActionClick = (action: RecentAction) => {
    if (action.network && action.phoneNumber && action.package) {
      setSelectedNetwork(action.network.toLowerCase())
      setPhoneNumber(action.phoneNumber)

      // Find and select the plan
      const network = networks.find((n) => n.id === action.network?.toLowerCase())
      const plan = network?.plans.find((p) => p.name === action.package)
      if (plan) {
        setSelectedPlan(plan)
      }

      toast.success("Recent action loaded!")
    }
  }

  const handlePurchase = async () => {
    if (!selectedPlan || !phoneNumber || !selectedNetwork) {
      toast.error("Please fill in all required fields")
      return
    }
    setShowPinModal(true)
  }

  const handlePinSubmit = async () => {
    if (!selectedPlan) return

    setShowPinModal(false)
    setIsProcessing(true)

    try {
      // Simulate processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Save to recent actions
      saveRecentAction({
        type: "data",
        network: selectedNetworkData?.name || "",
        phoneNumber,
        amount: selectedPlan.price,
        package: selectedPlan.name,
      })

      setShowSuccess(true)

      // Show success toast
      toast.success("Data Purchase Successful!", {
        description: `${selectedPlan.size} data sent to ${phoneNumber}`,
      })

      // Hide success screen after 3 seconds
      setTimeout(() => {
        setShowSuccess(false)
        // Reset form
        setSelectedNetwork("")
        setSelectedPlan(null)
        setPhoneNumber("")
        // Refresh recent actions
        const updatedActions = getRecentActionsByType("data")
        setRecentActions(updatedActions.slice(0, 3))
      }, 3000)
    } catch (error) {
      toast.error("Purchase Failed", {
        description: "Please try again or contact support.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
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
            <h1 className="text-2xl font-bold">Buy Data</h1>
            <p className="text-muted-foreground">Purchase data bundles for all networks</p>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center justify-center py-12 space-y-6"
            >
              <div className="w-24 h-24 emerald-gradient rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Data Purchase Successful!</h2>
                <p className="text-muted-foreground">
                  {selectedPlan?.size} data has been sent to {phoneNumber}
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Activation may take up to 5 minutes</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Recent Actions */}
              {recentActions.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Clock className="w-5 h-5" />
                        <span>Recent Data Purchases</span>
                      </CardTitle>
                      <CardDescription>Tap to use previous details</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {recentActions.map((action, index) => (
                          <motion.div
                            key={action.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + index * 0.1 }}
                            onClick={() => handleRecentActionClick(action)}
                            className="flex items-center justify-between p-3 bg-background/50 rounded-xl border border-border/50 cursor-pointer hover:bg-background/70 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                                <Wifi className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">
                                  {action.network} - {action.package}
                                </p>
                                <p className="text-xs text-muted-foreground">{action.phoneNumber}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-sm">
                                ₦{action.amount ? action.amount.toLocaleString() : ""}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(action.timestamp).toLocaleDateString()}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Network Selection */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Smartphone className="w-5 h-5" />
                      <span>Select Network</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {networks.map((network) => (
                        <motion.button
                          key={network.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setSelectedNetwork(network.id)
                            setSelectedPlan(null)
                          }}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            selectedNetwork === network.id
                              ? "border-primary bg-primary/10"
                              : "border-border/50 hover:border-primary/50"
                          }`}
                        >
                          <div
                            className={`w-8 h-8 ${network.color} rounded-lg mx-auto mb-2 flex items-center justify-center`}
                          >
                            <Smartphone className="w-4 h-4 text-white" />
                          </div>
                          <p className="font-semibold text-sm">{network.name}</p>
                        </motion.button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Phone Number Input */}
              {selectedNetwork && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>Phone Number</CardTitle>
                      <CardDescription>Enter the phone number to receive data</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="floating-label">
                        <Input
                          type="tel"
                          placeholder=" "
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="h-14 bg-background/30 border-border/50 text-foreground placeholder-transparent"
                        />
                        <label className="floating-label-text">Phone Number</label>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Data Plans */}
              {selectedNetwork && phoneNumber && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Wifi className="w-5 h-5" />
                        <span>Select Data Plan</span>
                      </CardTitle>
                      <CardDescription>Choose from available {selectedNetworkData?.name} data plans</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {availablePlans.map((plan) => (
                          <motion.button
                            key={plan.id}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => handlePlanSelect(plan)}
                            className={`w-full p-4 rounded-xl border-2 text-left transition-all relative ${
                              selectedPlan?.id === plan.id
                                ? "border-primary bg-primary/10"
                                : "border-border/50 hover:border-primary/50"
                            }`}
                          >
                            {plan.popular && (
                              <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground">
                                Popular
                              </Badge>
                            )}
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold">{plan.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {plan.size} • {plan.validity}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg">₦{plan.price.toLocaleString()}</p>
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Purchase Summary */}
              {selectedPlan && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <Card className="glass-card border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Zap className="w-4 h-4 mr-2 text-primary" />
                        Transaction Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Network:</span>
                          <span className="font-medium">{selectedNetworkData?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Phone Number:</span>
                          <span className="font-medium">{phoneNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Data Plan:</span>
                          <span className="font-medium">{selectedPlan.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Validity:</span>
                          <span className="font-medium">{selectedPlan.validity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Fee:</span>
                          <span className="font-medium text-green-500">₦0</span>
                        </div>
                        <div className="border-t border-border/30 pt-3">
                          <div className="flex justify-between text-lg font-bold">
                            <span>Total Amount:</span>
                            <span>₦{selectedPlan.price.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <Dialog open={showPinModal} onOpenChange={setShowPinModal}>
                        <DialogTrigger asChild>
                          <Button
                            onClick={handlePurchase}
                            disabled={isProcessing}
                            className="w-full h-14 emerald-gradient text-white font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
                          >
                            {isProcessing ? (
                              <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Processing Purchase...
                              </>
                            ) : (
                              <>
                                <Wifi className="w-5 h-5 mr-2" />
                                Purchase Data
                              </>
                            )}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Enter PIN</DialogTitle>

                          </DialogHeader>
                          <InputPin value={pin} onChange={setPin} />
                          <Button
                            onClick={handlePinSubmit}
                            className="w-fit"
                            disabled={pin.length < 4}
                          >
                            Submit
                          </Button>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
