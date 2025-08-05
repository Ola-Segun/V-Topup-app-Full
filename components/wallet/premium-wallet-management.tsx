"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import {
  ArrowLeft,
  Wallet,
  CreditCard,
  Loader2,
  Plus,
  Eye,
  EyeOff,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import Link from "next/link"
import { PremiumMobileNav } from "@/components/navigation/premium-mobile-nav"
import { motion } from "framer-motion"

const fundWalletSchema = z.object({
  amount: z.string().min(1, "Please enter an amount"),
  paymentMethod: z.string().min(1, "Please select a payment method"),
})

type FundWalletForm = z.infer<typeof fundWalletSchema>

const paymentMethods = [
  { value: "paystack", label: "Paystack", icon: CreditCard },
  { value: "flutterwave", label: "Flutterwave", icon: CreditCard },
  { value: "bank_transfer", label: "Bank Transfer", icon: CreditCard },
]

const quickAmounts = [1000, 2000, 5000, 10000, 20000, 50000]

export function PremiumWalletManagement() {
  const [loading, setLoading] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState("")
  const [walletBalance] = useState(25750)
  const [showBalance, setShowBalance] = useState(true)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FundWalletForm>({
    resolver: zodResolver(fundWalletSchema),
  })

  const watchedAmount = watch("amount")
  const watchedPaymentMethod = watch("paymentMethod")

  const onSubmit = async (data: FundWalletForm) => {
    setLoading(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      toast.success("Wallet Funded Successfully!", {
        description: `₦${data.amount} has been added to your wallet`,
      })

      // Reset form
      setValue("amount", "")
      setValue("paymentMethod", "")
      setSelectedAmount("")
    } catch (error) {
      toast.error("Payment Failed", {
        description: "Please try again or contact support.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleQuickAmount = (amount: number) => {
    setValue("amount", amount.toString())
    setSelectedAmount(amount.toString())
  }

  const transactions = [
    {
      id: 1,
      type: "Credit",
      description: "Wallet Funding - Paystack",
      amount: 5000,
      date: "2 mins ago",
      status: "completed",
      icon: ArrowDownRight,
      color: "text-green-500",
    },
    {
      id: 2,
      type: "Debit",
      description: "Airtime Purchase - MTN",
      amount: -1000,
      date: "1 hour ago",
      status: "completed",
      icon: ArrowUpRight,
      color: "text-red-500",
    },
    {
      id: 3,
      type: "Debit",
      description: "Data Purchase - Airtel",
      amount: -2000,
      date: "Yesterday",
      status: "completed",
      icon: ArrowUpRight,
      color: "text-red-500",
    },
  ]

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
            <h1 className="text-2xl font-bold">Wallet Management</h1>
            <p className="text-muted-foreground">Fund your wallet and manage balance</p>
          </div>
        </motion.div>

        {/* Premium Wallet Balance Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-card premium-shadow overflow-hidden py-0">
            <CardContent className="p-0">
              <div className="premium-gradient p-6 text-white relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 right-4 w-32 h-32 border border-white/20 rounded-full"></div>
                  <div className="absolute -top-8 -right-8 w-24 h-24 border border-white/20 rounded-full"></div>
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Wallet className="w-5 h-5" />
                      <span className="text-white/80 text-sm">Total Balance</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowBalance(!showBalance)}
                      className="text-white hover:bg-white/20 h-8 w-8"
                    >
                      {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>

                  <div className="mb-4">
                    <p className="text-3xl font-bold">{showBalance ? `₦${walletBalance.toLocaleString()}` : "₦****"}</p>
                    <p className="text-white/80 text-sm">Available for transactions</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4 text-green-300" />
                      <span className="text-sm text-green-300">+12.5% this month</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-white/60">Last updated</p>
                      <p className="text-xs text-white/80">Just now</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Fund Wallet */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Fund Wallet
              </CardTitle>
              <CardDescription>Add money using various payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quick Amount Selection */}
              <div>
                <h3 className="font-medium mb-3">Quick Amount</h3>
                <div className="grid grid-cols-3 gap-3">
                  {quickAmounts.map((amount) => (
                    <motion.button
                      key={amount}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleQuickAmount(amount)}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                        selectedAmount === amount.toString()
                          ? "border-primary bg-primary/10"
                          : "border-white/20 hover:border-white/40"
                      }`}
                    >
                      <span className="font-semibold text-sm">₦{amount.toLocaleString()}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div className="floating-label">
                <Input
                  type="number"
                  placeholder=" "
                  {...register("amount")}
                  className={`h-14 bg-white/5 border-white/20 text-foreground placeholder-transparent active:border-none border-bottom  ${
                    errors.amount ? "border-red-500" : ""
                  }`}
                  onChange={(e) => setSelectedAmount(e.target.value)}
                />
                <label className="floating-label-text">Custom Amount (₦)</label>
                {errors.amount && <p className="text-sm text-red-500 mt-1">{errors.amount.message}</p>}
              </div>

              {/* Payment Method */}
              <div>
                <h3 className="font-medium mb-3">Payment Method</h3>
                <Select onValueChange={(value) => setValue("paymentMethod", value)}>
                  <SelectTrigger className="h-14 bg-white/5 border-white/20">
                    <SelectValue placeholder="Choose payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        <div className="flex items-center space-x-2">
                          <method.icon className="w-4 h-4" />
                          <span>{method.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.paymentMethod && <p className="text-sm text-red-500 mt-1">{errors.paymentMethod.message}</p>}
              </div>

              {/* Transaction Summary */}
              {watchedAmount && watchedPaymentMethod && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="glass-card border-primary/20">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-3">Payment Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Amount:</span>
                          <span className="font-medium">₦{Number.parseInt(watchedAmount).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Payment Method:</span>
                          <span className="font-medium">
                            {paymentMethods.find((m) => m.value === watchedPaymentMethod)?.label}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Processing Fee:</span>
                          <span className="font-medium text-green-500">₦0</span>
                        </div>
                        <div className="border-t border-white/10 pt-2">
                          <div className="flex justify-between">
                            <span className="font-semibold">Total:</span>
                            <span className="font-bold">₦{Number.parseInt(watchedAmount).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={loading}
                className="w-full h-14 premium-gradient text-white font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-5 w-5" />
                    Fund Wallet
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Wallet className="w-5 h-5 mr-2" />
                  Recent Transactions
                </CardTitle>
                <Link href="/dashboard/history">
                  <Button variant="ghost" size="sm" className="text-primary">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                        <transaction.icon className={`w-5 h-5 ${transaction.color}`} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold text-sm ${transaction.color}`}>
                        {transaction.type === "Credit" ? "+" : ""}₦{Math.abs(transaction.amount).toLocaleString()}
                      </p>
                      <p className="text-xs text-green-500 capitalize">{transaction.status}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>

    
  )
}
