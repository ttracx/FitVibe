import Link from "next/link";
import {
  Dumbbell,
  Flame,
  BarChart3,
  Sparkles,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Dumbbell,
    title: "Log Workouts",
    description: "Track every rep, set, and workout with our intuitive logging system",
  },
  {
    icon: BarChart3,
    title: "Track Progress",
    description: "Visualize your gains with beautiful charts and analytics",
  },
  {
    icon: Flame,
    title: "Streak Tracking",
    description: "Stay motivated with streak tracking and achievement badges",
  },
  {
    icon: Sparkles,
    title: "AI Coach",
    description: "Get personalized workout suggestions powered by AI",
  },
];

const benefits = [
  "Unlimited workout logging",
  "300+ exercise library",
  "Custom workout templates",
  "Advanced progress charts",
  "AI workout suggestions",
  "Streak tracking & badges",
  "Export workout history",
  "Priority support",
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-8 w-8 text-orange-500" />
            <span className="text-xl font-bold">FitVibe</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-purple-500/10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Your Fitness Journey,{" "}
              <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Supercharged
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
              Track workouts, crush your goals, and transform your body with
              AI-powered insights. Join thousands achieving their fitness dreams.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button size="lg" className="gap-2">
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#pricing">
                <Button variant="outline" size="lg">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Everything You Need to{" "}
              <span className="text-orange-500">Succeed</span>
            </h2>
            <p className="mt-4 text-gray-400">
              Powerful features to help you reach your fitness goals faster
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-gray-800 bg-gray-900 p-6 transition-colors hover:border-orange-500/50"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10">
                  <feature.icon className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Simple, Transparent{" "}
              <span className="text-orange-500">Pricing</span>
            </h2>
            <p className="mt-4 text-gray-400">
              One plan, all features. No hidden fees.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-lg">
            <div className="rounded-2xl border-2 border-orange-500 bg-gray-900 p-8 shadow-xl shadow-orange-500/10">
              <div className="text-center">
                <h3 className="text-2xl font-bold">FitVibe Pro</h3>
                <div className="mt-4 flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold">$9.99</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <p className="mt-2 text-sm text-gray-400">
                  Cancel anytime. 7-day free trial.
                </p>
              </div>
              <ul className="mt-8 space-y-3">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-orange-500" />
                    <span className="text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register" className="mt-8 block">
                <Button className="w-full" size="lg">
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 p-8 text-center sm:p-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to Transform Your Fitness?
            </h2>
            <p className="mt-4 text-lg text-orange-100">
              Join FitVibe today and start your journey to a healthier you.
            </p>
            <Link href="/register" className="mt-8 inline-block">
              <Button
                size="lg"
                className="bg-white text-orange-600 hover:bg-gray-100"
              >
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Dumbbell className="h-6 w-6 text-orange-500" />
              <span className="font-bold">FitVibe</span>
            </div>
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} FitVibe. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
