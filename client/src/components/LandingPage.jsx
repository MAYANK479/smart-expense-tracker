import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, ArrowRight, Camera, Globe, Target, PieChart, ShieldCheck, 
  CheckCircle2, ChevronDown, Zap, Heart, Star, Users, Lock, ChevronRight 
} from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';
import Badge from './ui/Badge';
import { CURRENCIES } from '../utils/currencies';

export default function LandingPage({ onLaunchDashboard, onSeedDemoData }) {
  const [openFaq, setOpenFaq] = useState(null);

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Senior Software Engineer at Stripe',
      text: 'Smart Expense AI transformed how I manage dual CAD & USD accounts. The AI receipt Vision OCR takes 2 seconds and extracts total outlay effortlessly.',
      stars: 5
    },
    {
      name: 'Rohan Sharma',
      role: 'Product Lead at Vercel',
      text: 'The multi-currency conversion in NPR, INR and USD is seamless. Best personal finance app I have used this year.',
      stars: 5
    },
    {
      name: 'Elena Rostova',
      role: 'Founder at TechStars',
      text: 'Setting monthly category budget caps with automated overspend alerts saved me over $450/month on food dining out.',
      stars: 5
    }
  ];

  const pricingPlans = [
    {
      name: 'Community Starter',
      price: '$0',
      period: 'Free Forever',
      description: 'Full feature set for individuals tracking personal expenses globally.',
      features: [
        'All 150+ Currencies (USD, CAD, NPR, EUR, GBP, INR)',
        'Unlimited Income & Expense Logging',
        'AI Receipt & Bill Vision Scanner',
        'Category Budget Limits & Overspend Warnings',
        'CSV Statement Import & Report Export',
        'AI Financial Health Score (0-100)'
      ],
      isPopular: false,
      ctaText: 'Start Free Today',
      onCtaClick: onLaunchDashboard
    },
    {
      name: 'Pro Enterprise AI',
      price: '$9',
      period: 'per month (Optional Supporter)',
      description: 'Dedicated cloud PostgreSQL storage, priority AI model tokens, and custom exports.',
      features: [
        'Everything in Community Starter',
        'Dedicated PostgreSQL Cloud Database Isolation',
        'Unlimited High-Res Receipt Scans',
        'Deep Gemini 2.5 & Llama-3 70B AI Pattern Engine',
        'Priority Supporter Badge',
        '24/7 Dedicated Support'
      ],
      isPopular: true,
      ctaText: 'Upgrade to Supporter Pro',
      onCtaClick: onSeedDemoData
    }
  ];

  const faqs = [
    {
      q: 'What is Smart Expense AI?',
      a: 'Smart Expense AI is a free-to-use AI-powered expense and income tracker that works worldwide. It supports all major currencies (USD, CAD, NPR, EUR, GBP, INR and 150+ more), AI categorization, receipt bill scanning, budget alerts, and cashflow analytics.'
    },
    {
      q: 'Is Smart Expense AI free to use?',
      a: 'Yes! Smart Expense AI is free to use with no credit card required. All core features including multi-currency tracking, AI pattern insights, and budget alerts are completely included.'
    },
    {
      q: 'Can I track expenses in my local currency?',
      a: 'Yes. Smart Expense AI supports all currencies worldwide including Nepalese Rupee (NPR), Canadian Dollar (CAD), US Dollar (USD), Euro (EUR), British Pound (GBP), Indian Rupee (INR), Australian Dollar (AUD) and 150+ more.'
    },
    {
      q: 'How does the AI Receipt & Bill OCR Scanner work?',
      a: 'Simply upload or snap a photo of any printed paper receipt or bill. Our Gemini & Vision AI engine automatically extracts the merchant name, date, category, and total outlay into your transaction log.'
    }
  ];

  return (
    <div className="min-h-screen text-slate-100 font-sans selection:bg-purple-500 selection:text-white">
      
      {/* HERO SECTION */}
      <section className="relative pt-24 pb-20 px-6 max-w-7xl mx-auto text-center overflow-hidden">
        
        {/* Animated Gradient Background Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-purple-600/20 via-pink-600/15 to-indigo-600/20 blur-[120px] rounded-full pointer-events-none -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-6 shadow-sm shadow-purple-500/10"
        >
          <Sparkles className="w-4 h-4 text-purple-400 animate-spin-slow" />
          <span>YC Startup Grade &bull; AI Financial Engine &bull; All Currencies Worldwide</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]"
        >
          Master Your Finances with <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-300">
            Autonomous AI Intelligence
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-slate-300 text-base md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
        >
          Log expenses in seconds, scan paper bills with AI OCR, set monthly category targets, and receive automated cashflow reports in <strong>USD ($), CAD (CA$), NPR (Rs), EUR (€), GBP (£), INR (₹)</strong> and more.
        </motion.p>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-14"
        >
          <Button
            size="lg"
            variant="primary"
            onClick={onLaunchDashboard}
            icon={ArrowRight}
          >
            Launch Live Dashboard
          </Button>

          <Button
            size="lg"
            variant="secondary"
            onClick={onSeedDemoData}
            icon={Zap}
          >
            Explore Demo Data
          </Button>
        </motion.div>

        {/* Supported Currency Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-2 text-xs"
        >
          <span className="text-slate-400 font-medium mr-2">Supported Currencies:</span>
          {CURRENCIES.map(c => (
            <Badge key={c.code} variant="purple" size="sm">
              {c.name}
            </Badge>
          ))}
        </motion.div>
      </section>

      {/* FEATURE GRID SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16 space-y-3">
          <Badge variant="indigo" size="md">ENGINEERING EXCELLENCE</Badge>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white">
            Built for Global Personal Finance & AI Insights
          </h2>
          <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto">
            Everything you need to track spending, manage monthly budget caps, and receive automated savings tips.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <Card interactive glow padding="p-8" className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">AI Receipt & Bill OCR</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Snap photo receipts to instantly extract merchant title, price, date, and category into your transaction log.
            </p>
          </Card>

          <Card interactive glow padding="p-8" className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">All Currencies Worldwide</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Seamlessly track in NPR, CAD, USD, EUR, GBP, INR, AUD and switch global currency symbols instantly.
            </p>
          </Card>

          <Card interactive glow padding="p-8" className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Budgets & Overspend Alerts</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Set monthly category target caps with progress bars and automated threshold warnings.
            </p>
          </Card>

          <Card interactive glow padding="p-8" className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <PieChart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Income vs Expense Cashflow</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Track both inflows (salary, business) and outflows to calculate net savings rate %.
            </p>
          </Card>

          <Card interactive glow padding="p-8" className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">AI Financial Health Score</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Generates a 0–100 spending score, detects outlay anomalies, and highlights estimated monthly savings.
            </p>
          </Card>

          <Card interactive glow padding="p-8" className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">CSV Statement Importer</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Upload bank exports in CSV format to bulk import hundreds of transactions into your workspace.
            </p>
          </Card>

        </div>
      </section>

      {/* HOW IT WORKS PIPELINE */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-slate-800/60">
        <div className="text-center mb-16 space-y-3">
          <Badge variant="emerald" size="md">SIMPLE THREE STEP PIPELINE</Badge>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white">How Smart Expense AI Works</h2>
          <p className="text-slate-400 text-sm md:text-base max-w-lg mx-auto">From paper receipt or bank export to real-time cashflow analytics in seconds.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-purple-600/20 border border-purple-500/40 text-purple-300 flex items-center justify-center font-bold text-2xl mx-auto">
              1
            </div>
            <h3 className="text-xl font-bold text-white">Log or Scan Transactions</h3>
            <p className="text-sm text-slate-400 leading-relaxed">Add income & expenses manually, import bank CSVs, or snap receipt photos for AI Vision OCR.</p>
          </div>

          <div className="space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 flex items-center justify-center font-bold text-2xl mx-auto">
              2
            </div>
            <h3 className="text-xl font-bold text-white">AI Pattern Categorization</h3>
            <p className="text-sm text-slate-400 leading-relaxed">Gemini 2.5 & Llama-3 AI automatically tag categories, detect spending spikes, and compare budgets.</p>
          </div>

          <div className="space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center font-bold text-2xl mx-auto">
              3
            </div>
            <h3 className="text-xl font-bold text-white">Track Cash Flow & Net Savings</h3>
            <p className="text-sm text-slate-400 leading-relaxed">Monitor net cash flow, savings rate %, and category budget overspend alerts across all global currencies.</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-800/60">
        <div className="text-center mb-16 space-y-3">
          <Badge variant="purple" size="md">COMMUNITY TRUST</Badge>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white">Loved by Engineers & Founders Worldwide</h2>
          <p className="text-slate-400 text-sm md:text-base max-w-lg mx-auto">Here is what developers and product leaders say about Smart Expense AI.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <Card key={idx} padding="p-8" className="space-y-4">
              <div className="flex gap-1 text-amber-400">
                {[...Array(t.stars)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-300 leading-relaxed italic">"{t.text}"</p>
              <div>
                <h4 className="font-bold text-white text-sm">{t.name}</h4>
                <p className="text-xs text-slate-400">{t.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-slate-800/60">
        <div className="text-center mb-16 space-y-3">
          <Badge variant="cyan" size="md">TRANSPARENT PRICING</Badge>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white">Simple, Honest Pricing</h2>
          <p className="text-slate-400 text-sm md:text-base max-w-lg mx-auto">100% free to use. Optional Supporter Tier for power users.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {pricingPlans.map((plan, idx) => (
            <Card 
              key={idx} 
              glow={plan.isPopular} 
              padding="p-8" 
              className={`space-y-6 ${plan.isPopular ? 'border-purple-500/60 shadow-2xl shadow-purple-500/20' : ''}`}
            >
              {plan.isPopular && (
                <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                <span className="text-xs text-slate-400">{plan.period}</span>
              </div>

              <ul className="space-y-3 text-xs text-slate-300">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.isPopular ? 'primary' : 'secondary'}
                size="lg"
                className="w-full"
                onClick={plan.onCtaClick}
              >
                {plan.ctaText}
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-6 py-20 border-t border-slate-800/60">
        <div className="text-center mb-12 space-y-3">
          <Badge variant="amber" size="md">GOT QUESTIONS?</Badge>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-400">Everything you need to know about Smart Expense AI</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <Card key={idx} padding="p-5" className="cursor-pointer" onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
              <div className="flex items-center justify-between font-bold text-white text-sm">
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-purple-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </div>
              {openFaq === idx && (
                <div className="mt-3 text-xs text-slate-400 leading-relaxed pt-3 border-t border-slate-800/80">
                  {faq.a}
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
              <Sparkles size={14} />
            </div>
            <span className="font-bold text-slate-200 text-sm">Smart Expense AI</span>
          </div>

          <p>© 2026 Smart Expense AI &bull; Autonomous Personal Finance & AI Insights Engine</p>

          <div className="flex gap-4">
            <button onClick={onLaunchDashboard} className="hover:text-purple-400">Dashboard</button>
            <button onClick={onSeedDemoData} className="hover:text-purple-400">Demo Data</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
