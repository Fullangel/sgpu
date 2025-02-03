"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  Bell,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type React from "react";
import SessionWrapper from "@/components/SessionWrapper";

interface NavItem {
  icon: typeof LayoutDashboard;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Preparadores", href: "/dashboard/preparadores" },
  { icon: BookOpen, label: "Materias", href: "/dashboard/materias" },
  { icon: GraduationCap, label: "Estudiantes", href: "/dashboard/estudiantes" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen ? 0 : -300 }}
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 border-r border-gray-200 dark:border-gray-700",
          "bg-white dark:bg-gray-800 shadow-lg transition-transform"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <motion.img
              src="/sgpu.svg"
              alt="SGPU Logo"
              className="h-8 w-auto"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            />
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl font-semibold text-gray-900 dark:text-white"
            >
              SGPU
            </motion.span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>

        <nav className="space-y-1 p-4">
          {navItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300",
                  "hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                  "group relative overflow-hidden"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                  layoutId={`nav-highlight-${item.href}`}
                />
              </Link>
            </motion.div>
          ))}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div
        className={cn(
          "transition-all duration-300",
          isSidebarOpen ? "lg:ml-64" : "lg:ml-0"
        )}
      >
        <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
          <div className="flex h-full items-center justify-between px-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(true)}
              className={cn("lg:hidden", isSidebarOpen && "hidden")}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-4 ml-auto">
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                  A
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Admin User
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8">
          <SessionWrapper>
            <AnimatePresence mode="wait">{children}</AnimatePresence>
          </SessionWrapper>
        </main>
      </div>
    </div>
  );
}
