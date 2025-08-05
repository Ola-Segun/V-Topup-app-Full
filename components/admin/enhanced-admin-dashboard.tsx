"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, CreditCard, Download, BarChart3, AlertTriangle, PieChartIcon, Settings } from "lucide-react"
import { RealtimeProvider } from "@/components/realtime/realtime-provider"
import { ConnectionStatus } from "@/components/realtime/connection-status"
import { LiveMetrics } from "@/components/realtime/live-metrics"
import { LiveTransactions } from "@/components/realtime/live-transactions"
import { SystemAlerts } from "@/components/realtime/system-alerts"
import { LiveCharts } from "@/components/realtime/live-charts"

// Mock data for charts
const revenueData = [
  { month: "Jan", revenue: 45000, transactions: 1200, users: 850 },
  { month: "Feb", revenue: 52000, transactions: 1350, users: 920 },
  { month: "Mar", revenue: 48000, transactions: 1280, users: 890 },
  { month: "Apr", revenue: 61000, transactions: 1450, users: 1020 },
  { month: "May", revenue: 55000, transactions: 1380, users: 980 },
  { month: "Jun", revenue: 67000, transactions: 1520, users: 1150 },
  { month: "Jul", revenue: 72000, transactions: 1680, users: 1280 },
  { month: "Aug", revenue: 69000, transactions: 1590, users: 1220 },
  { month: "Sep", revenue: 78000, transactions: 1750, users: 1350 },
  { month: "Oct", revenue: 82000, transactions: 1820, users: 1420 },
  { month: "Nov", revenue: 89000, transactions: 1950, users: 1580 },
  { month: "Dec", revenue: 95000, transactions: 2100, users: 1680 },
]

const serviceDistribution = [
  { name: "Airtime", value: 35, amount: 285000, color: "#8884d8" },
  { name: "Data", value: 28, amount: 228000, color: "#82ca9d" },
  { name: "Electricity", value: 20, amount: 163000, color: "#ffc658" },
  { name: "Cable TV", value: 12, amount: 98000, color: "#ff7300" },
  { name: "Others", value: 5, amount: 41000, color: "#00ff88" },
]

const userGrowthData = [
  { date: "2024-01-01", newUsers: 45, activeUsers: 1200, churnRate: 2.1 },
  { date: "2024-01-02", newUsers: 52, activeUsers: 1250, churnRate: 1.8 },
  { date: "2024-01-03", newUsers: 38, activeUsers: 1280, churnRate: 2.3 },
  { date: "2024-01-04", newUsers: 61, activeUsers: 1340, churnRate: 1.9 },
  { date: "2024-01-05", newUsers: 49, activeUsers: 1380, churnRate: 2.0 },
  { date: "2024-01-06", newUsers: 67, activeUsers: 1440, churnRate: 1.7 },
  { date: "2024-01-07", newUsers: 72, activeUsers: 1510, churnRate: 1.5 },
]

const performanceMetrics = [
  { metric: "System Uptime", value: 99.9, target: 99.5, status: "excellent" },
  { metric: "Response Time", value: 145, target: 200, status: "good", unit: "ms" },
  { metric: "Success Rate", value: 98.7, target: 95.0, status: "excellent" },
  { metric: "Error Rate", value: 0.3, target: 1.0, status: "excellent" },
]

const topTransactions = [
  { id: "TXN001", user: "John Doe", service: "Data", amount: 5000, status: "completed", time: "2 mins ago" },
  { id: "TXN002", user: "Jane Smith", service: "Airtime", amount: 2000, status: "completed", time: "5 mins ago" },
  { id: "TXN003", user: "Mike Johnson", service: "Electricity", amount: 15000, status: "pending", time: "8 mins ago" },
  { id: "TXN004", user: "Sarah Wilson", service: "Cable TV", amount: 8000, status: "completed", time: "12 mins ago" },
  { id: "TXN005", user: "David Brown", service: "Data", amount: 3500, status: "failed", time: "15 mins ago" },
]

export function EnhancedAdminDashboard() {
  const [timeRange, setTimeRange] = useState("30d")
  const [selectedTab, setSelectedTab] = useState("overview")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-green-600"
      case "good":
        return "text-blue-600"
      case "warning":
        return "text-yellow-600"
      case "poor":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getTransactionStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <RealtimeProvider enableMockData={true}>
      <div className="space-y-6">
        <ConnectionStatus />

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Real-time Dashboard</h1>
            <p className="text-muted-foreground">Live platform monitoring and analytics</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Last hour</SelectItem>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button className="material-button">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Live Metrics */}
        <LiveMetrics />

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto p-1">
            <TabsTrigger value="overview" className="flex items-center space-x-2 py-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center space-x-2 py-2">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Transactions</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2 py-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center space-x-2 py-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden sm:inline">Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2 py-2">
              <PieChartIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <LiveCharts />
              </div>
              <div className="space-y-6">
                <LiveTransactions />
              </div>
            </div>
            <SystemAlerts />
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LiveTransactions />
              <div className="space-y-6">
                <LiveCharts />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <LiveCharts />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <SystemAlerts />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <LiveCharts />
          </TabsContent>
        </Tabs>
      </div>
    </RealtimeProvider>
  )
}
