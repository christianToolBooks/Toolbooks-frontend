"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import GoogleLoginButton from "./GoogleLoginButton";
import { slideVariants } from "../utils/motion.variants";

// Define FormSection outside the main component to prevent its recreation on each render
const FormSection = ({ position, isLogin, setIsLogin }: { position: "left" | "right", isLogin: boolean, setIsLogin: React.Dispatch<React.SetStateAction<boolean>> }) => (
  <motion.div
    key={`form-${position}`}
    className="w-full lg:w-1/2 flex items-center justify-center"
    variants={slideVariants}
    initial={position === "left" ? "enterFromLeft" : "enterFromRight"}
    animate="center"
    exit={position === "left" ? "exitToLeft" : "exitToRight"}
  >
    <Card className="w-full justify-center max-w-md shadow-none border-none">
      <CardHeader className="text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <CardTitle className="text-3xl font-bold text-foreground mb-2">
            {isLogin ? "Login" : "Sign up"}
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            {isLogin
              ? "Enter your account details"
              : "Create your account to get started"}
          </p>
        </motion.div>
      </CardHeader>

      <CardContent className="space-y-6 overflow-y-auto h-[30rem] p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.1 }}
        >
          {/* Google Login Button */}
          <GoogleLoginButton />

          {/* Divider */}
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
        </motion.div>

        {/* Form with stagger animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.1 }}
        >
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.1 }}
              >
                <LoginForm />
              </motion.div>
            ) : (
              <motion.div
                key="register-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.1 }}
              >
                <RegisterForm />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Toggle between Login/Signup */}
        <motion.div
          className="text-center pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.1 }}
        >
          <p className="text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <motion.button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLogin ? "Sign up" : "Login"}
            </motion.button>
          </p>
        </motion.div>
      </CardContent>
    </Card>
  </motion.div>
);

// Define WelcomeSection outside the main component
const WelcomeSection = ({ position }: { position: "left" | "right" }) => (
  <motion.div
    key={`welcome-${position}`}
    className="hidden lg:flex lg:w-1/2 items-center justify-center h-full bg-primary self-center shadow-2xl"
    variants={slideVariants}
    initial={position === "left" ? "enterFromLeft" : "enterFromRight"}
    animate="center"
    exit={position === "left" ? "exitToLeft" : "exitToRight"}
  >
    <Card className="backdrop-blur bg-primary shadow-none border-none">
      <CardContent className="text-center space-y-4 p-8">
        <motion.div
          className="flex items-center justify-center gap-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.4,
            duration: 0.6,
            type: "decay",
            stiffness: 200,
          }}
        >
          <Image
            alt="logo-ToolBooks"
            src="/logo-BgWhite.png"
            width={96}
            height={96}
            className="h-24 w-24 rounded-full"
          />
          <h2 className="text-3xl font-bold text-white">
            Welcome to ToolBooks
          </h2>
        </motion.div>
        <motion.p
          className="text-white/80 text-sm ml-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Manage your bank statements with clarity and confidence.
        </motion.p>
      </CardContent>
    </Card>
  </motion.div>
);

export default function AuthFormClient() {
  const [isLogin, setIsLogin] = useState<boolean>(true);

  return (
    <div className="min-h-screen w-full bg-secondary flex items-center justify-center p-4">
      <Card className="w-full h-[45rem] max-w-6xl shadow-2xl overflow-hidden border-none py-0 flex justify-center">
        <div className="flex min-h-full relative">
          <AnimatePresence mode="popLayout">
            {/* Conditional rendering based on isLogin state */}
            {isLogin ? (
              <motion.div key="login-layout" className="flex w-full">
                <FormSection position="left" isLogin={isLogin} setIsLogin={setIsLogin} />
                <WelcomeSection position="right" />
              </motion.div>
            ) : (
              <motion.div key="signup-layout" className="flex w-full">
                <WelcomeSection position="left" />
                <FormSection position="right" isLogin={isLogin} setIsLogin={setIsLogin} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
}
