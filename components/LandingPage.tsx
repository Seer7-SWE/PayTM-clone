"use client";

import {
  CreditCard,
  TrendingUp,
  Globe,
  Star,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Floating Navigation */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-background/80 backdrop-blur-xl border border-border rounded-full px-6 py-3">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 font-bold text-lg">
            PayClone
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/signin")}
              className="text-sm px-4 py-2 hover:bg-neutral-500/10 rounded-full transition-colors cursor-pointer"
            >
              Signin
            </button>
            <button
              onClick={() => router.push("/signup")}
              className="text-sm px-4 py-2 bg-neutral-100 text-background rounded-full hover:bg-neutral-100/90 transition-colors cursor-pointer"
            >
              Signup
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Split Layout */}
      <div className="relative pt-24 pb-12">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-center min-h-[80vh]">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-500/10 rounded-full text-primary text-sm font-medium">
                  <Star className="w-4 h-4 fill-current" />
                  Trusted by 100M+ Indians
                </div>

                <h1 className="text-6xl lg:text-7xl font-black leading-none">
                  Money
                  <span className="block text-transparent bg-gradient-to-r from-neutral-100 to-purple-500 bg-clip-text">
                    Simplified
                  </span>
                </h1>

                <p className="text-2xl text-muted-foreground font-light leading-relaxed max-w-2xl">
                  Experience the next generation of digital payments. Fast,
                  secure, and beautifully simple.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => router.push("/signup")}
                  className="group flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-semibold text-lg hover:bg-neutral-900/90 transition-all hover:scale-103 hover:shadow-primary/25 cursor-pointer"
                >
                  Get Started
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => router.push("/signin")}
                  className="flex items-center gap-3 px-8 py-4 border border-border rounded-2xl font-semibold text-lg hover:bg-neutral-600/10 transition-all hover:scale-103 cursor-pointer"
                >
                  Login
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-primary">₹2.5T+</div>
                  <div className="text-muted-foreground">
                    Transaction Volume
                  </div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-primary">50M+</div>
                  <div className="text-muted-foreground">Active Users</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-primary">99.9%</div>
                  <div className="text-muted-foreground">Uptime</div>
                </div>
              </div>
            </div>

            {/* Right Content - Interactive Cards */}
            <div className="lg:col-span-5 relative">
              <div className="relative space-y-6">
                {/* Floating Payment Card */}
                <div className="absolute -top-4 -right-4 w-80 h-48 bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-6 text-primary-foreground shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <div className="text-sm opacity-80">PayClone Card</div>
                      <div className="text-2xl font-bold">₹25,847</div>
                    </div>
                    <CreditCard className="w-8 h-8 opacity-80" />
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-sm opacity-80">
                        **** **** **** 4829
                      </div>
                      <div className="text-xs opacity-60">Valid thru 12/28</div>
                    </div>
                    <div className="w-12 h-8 bg-white/20 rounded backdrop-blur-sm"></div>
                  </div>
                </div>

                {/* Transaction List */}
                <div className="bg-card border border-border rounded-3xl p-6 shadow-xl backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Recent Activity</h3>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="space-y-4">
                    {[
                      {
                        name: "Swiggy",
                        amount: "-₹340",
                        time: "2m ago",
                        icon: "🍔",
                      },
                      {
                        name: "Salary Credit",
                        amount: "+₹45,000",
                        time: "1h ago",
                        icon: "💰",
                      },
                      {
                        name: "Netflix",
                        amount: "-₹199",
                        time: "3h ago",
                        icon: "🎬",
                      },
                      {
                        name: "John Doe",
                        amount: "-₹500",
                        time: "5h ago",
                        icon: "👤",
                      },
                    ].map((transaction, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-accent transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-lg">
                            {transaction.icon}
                          </div>
                          <div>
                            <div className="font-medium">
                              {transaction.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {transaction.time}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`font-semibold ${
                            transaction.amount.startsWith("+")
                              ? "text-green-500"
                              : "text-foreground"
                          }`}
                        >
                          {transaction.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card border border-border rounded-2xl p-6 hover:bg-accent transition-colors cursor-pointer group">
                    <TrendingUp className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                    <div className="font-semibold">Invest</div>
                    <div className="text-sm text-muted-foreground">
                      Start with ₹100
                    </div>
                  </div>
                  <div className="bg-card border border-border rounded-2xl p-6 hover:bg-accent transition-colors cursor-pointer group">
                    <Globe className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                    <div className="font-semibold">Travel</div>
                    <div className="text-sm text-muted-foreground">
                      Book & Pay
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
