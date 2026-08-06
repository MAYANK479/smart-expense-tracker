import React, { useState } from 'react';
import { 
  Sparkles, ArrowRight, ShieldCheck, Camera, Globe, Zap, Target, PieChart, ChevronDown, CheckCircle2 
} from 'lucide-react';
import { CURRENCIES } from '../utils/currencies';

export default function LandingPage({ onLaunchDashboard, onSeedDemoData }) {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'What is Smart Expense AI?',
      a: 'Smart Expense AI is a free-to-use AI-powered expense and income tracker that works worldwide. It supports all major currencies (NPR, CAD, USD, EUR, GBP, INR and 150+ more), AI categorization, receipt bill scanning, budget alerts, and cashflow analytics.'
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
    <div className="min-h-screen text-slate-100 font-sans pb-16">
      {/* HERO SECTION */}
      <section className="relative pt-20 pb-16 px-6 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-6 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>AI Powered Expense & Cashflow Tracker &bull; All Currencies Worldwide</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Master Your Financial Health with <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-300 to-emerald-400">
            AI Precision & Vision Intelligence
          </span>
        </h1>

        <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
          Log transactions, scan paper bills with AI OCR, set category target limits, and receive automated financial health reports in <strong>USD ($), CAD (CA$), NPR (Rs), EUR (€), GBP (£), INR (₹)</strong> and more.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <button
            onClick={onLaunchDashboard}
            className="glow-btn text-sm py-3 px-6 flex items-center gap-2 shadow-lg shadow-purple-500/30"
          >
            <span>Launch Live Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onSeedDemoData}
            className="glow-btn glow-btn-secondary text-sm py-3 px-6 flex items-center gap-2"
          >
            <Zap className="w-4 h-4 text-purple-400" />
            <span>Explore Demo Data</span>
          </button>
        </div>

        {/* Currency Badges Highlights */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-400 font-medium mr-2">Supported Currencies:</span>
          {CURRENCIES.map(c => (
            <span key={c.code} className="bg-purple-950/40 border border-purple-500/20 px-2.5 py-1 rounded-lg text-purple-300 font-semibold">
              {c.name}
            </span>
          ))}
        </div>
      </section>

      {/* FEATURE GRID SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Built for Global Personal Finance & AI Insights
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto">
            Everything you need to track spending, manage monthly budget caps, and receive automated savings tips.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">AI Receipt & Bill OCR</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Snap photo receipts to instantly extract merchant title, price, date, and category into your log.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">All Currencies Worldwide</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Seamlessly track in NPR, CAD, USD, EUR, GBP, INR, AUD and switch global currency symbols instantly.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Budgets & Overspend Alerts</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Set monthly category target caps with progress bars and automated threshold warnings.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <PieChart className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Income vs Expense Cashflow</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Track both inflows (salary, business) and outflows to calculate net savings rate %.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">AI Financial Health Score</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generates a 0–100 spending score, detects outlay anomalies, and highlights estimated monthly savings.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">CSV Bank Statement Import</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload bank exports in CSV format to bulk import all transactions into your workspace.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-white mb-2">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-400">Everything you need to know about Smart Expense AI</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-card rounded-xl overflow-hidden border border-purple-500/20">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left font-semibold text-slate-200 text-sm flex items-center justify-between hover:text-purple-300 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-purple-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
