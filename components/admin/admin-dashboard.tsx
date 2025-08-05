"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, DollarSign, TrendingUp, Activity, Smartphone, Wifi } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"

export function AdminDashboard() {
  const [stats] = useState({
    totalUsers: 15420,
    totalRevenue: 2450000,
    totalTransactions: 8934,
    successRate: 98.5,
    airtimeTransactions: 5234,
    dataTransactions: 3700,
    pendingTransactions: 12,
    failedTransactions: 45,
  })

  const recentTransactions = [
    {
      id: "TXN001",
      user: "John Doe",
      type: "Airtime",
      network: "MTN",
      amount: 1000,
      status: "completed",
      date: "2024-01-15 14:30",
    },
    {
      id: "TXN002",
      user: "Jane Smith",
      type: "Data",
      network: "Airtel",
      amount: 2000,
      status: "pending",
      date: "2024-01-15 14:25",
    },
    {
      id: "TXN003",
      user: "Mike Johnson",
      type: "Airtime",
      network: "Glo",
      amount: 500,
      status: "failed",
      date: "2024-01-15 14:20",
    },
  ]

  const recentUsers = [
    {
      id: 1,
      name: "Alice Brown",
      email: "alice@example.com",
      joinDate: "2024-01-15",
      status: "active",
    },
    {
      id: 2,
      name: "Bob Wilson",
      email: "bob@example.com",
      joinDate: "2024-01-14",
      status: "active",
    },
    {
      id: 3,
      name: "Carol Davis",
      email: "carol@example.com",
      joinDate: "2024-01-13",
      status: "inactive",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MobileNav />

      <div className="mobile-container py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage your platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">₦{(stats.totalRevenue / 1000000).toFixed(1)}M</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Transactions</p>
                  <p className="text-2xl font-bold">{stats.totalTransactions.toLocaleString()}</p>
                </div>
                <Activity className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold">{stats.successRate}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Service Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Airtime Sales</p>
                  <p className="text-xl font-bold">{stats.airtimeTransactions.toLocaleString()}</p>
                </div>
                <Smartphone className="w-6 h-6 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Data Sales</p>
                  <p className="text-xl font-bold">{stats.dataTransactions.toLocaleString()}</p>
                </div>
                <Wifi className="w-6 h-6 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest platform transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      {transaction.type === "Airtime" ? (
                        <Smartphone className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Wifi className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{transaction.id}</p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.user} • {transaction.network}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">₦{transaction.amount.toLocaleString()}</p>
                    <Badge
                      variant={
                        transaction.status === "completed"
                          ? "default"
                          : transaction.status === "pending"
                            ? "secondary"
                            : "destructive"
                      }
                      className="text-xs"
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full mt-4 bg-transparent">
              View All Transactions
            </Button>
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Newly registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{user.joinDate}</p>
                    <Badge variant={user.status === "active" ? "default" : "secondary"} className="text-xs">
                      {user.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full mt-4 bg-transparent">
              View All Users
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
