import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ScanFace, ShieldCheck, Zap } from "lucide-react";

export default function AuthShell({
  title,
  description,
  children,
  footer,
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left Side */}
      <div className="relative hidden overflow-hidden bg-primary text-primary-foreground lg:flex">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary/70" />

        <div className="relative flex h-full flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
              <Sparkles className="h-5 w-5" />
            </div>

            <span className="font-display text-xl font-semibold">
              FaceTrack
            </span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md"
          >
            <h2 className="font-display text-4xl font-bold leading-tight">
              Face Recognition Attendance
              <br />
              Built for Modern Institutions.
            </h2>

            <div className="mt-10 space-y-5">
              {[
                {
                  icon: ScanFace,
                  text: "97.8% recognition accuracy",
                },
                {
                  icon: Zap,
                  text: "Attendance in under 10 seconds",
                },
                {
                  icon: ShieldCheck,
                  text: "Secure encrypted face embeddings",
                },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                    <item.icon className="h-5 w-5" />
                  </div>

                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <p className="text-sm text-white/70">
            © 2026 FaceTrack Smart Attendance Management System
          </p>
        </div>
      </div>

      {/* Right Side */}

      <div className="flex items-center justify-center bg-background px-8 py-6">

        <div className="w-full max-w-5xl">

          <Link
            to="/"
            className="mb-6 flex items-center gap-2 lg:hidden"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </div>

            <span className="font-display text-xl font-semibold">
              FaceTrack
            </span>
          </Link>

          <h1 className="font-display text-3xl font-bold">
            {title}
          </h1>

          {description && (
            <p className="mt-2 text-muted-foreground">
              {description}
            </p>
          )}

          <div className="mt-8">
            {children}
          </div>

          {footer && (
            <div className="mt-6 text-center text-sm text-muted-foreground">
              {footer}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}