import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import type React from "react";

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  className?: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  children,
  title,
  subtitle,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="w-full max-w-md"
  >
    <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
      <CardHeader className="space-y-1 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="flex justify-center mb-4"
        >
          <Image
            src="/sgpu.svg"
            alt="Logo SGPU"
            width={140}
            height={50}
            className="w-auto h-16"
          />
        </motion.div>
        <CardTitle className="text-3xl font-bold text-white">{title}</CardTitle>
        <p className="text-blue-100/80">{subtitle}</p>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  </motion.div>
);
