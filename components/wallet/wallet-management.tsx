"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Wallet, CreditCard, Loader2, Plus } from "lucide-react"
import Link from "next/link"
import { MobileNav } from "@/components/mobile-nav"
import { WalletBalance } from "@/components/wallet/wallet-balance"

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

export function WalletManagement() {
  const [loading, setLoading] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState("")
  const [walletBalance] = useState(5000)
  const { toast } = useToast()

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

      toast({
        title: "Wallet Funded Successfully!",
        description: `₦${data.amount} has been added to your wallet`,
      })

      // Reset form
      setValue("amount", "")
      setValue("paymentMethod", "")
      setSelectedAmount("")
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
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
      date: "2024-01-15",
      status: "completed",
    },
    {
      id: 2,
      type: "Debit",
      description: "Airtime Purchase - MTN",
      amount: -1000,
      date: "2024-01-14",
      status: "completed",
    },
    {
      id: 3,
      type: "Debit",
      description: "Data Purchase - Airtel",
      amount: -2000,
      date: "2024-01-13",
      status: "completed",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MobileNav />

      <div className="mobile-container py-6">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl font-bold mb-2">Wallet Management</h1>
          <p className="text-muted-foreground">Fund your wallet and manage your balance</p>
        </div>

        {/* Wallet Balance */}
        <WalletBalance balance={walletBalance} />

        {/* Fund Wallet */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Fund Wallet
            </CardTitle>
            <CardDescription>Add money to your wallet using various payment methods</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Quick Amount Selection */}
              <div className="space-y-2">
                <Label>Quick Amount Selection</Label>
                <div className="grid grid-cols-3 gap-2">
                  {quickAmounts.map((amount) => (
                    <Button
                      key={amount}
                      type="button"
                      variant={selectedAmount === amount.toString() ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleQuickAmount(amount)}
                    >
                      ₦{amount.toLocaleString()}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₦)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount (minimum ₦100)"
                  {...register("amount")}
                  className={errors.amount ? "border-red-500" : ""}
                  onChange={(e) => setSelectedAmount(e.target.value)}
                />
                {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select onValueChange={(value) => setValue("paymentMethod", value)}>
                  <SelectTrigger className={errors.paymentMethod ? "border-red-500" : ""}>
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
                {errors.paymentMethod && <p className="text-sm text-red-500">{errors.paymentMethod.message}</p>}
              </div>

              {/* Transaction Summary */}
              {watchedAmount && watchedPaymentMethod && (
                <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Payment Summary</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Amount:</span>
                        <span className="font-medium">₦{Number.parseInt(watchedAmount).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Payment Method:</span>
                        <span className="font-medium">
                          {paymentMethods.find((m) => m.value === watchedPaymentMethod)?.label}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Processing Fee:</span>
                        <span className="font-medium">₦0</span>
                      </div>
                      <div className="flex justify-between font-semibold border-t pt-1">
                        <span>Total:</span>
                        <span>₦{Number.parseInt(watchedAmount).toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  "Fund Wallet"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wallet className="w-5 h-5 mr-2" />
              Recent Transactions
            </CardTitle>
            <CardDescription>Your wallet transaction history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        transaction.type === "Credit" ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"
                      }`}
                    >
                      <Wallet
                        className={`w-5 h-5 ${transaction.type === "Credit" ? "text-green-600" : "text-red-600"}`}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold text-sm ${
                        transaction.type === "Credit" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {transaction.type === "Credit" ? "+" : ""}₦{Math.abs(transaction.amount).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">{transaction.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
