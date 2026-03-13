'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

export default function Home() {
  const [activeTab, setActiveTab] = useState('all')

  return (
    <main className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 gradient-mesh pointer-events-none opacity-60" />
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-20 right-10 w-[600px] h-[600px] bg-primary-light/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '3s' }} />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-primary/20"
      >
        <div className="container mx-auto px-6 py-5 flex justify-between items-center max-w-7xl">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3"
          >
            <img src="/assets/logo.png" alt="LookReal Logo" className="w-10 h-10 rounded-xl" />
            <span className="text-2xl font-display font-bold">LookReal</span>
          </motion.div>
          <div className="hidden md:flex gap-8 items-center">
            <a href="#features" className="hover:text-primary transition-colors font-medium">Features</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors font-medium">How It Works</a>
            <a href="#gallery" className="hover:text-primary transition-colors font-medium">Gallery</a>
            <a href="#download" className="hover:text-primary transition-colors font-medium">Download</a>
            <a href="/contact" className="hover:text-primary transition-colors font-medium">Contact</a>
            <motion.a
              href="#download"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-primary to-primary-light px-6 py-2.5 rounded-full font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all"
            >
              Get Started
            </motion.a>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 px-4 py-2 rounded-full mb-6"
              >
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-primary-light">Now Available on iOS & Android</span>
              </motion.div>

              <h1 className="text-6xl md:text-7xl font-display font-bold mb-6 leading-tight">
                Your Local
                <br />
                <span className="text-gradient">Marketplace</span>
                <br />
                Simplified
              </h1>
              
              <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-xl">
                Book services, shop products, and connect with trusted vendors in your area. Secure payments, real-time communication, and seamless transactions.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <motion.a
                  href="https://apps.apple.com/ng/app/lookreal/id6749508043"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-primary to-primary-light px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-primary/50 transition-all inline-flex items-center justify-center gap-3"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  Download for iOS
                </motion.a>

                <motion.a
                  href="https://play.google.com/store/apps/details?id=com.inuud.sharplook"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-slate-800/80 backdrop-blur-sm border-2 border-primary/40 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-700 hover:shadow-2xl hover:shadow-primary/30 transition-all inline-flex items-center justify-center gap-3"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z"/>
                  </svg>
                  Download for Android
                </motion.a>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6">
                {[
                  { value: '10K+', label: 'Active Users' },
                  { value: '500+', label: 'Vendors' },
                  { value: '4.8★', label: 'Rating' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                  >
                    <div className="text-3xl font-bold text-primary-light">{stat.value}</div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right - Phone Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden lg:flex justify-center items-center"
            >
              <div className="relative">
                <motion.div
                  animate={{ 
                    rotate: [0, 5, 0, -5, 0],
                    y: [0, -10, 0, -10, 0]
                  }}
                  transition={{ 
                    duration: 6, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-light blur-[80px] opacity-60 animate-pulse-glow" />
                  <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 border-[6px] border-slate-700 rounded-[3.5rem] p-4 shadow-2xl">
                    <div className="bg-slate-950 rounded-[3rem] overflow-hidden w-72 h-[580px]">
                      {/* Phone Content */}
                      <div className="h-full flex flex-col">
                        {/* Status Bar */}
                        <div className="px-6 py-3 flex justify-between items-center text-xs">
                          <span>9:41</span>
                          <div className="flex gap-1">
                            <div className="w-4 h-4 bg-slate-700 rounded-sm" />
                            <div className="w-4 h-4 bg-slate-700 rounded-sm" />
                            <div className="w-4 h-4 bg-slate-700 rounded-sm" />
                          </div>
                        </div>

                        {/* App Content */}
                        <div className="flex-1 px-6 py-4 space-y-4">
                          {/* Header */}
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm text-slate-400">Welcome back!</div>
                              <div className="text-lg font-bold">Find Services</div>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-sm font-bold">
                              J
                            </div>
                          </div>

                          {/* Search Bar */}
                          <div className="bg-slate-800 rounded-2xl px-4 py-3 flex items-center gap-3">
                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <span className="text-sm text-slate-400">Search vendors...</span>
                          </div>

                          {/* Categories */}
                          <div className="grid grid-cols-4 gap-3">
                            {['Beauty', 'Tech', 'Food', 'Home'].map((cat, i) => (
                              <div key={i} className="bg-slate-800 rounded-xl p-3 text-center">
                                <div className="w-8 h-8 bg-primary/20 rounded-lg mx-auto mb-1" />
                                <div className="text-xs">{cat}</div>
                              </div>
                            ))}
                          </div>

                          {/* Featured Card */}
                          <div className="bg-gradient-to-br from-primary/20 to-primary-light/10 border border-primary/30 rounded-2xl p-4 space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-slate-800 rounded-xl" />
                              <div className="flex-1">
                                <div className="font-semibold">Top Rated Vendor</div>
                                <div className="text-xs text-slate-400">2.5 km away</div>
                              </div>
                              <div className="text-primary text-sm font-bold">★ 4.9</div>
                            </div>
                            <div className="flex gap-2">
                              <div className="flex-1 bg-primary/20 rounded-lg py-2 text-center text-xs">View</div>
                              <div className="flex-1 bg-primary rounded-lg py-2 text-center text-xs font-semibold">Book Now</div>
                            </div>
                          </div>

                          {/* List Items */}
                          {[1, 2].map((i) => (
                            <div key={i} className="bg-slate-800/50 rounded-xl p-3 flex items-center gap-3">
                              <div className="w-10 h-10 bg-slate-700 rounded-lg" />
                              <div className="flex-1">
                                <div className="text-sm font-medium">Service Name</div>
                                <div className="text-xs text-slate-400">Available today</div>
                              </div>
                              <div className="text-primary text-xs">→</div>
                            </div>
                          ))}
                        </div>

                        {/* Bottom Nav */}
                        <div className="border-t border-slate-800 px-6 py-4 flex justify-around">
                          {[
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />,
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          ].map((path, i) => (
                            <svg key={i} className={`w-6 h-6 ${i === 0 ? 'text-primary' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              {path}
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-block bg-primary/10 border border-primary/30 px-4 py-2 rounded-full mb-6">
              <span className="text-sm font-semibold text-primary-light">POWERFUL FEATURES</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Everything You Need in <span className="text-gradient">One App</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              From booking services to shopping products, LookReal provides all the tools you need for seamless local commerce
            </p>
          </motion.div>

          {/* Feature Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {['all', 'marketplace', 'booking', 'communication', 'security'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-full font-semibold capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-primary to-primary-light text-white shadow-lg shadow-primary/30'
                    : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.filter(f => activeTab === 'all' || f.category === activeTab).map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.6 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-sm border border-primary/20 rounded-3xl p-8 hover:border-primary/50 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:to-primary-light/5 rounded-3xl transition-all duration-300" />
                
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary/30 to-primary-light/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:from-primary group-hover:to-primary-light transition-all duration-300">
                    {feature.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary-light transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-slate-400 leading-relaxed text-sm">
                    {feature.description}
                  </p>

                  {feature.status && (
                    <div className="mt-4 inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-xs font-semibold text-green-400">{feature.status}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative py-32 px-6 bg-slate-900/50">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-block bg-primary/10 border border-primary/30 px-4 py-2 rounded-full mb-6">
              <span className="text-sm font-semibold text-primary-light">SIMPLE PROCESS</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-display font-bold mb-6">
              How <span className="text-gradient">LookReal</span> Works
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Search & Discover',
                description: 'Browse local vendors, services, and products near you with smart distance calculations',
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              },
              {
                step: '02',
                title: 'Book or Buy',
                description: 'Make bookings, order products, negotiate offers, and communicate directly with vendors',
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              },
              {
                step: '03',
                title: 'Secure Payment',
                description: 'Complete transactions safely with our escrow system protecting both buyers and vendors',
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative"
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-light rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {step.icon}
                    </svg>
                  </div>
                  <div className="text-6xl font-display font-bold text-primary/20 mb-4">{step.step}</div>
                  <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{step.description}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* App Screenshots Gallery */}
      <section id="gallery" className="relative py-32 px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-block bg-primary/10 border border-primary/30 px-4 py-2 rounded-full mb-6">
              <span className="text-sm font-semibold text-primary-light">SEE IT IN ACTION</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Experience <span className="text-gradient">LookReal</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Take a look at how the app works — from browsing vendors to booking services and shopping products
            </p>
          </motion.div>

          {/* App Screenshots */}
          <div className="mb-20">
            <h3 className="text-2xl font-display font-bold mb-8 text-center">App Screenshots</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[
                'IMG_0163.png', 'IMG_0164.png', 'IMG_0165.png', 'IMG_0166.png',
                'IMG_0167.png', 'IMG_0168.png', 'IMG_0169.png', 'IMG_0170.png',
                
              ].map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  whileHover={{ y: -8, scale: 1.03 }}
                  className="group relative rounded-3xl overflow-hidden border-2 border-primary/20 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-primary/20"
                >
                  <img
                    src={`/assets/screenshots/${img}`}
                    alt={`LookReal app screenshot ${i + 1}`}
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Vendor & Product Images */}
          <div>
            <h3 className="text-2xl font-display font-bold mb-8 text-center">Vendors & Products</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[
                '1011451721.jpg', '1011451723.jpg', '1011451734.jpg', '1011451736.jpg',
                
              ].map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  whileHover={{ y: -8, scale: 1.03 }}
                  className="group relative aspect-square rounded-3xl overflow-hidden border-2 border-primary/20 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-primary/20"
                >
                  <img
                    src={`/assets/gallery/${img}`}
                    alt={`Vendor product ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="relative py-32 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-primary/20 rounded-3xl p-12 md:p-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                  Your Security is <span className="text-gradient">Our Priority</span>
                </h2>
                <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                  We've built LookReal with security at its core. From escrow payments to verified vendors, every feature is designed to protect you.
                </p>
                <div className="space-y-4">
                  {[
                    'Escrow payment protection',
                    'Late cancellation fees',
                    'Vendor verification system',
                    'Secure in-app messaging',
                    'Transaction monitoring',
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-slate-300">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: '🔒', title: 'Secure', desc: 'End-to-end encryption' },
                    { icon: '✓', title: 'Verified', desc: 'Trusted vendors only' },
                    { icon: '💰', title: 'Protected', desc: 'Escrow payments' },
                    { icon: '⚡', title: 'Fast', desc: 'Instant notifications' },
                  ].map((card, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="bg-slate-800/50 border border-primary/20 rounded-2xl p-6 text-center"
                    >
                      <div className="text-4xl mb-3">{card.icon}</div>
                      <div className="font-bold text-lg mb-1">{card.title}</div>
                      <div className="text-sm text-slate-400">{card.desc}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="relative py-32 px-6">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-primary/20 via-primary-light/10 to-primary/20 backdrop-blur-sm border border-primary/30 rounded-3xl p-12 md:p-20 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI0Q3Mzg3MCIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-30" />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">
                Ready to Start?
              </h2>
              <p className="text-xl text-slate-200 mb-12 max-w-2xl mx-auto">
                Join thousands of users and vendors already using LookReal. Available now on iOS and Android.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
                <motion.a
                  href="https://apps.apple.com/ng/app/lookreal/id6749508043"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="group flex items-center gap-4 bg-slate-950/90 hover:bg-slate-900 border-2 border-primary/50 px-8 py-5 rounded-2xl transition-all shadow-lg hover:shadow-primary/30 min-w-[240px]"
                >
                  <svg className="w-12 h-12 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs text-slate-400 group-hover:text-slate-300">Download on the</div>
                    <div className="text-2xl font-bold group-hover:text-primary-light transition-colors">App Store</div>
                  </div>
                </motion.a>

                <motion.a
                  href="https://play.google.com/store/apps/details?id=com.inuud.sharplook"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="group flex items-center gap-4 bg-slate-950/90 hover:bg-slate-900 border-2 border-primary/50 px-8 py-5 rounded-2xl transition-all shadow-lg hover:shadow-primary/30 min-w-[240px]"
                >
                  <svg className="w-12 h-12 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs text-slate-400 group-hover:text-slate-300">GET IT ON</div>
                    <div className="text-2xl font-bold group-hover:text-primary-light transition-colors">Google Play</div>
                  </div>
                </motion.a>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Free to download • No credit card required</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 px-6 border-t border-primary/20">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src="/assets/logo.png" alt="LookReal Logo" className="w-10 h-10 rounded-xl" />
                <span className="text-2xl font-display font-bold">LookReal</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Your trusted local marketplace for services and products. Connect, book, and shop with confidence.
              </p>
              <div className="space-y-2">
                <a href="mailto:support@lookreal.beauty" className="flex items-center gap-2 text-sm text-slate-400 hover:text-primary transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  support@lookreal.beauty
                </a>
                <a href="tel:+2347066965448" className="flex items-center gap-2 text-sm text-slate-400 hover:text-primary transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  +2347066965448
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">For Vendors</a></li>
                <li><a href="#download" className="hover:text-primary transition-colors">Download</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                <li><a href="/contact" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
                <li><a href="/delete-account" className="hover:text-primary transition-colors">Delete Account</a></li>

                <li><a href="#" className="hover:text-primary transition-colors">Support</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-primary/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-slate-400">
              © 2026 LookReal. All rights reserved.
            </div>
            
            <div className="flex gap-3">
              {[
                { label: 'Facebook', href: 'https://www.facebook.com/share/1DEJ4uzgDX/?mibextid=wwXIfr', path: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/> },
  
                { label: 'Instagram', href: 'https://www.instagram.com/lookrealapp?igsh=MWZubWVndmczeGtuNQ==', path: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/> },
                { label: 'TikTok', href: 'https://www.tiktok.com/@lookrealapp?_r=1&_t=ZS-94NvbHGg5NS', path: <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/> },
                
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  aria-label={social.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 bg-slate-800 hover:bg-primary rounded-full flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    {social.path}
                  </svg>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

const features = [
  {
    category: 'marketplace',
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
    title: 'Product Marketplace',
    description: 'Browse and order products from local vendors. Sponsored and featured listings help you discover the best deals.',
    status: 'Active'
  },
  {
    category: 'booking',
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    title: 'Service Bookings',
    description: 'Book appointments and services directly with verified vendors. Manage all your bookings in one place.',
    status: 'Active'
  },
  {
    category: 'marketplace',
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
    title: 'Smart Search',
    description: 'Find vendors and services near you with intelligent distance calculations and filtering options.',
    status: 'Active'
  },
  {
    category: 'marketplace',
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    title: 'Offer Bargaining',
    description: 'Negotiate prices directly with vendors. Make offers and counter-offers until you reach a fair deal.',
    status: 'Active'
  },
  {
    category: 'security',
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
    title: 'Escrow Protection',
    description: 'Secure payment system that holds funds until service completion. Both buyers and vendors are protected.',
    status: 'Active'
  },
  {
    category: 'booking',
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    title: 'Late Cancellation Fee',
    description: 'Fair cancellation policy with fees for late cancellations to protect vendor time and commitments.',
    status: 'Active'
  },
  {
    category: 'communication',
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
    title: 'In-App Messaging',
    description: 'Communicate directly with vendors through secure in-app messages. Keep all conversations organized.',
    status: 'Active'
  },
  {
    category: 'communication',
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>,
    title: 'Voice Recording',
    description: 'Send voice messages to vendors for quick communication. Perfect for detailed inquiries.',
    status: 'Active'
  },
  {
    category: 'communication',
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    title: 'Email Integration',
    description: 'Stay updated with email notifications for bookings, messages, and important updates.',
    status: 'Active'
  },
  {
    category: 'marketplace',
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
    title: 'Service Posting',
    description: 'Vendors can post their services with detailed descriptions, pricing, and availability.',
    status: 'Active'
  },
  {
    category: 'security',
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
    title: 'Approval System',
    description: 'All services and products go through an approval process to ensure quality and authenticity.',
    status: 'Active'
  },
  {
    category: 'marketplace',
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    title: 'Featured Products',
    description: 'Vendors can feature their best products for increased visibility and better reach.',
    status: 'Active'
  },
  {
    category: 'communication',
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
    title: 'Real-Time Notifications',
    description: 'Get instant notifications for new messages, booking updates, and payment confirmations.',
    status: 'Active'
  },
  {
    category: 'booking',
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    title: 'Distance Tracking',
    description: 'See exactly how far vendors are from your location with accurate distance calculations.',
    status: 'Active'
  },
  {
    category: 'security',
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    title: 'User Registration',
    description: 'Simple and secure registration flow with verification to ensure authentic users.',
    status: 'Active'
  },
]
