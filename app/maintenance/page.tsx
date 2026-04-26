"use client";

import { motion } from "framer-motion";
import { 
  Construction, 
  Settings, 
  Timer, 
  Hammer, 
  Instagram, 
  Mail, 
  MessageCircle,
  Wrench
} from "lucide-react";
import React from "react";

export default function MaintenancePage() {
  return (
    <div className="fixed inset-0 z-[100] min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 overflow-hidden font-sans">
      {/* Background Animated Gradients */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/20 blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1],
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/20 blur-[120px]"
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
      <div 
        className="absolute inset-0 z-0 opacity-[0.1]" 
        style={{ 
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }} 
      />

      <div className="relative z-10 max-w-2xl w-full text-center flex flex-col items-center justify-center">
        {/* Animated Icon Cluster */}
        <div className="mb-12 relative">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="w-28 h-28 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-[0_20px_50px_rgba(59,130,246,0.3)] border border-white/10"
          >
            <Construction className="w-14 h-14 text-white" />
          </motion.div>
          
          {/* Floating Orbiting Icons */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-10 border border-slate-800/40 rounded-full pointer-events-none"
          >
            <motion.div 
               animate={{ rotate: -360 }} 
               transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
               className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2.5 bg-slate-900 border border-slate-800 rounded-xl shadow-xl"
            >
              <Wrench className="w-5 h-5 text-blue-400" />
            </motion.div>
          </motion.div>

          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-20 border border-slate-800/20 rounded-full pointer-events-none"
          >
            <motion.div 
               animate={{ rotate: 360 }} 
               transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
               className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 p-2.5 bg-slate-900 border border-slate-800 rounded-xl shadow-xl"
            >
              <Settings className="w-5 h-5 text-indigo-400" />
            </motion.div>
          </motion.div>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            System Update In Progress
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
            Coming <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Soon</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-lg mx-auto leading-relaxed">
            Kami sedang memperbarui <span className="text-white font-semibold">Dienggo</span> untuk memberikan pengalaman booking villa & tour yang lebih baik. 
            Mohon kembali lagi dalam beberapa saat.
          </p>

          {/* Progress Indicator */}
          <div className="max-w-sm mx-auto space-y-3 pt-6">
            <div className="flex justify-between text-xs text-slate-500 font-bold tracking-widest uppercase px-1">
              <span>Current Status</span>
              <span className="text-blue-400">85% Complete</span>
            </div>
            <div className="h-3 w-full bg-slate-900/80 rounded-full overflow-hidden border border-slate-800 p-[2px]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "85%" }}
                transition={{ duration: 2.5, ease: "circOut", delay: 0.5 }}
                className="h-full rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 shadow-[0_0_20px_rgba(59,130,246,0.6)]"
              />
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 text-left">
            <motion.div 
              whileHover={{ y: -5, backgroundColor: "rgba(30, 41, 59, 0.6)" }}
              className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/50 backdrop-blur-md transition-colors"
            >
              <div className="flex items-center gap-3 mb-3 text-blue-400">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Timer className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white">Estimasi Selesai</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">Tim kami sedang bekerja keras. Diperkirakan akan selesai dalam beberapa jam ke depan.</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5, backgroundColor: "rgba(30, 41, 59, 0.6)" }}
              className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/50 backdrop-blur-md transition-colors"
            >
              <div className="flex items-center gap-3 mb-3 text-indigo-400">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                  <Hammer className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white">Apa yang Baru?</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">Peningkatan performa pencarian, UI yang lebih segar, dan sistem pembayaran yang lebih aman.</p>
            </motion.div>
          </div>

          {/* Contact & Socials */}
          <div className="flex flex-col items-center gap-6 pt-12 border-t border-slate-900 mt-8">
            <p className="text-slate-500 text-sm font-medium">Ada pertanyaan mendesak? Hubungi kami:</p>
            <div className="flex items-center gap-4">
              <motion.a 
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="https://instagram.com/dienggo.id" 
                target="_blank"
                className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all shadow-lg"
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="mailto:halo@dienggo.id" 
                className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all shadow-lg"
              >
                <Mail className="w-5 h-5" />
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="https://wa.me/6281234567890" 
                target="_blank"
                className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
              </motion.a>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-16 text-slate-600 text-xs font-bold tracking-[0.2em] uppercase"
        >
          &copy; {new Date().getFullYear()} Dienggo Plateau &bull; Premium Travel Experience
        </motion.div>
      </div>
    </div>
  );
}
