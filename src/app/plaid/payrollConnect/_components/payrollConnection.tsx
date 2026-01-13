"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Separator } from "@/src/components/ui/separator"
import { CreditCard, Shield, CheckCircle, ArrowRight, Briefcase, TrendingUp, Clock, Users, Loader2 } from "lucide-react"
import useConnectPayroll from "../../hook/useConnectPayrrol"
import { PlaidLink } from "react-plaid-link"

interface IncomeData {
  type: "payroll" | "bank"
  accountName: string
  monthlyIncome: number
  lastUpdated: string
  status: "connected" | "pending" | "error"
}

export function PlaidIncomeConnect() {
  const [connectedAccounts, setConnectedAccounts] = useState<IncomeData[]>([])
  const { error, linkToken, connectionStatus } = useConnectPayroll()

  const handleConnectIncome = async () => {
    if (linkToken) {
      setTimeout(() => {
        const newAccounts: IncomeData[] = [
          {
            type: "payroll",
            accountName: "ADP Payroll",
            monthlyIncome: 5500,
            lastUpdated: new Date().toLocaleDateString(),
            status: "connected",
          },
          {
            type: "bank",
            accountName: "Chase Checking",
            monthlyIncome: 4200,
            lastUpdated: new Date().toLocaleDateString(),
            status: "connected",
          },
        ]
        setConnectedAccounts(newAccounts)
      }, 2000)
    }
  }

  const totalMonthlyIncome = connectedAccounts.reduce((sum, account) => sum + account.monthlyIncome, 0)

  return (
    <div className="space-y-6">
      {/* Income Summary */}
      {connectedAccounts.length > 0 && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <TrendingUp className="h-5 w-5" />
              Income Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900 dark:text-green-100 mb-2">
              ${totalMonthlyIncome.toLocaleString()}/month
            </div>
            <p className="text-green-700 dark:text-green-300">
              Based on {connectedAccounts.length} connected account{connectedAccounts.length !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
              <Shield className="h-5 w-5" />
              <span className="font-medium">Connection Error</span>
            </div>
            <p className="text-red-700 dark:text-red-300 mt-1">{error}</p>
          </CardContent>
        </Card>
      )}

      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 dark:bg-blue-900/20 rounded-full -translate-y-16 translate-x-16" />
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-emerald-100 dark:from-blue-900/30 dark:to-emerald-900/30 rounded-lg">
              <div className="flex items-center gap-1">
                <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <CreditCard className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl">Connect Your Income</CardTitle>
              <CardDescription>Link both payroll and bank accounts to get comprehensive income data</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Payroll Income Features */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-medium text-blue-700 dark:text-blue-300">
                <Briefcase className="h-4 w-4" />
                Payroll Income (US Only)
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Employment and gross income information
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Pay stub data available
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Includes gig workers
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Users className="h-4 w-4 text-blue-500" />
                  Covers ~80% of US workforce
                </div>
              </div>
            </div>

            {/* Bank Income Features */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-medium text-emerald-700 dark:text-emerald-300">
                <CreditCard className="h-4 w-4" />
                Bank Income (Global)
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Net income information
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Income streams breakdown
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Recent and historical data
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4 text-emerald-500" />
                  Historical income available
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <PlaidLink
              token={linkToken ?? null}
              onSuccess={(public_token, metadata) => {
              console.log("onSuccess - Public Token:", public_token);
              console.log("onSuccess - Metadata:", metadata);
              }}
              onExit={(err, metadata) => {
                console.log("onExit - Error:", err);
                console.log("onExit - Metadata:", metadata);
              }}
              className="w-full border-none flex justify-center items-center gap-4"
              style={{
                border: "none",
                background: "none",
                padding: 0,
                outline: "none",
              }}

            >
              <Button
                asChild
                size="lg"
                className="w-full hover:from-blue-700 hover:to-indigo-700"
                disabled={connectionStatus === "connecting"}
              >
                {connectionStatus === "connecting" ? (
                  <div>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </div>
                ) : (
                  <div>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Connect Your Income
                  </div>
                )}
              </Button>
            </PlaidLink>
        </CardContent>
      </Card>

      {/* Connected Accounts */}
      {connectedAccounts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Connected Accounts
            </CardTitle>
            <CardDescription>Manage your active income connections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {connectedAccounts.map((account, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        account.type === "payroll"
                          ? "bg-blue-100 dark:bg-blue-900/30"
                          : "bg-emerald-100 dark:bg-emerald-900/30"
                      }`}
                    >
                      {account.type === "payroll" ? (
                        <Briefcase
                          className={`h-5 w-5 ${
                            account.type === "payroll"
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-emerald-600 dark:text-emerald-400"
                          }`}
                        />
                      ) : (
                        <CreditCard className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{account.accountName}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {account.type === "payroll" ? "Payroll" : "Bank Account"} • Updated {account.lastUpdated}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-lg">${account.monthlyIncome.toLocaleString()}/month</div>
                    <Badge
                      variant={account.status === "connected" ? "default" : "secondary"}
                      className={
                        account.status === "connected"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : ""
                      }
                    >
                      {account.status === "connected" ? "Connected" : "Pending"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Notice */}
      <Card className="bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-gray-600 dark:text-gray-400 mt-0.5" />
            <div className="space-y-1">
              <div className="font-medium text-gray-900 dark:text-gray-100">Security & Privacy</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Plaid uses bank-level encryption to protect your information. We never store your login credentials and
                only access the data necessary to provide income analysis services.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
