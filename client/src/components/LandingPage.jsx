import React, { useState } from 'react';
import { 
  Sparkles, ArrowRight, Heart, Upload, Sparkle, BarChart3, ChevronDown, CheckCircle2, MessageSquare 
} from 'lucide-react';

export default function LandingPage({ onLaunchDashboard, onSeedDemoData }) {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'What is Smart Expense Tracker AI?',
      a: 'Smart Expense Tracker AI is a free-to-use AI-powered expense and income tracker that works worldwide. It supports all major currencies (USD, CAD, GBP, AUD, EUR, INR, NPR and 150+ more), AI categorization, receipt bill scanning, budget alerts, and cashflow analytics.'
    },
    {
      q: 'Is Smart Expense Tracker really free to use?',
      a: 'Yes! Smart Expense Tracker AI is free to use with no credit card required. All core features including multi-currency tracking, AI pattern insights, and budget alerts are completely included.'
    },
    {
      q: 'Can I track expenses in my local currency?',
      a: 'Yes. Smart Expense Tracker AI supports all currencies worldwide including USD, CAD, GBP, AUD, EUR, INR, NPR, and 150+ more.'
    },
    {
      q: 'How does the AI Receipt & Bill OCR Scanner work?',
      a: 'Simply upload or snap a photo of any printed paper receipt or bill. Our Gemini & Vision AI engine automatically extracts the merchant name, date, category, and total outlay into your transaction log.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f7f4fb] text-[#1e1b4b] font-sans">
      
      {/* HERO SECTION */}
      <section className="pt-12 pb-16 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column Text */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-block">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#7e22ce]">
              EXPENSE MANAGEMENT
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0f172a] leading-tight">
            AI-powered expense tracking made easy
          </h1>

          <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-xl">
            Add expenses in seconds, upload a receipt or snap a photo.{' '}
            <strong>Track & analyze your spending</strong> with clear analytics. Free to use, all currencies.
          </p>

          {/* CTA Buttons matching screenshot */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onLaunchDashboard}
              className="bg-[#7e22ce] hover:bg-[#6b21a8] text-white font-semibold text-sm py-3.5 px-6 rounded-2xl flex items-center gap-2 transition-all shadow-md shadow-purple-200"
            >
              <span>Get started free</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onSeedDemoData}
              className="bg-white hover:bg-purple-50/60 text-[#7e22ce] border border-amber-300 font-semibold text-sm py-3.5 px-6 rounded-2xl flex items-center gap-2 transition-all"
            >
              <Heart className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Support this project</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 pt-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>USD, CAD, GBP, AUD & 150+ currencies &bull; Free to use</span>
          </div>
        </div>

        {/* Right Column App Preview Mockup Card */}
        <div className="lg:col-span-6">
          <div className="bg-white rounded-3xl p-4 shadow-xl shadow-purple-900/5 border border-purple-100">
            {/* Browser Header Bar */}
            <div className="bg-slate-100 rounded-t-2xl p-2.5 flex items-center gap-2 border-b border-slate-200 mb-4">
              <div className="flex gap-1.5 pl-1">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
              </div>
              <div className="bg-white text-[11px] text-slate-500 rounded-lg px-3 py-1 flex-1 text-center font-mono border border-slate-200">
                smartexpenseai.com/dashboard
              </div>
            </div>

            {/* Mock Dashboard App UI */}
            <div className="space-y-4 p-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Dashboard</h3>
                  <p className="text-[11px] text-slate-500">Scan a bill - categorized automatically</p>
                </div>
                <div className="flex gap-2 text-xs">
                  <button onClick={onLaunchDashboard} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2.5 py-1.5 rounded-lg text-[11px]">
                    📊 Bulk Upload
                  </button>
                  <button onClick={onLaunchDashboard} className="bg-[#7e22ce] text-white font-medium px-3 py-1.5 rounded-lg text-[11px] flex items-center gap-1 shadow-sm">
                    📷 Scan Bill
                  </button>
                </div>
              </div>

              {/* Transactions list mockup */}
              <div className="bg-slate-50 p-3 rounded-xl space-y-2 border border-slate-100">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-800">Tomato</span>
                    <p className="text-[10px] text-rose-500 font-medium bg-rose-50 px-1.5 py-0.5 rounded inline-block mt-0.5">Groceries - Today</p>
                  </div>
                  <span className="font-bold text-rose-600">-$4.99</span>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-800">Uber</span>
                    <p className="text-[10px] text-rose-500 font-medium bg-rose-50 px-1.5 py-0.5 rounded inline-block mt-0.5">Transport - Today</p>
                  </div>
                  <span className="font-bold text-rose-600">-$12.50</span>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-800">Food</span>
                  </div>
                  <span className="font-bold text-emerald-600">-$18.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRACK YOUR EXPENSES SECTION */}
      <section className="py-16 px-6 max-w-5xl mx-auto text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
          Track your expenses
        </h2>
        <p className="text-slate-600 text-sm md:text-base max-w-lg mx-auto">
          Track expenses in any currency worldwide: USD, CAD, GBP, AUD and 150+ more. Free to use.
        </p>

        {/* AI FINANCE ASSISTANT MOCK CARD (Matching Screenshot 2) */}
        <div className="bg-[#f0e8ff] border border-purple-200 rounded-3xl p-6 text-left max-w-3xl mx-auto shadow-sm mt-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#7e22ce] text-white flex items-center justify-center font-bold text-sm">
              ✨
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">AI Finance Assistant</h3>
              <span className="text-[10px] font-bold text-purple-700 uppercase bg-purple-200 px-2 py-0.5 rounded-full">
                NEW - AI-POWERED
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Chat with your finances in plain English &mdash; no spreadsheets, no formulas. Just ask and get instant answers backed by your real transaction data.
          </p>

          <div className="flex flex-wrap gap-2 text-[11px]">
            <button onClick={onLaunchDashboard} className="bg-white hover:bg-purple-100 text-slate-700 px-3 py-1.5 rounded-xl border border-purple-200 font-medium">
              💸 How much did I spend this month?
            </button>
            <button onClick={onLaunchDashboard} className="bg-white hover:bg-purple-100 text-slate-700 px-3 py-1.5 rounded-xl border border-purple-200 font-medium">
              📊 Compare my last 3 months
            </button>
            <button onClick={onLaunchDashboard} className="bg-white hover:bg-purple-100 text-slate-700 px-3 py-1.5 rounded-xl border border-purple-200 font-medium">
              🍕 What did I spend on food?
            </button>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-purple-200 text-xs flex items-center gap-3">
            <div className="bg-[#7e22ce] text-white p-2 rounded-xl text-xs font-bold shrink-0">AI</div>
            <p className="text-slate-700 text-xs">
              <strong>Dining Out is your top overspend</strong> &mdash; $312 this month vs. your $200 average. You are also up 23% on Shopping vs last month.
            </p>
          </div>
        </div>

        {/* STACKED FEATURE CARDS (Matching Screenshot 3) */}
        <div className="max-w-3xl mx-auto space-y-4 pt-8 text-left">
          
          <div className="bg-white p-6 rounded-2xl border-l-4 border-l-purple-600 border border-slate-200 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
              🔮
            </div>
            <h3 className="font-bold text-slate-900 text-base">Automatic Categorization</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              AI suggests a category for each transaction so you spend less time tagging. Add an expense and get a sensible category right away.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border-l-4 border-l-emerald-500 border border-slate-200 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
              📷
            </div>
            <h3 className="font-bold text-slate-900 text-base">Upload PDF or Snap a Photo</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Add expenses in seconds: upload a bill PDF or photograph a receipt. AI reads amount, date, and merchant so you type less.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border-l-4 border-l-indigo-600 border border-slate-200 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
              📤
            </div>
            <h3 className="font-bold text-slate-900 text-base">Bulk Transaction Upload</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Import hundreds of rows at once from bank exports or CSV. We process and categorize them in a single step.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border-l-4 border-l-amber-500 border border-slate-200 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
              📊
            </div>
            <h3 className="font-bold text-slate-900 text-base">Smart Analytics</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              See spending patterns, income vs. expenses, and trends with clear charts and breakdowns.
            </p>
          </div>

        </div>
      </section>

      {/* DARK PURPLE ANALYZE YOUR EXPENSES SECTION (Matching Screenshot 4) */}
      <section className="bg-[#4c1d95] text-white py-20 px-6 mt-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Analyze your expenses
            </h2>
            <p className="text-purple-200 text-sm md:text-base leading-relaxed">
              See spending by category, income vs expenses, and trends over time. Clear charts and breakdowns so you stay in control.
            </p>
            <button
              onClick={onLaunchDashboard}
              className="bg-white text-purple-950 font-bold text-sm py-3.5 px-6 rounded-2xl hover:bg-purple-50 transition-all shadow-lg"
            >
              Get started free &rarr;
            </button>
          </div>

          {/* Right Column Dark Analytics Card Mockup */}
          <div className="lg:col-span-7 bg-[#3b0764] p-6 rounded-3xl border border-purple-500/30 shadow-2xl space-y-6">
            <div className="flex items-center gap-2 text-xs text-purple-300 font-bold uppercase tracking-wider">
              <BarChart3 className="w-4 h-4" />
              <span>Analytics Overview</span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-emerald-950/60 border border-emerald-500/40 p-3 rounded-2xl">
                <span className="text-[10px] text-emerald-300 font-bold uppercase">INCOME</span>
                <p className="text-lg font-black text-emerald-400 mt-1">$4.2k</p>
              </div>

              <div className="bg-rose-950/60 border border-rose-500/40 p-3 rounded-2xl">
                <span className="text-[10px] text-rose-300 font-bold uppercase">EXPENSES</span>
                <p className="text-lg font-black text-rose-400 mt-1">$2.8k</p>
              </div>

              <div className="bg-purple-900/60 border border-purple-500/40 p-3 rounded-2xl">
                <span className="text-[10px] text-purple-300 font-bold uppercase">INVEST</span>
                <p className="text-lg font-black text-purple-300 mt-1">$0.5k</p>
              </div>
            </div>

            {/* Sparkline curve mockup */}
            <div className="bg-purple-950/80 p-4 rounded-2xl border border-purple-500/20">
              <div className="flex justify-between text-[11px] text-purple-300 mb-4 font-semibold">
                <span>Monthly Cash Flow Trend</span>
                <span>Sep - Jan</span>
              </div>
              <div className="h-24 w-full flex items-end justify-between gap-2 px-2">
                <div className="w-full bg-purple-500/30 h-1/2 rounded-t"></div>
                <div className="w-full bg-purple-500/50 h-3/4 rounded-t"></div>
                <div className="w-full bg-purple-500/40 h-2/3 rounded-t"></div>
                <div className="w-full bg-purple-400 h-full rounded-t"></div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* BLOG / GUIDE SECTION (Matching Screenshot 5) */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#7e22ce]">
            📖 Blog & Financial Guides
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">Latest from the blog</h2>
          <p className="text-xs text-slate-500">Tips, guides, and updates for smarter spending.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-purple-100 p-6 text-purple-700 font-bold text-sm h-32 flex items-center justify-center">
              Track Every Dollar Better
            </div>
            <div className="p-5 space-y-2">
              <span className="text-[11px] text-slate-400">January 15, 2024</span>
              <h3 className="font-bold text-slate-900 text-sm">Getting Started with Expense Tracking</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                A practical starter guide to tracking daily expenses, spotting waste, and building a routine you can stick with.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-indigo-900 p-6 text-white font-bold text-sm h-32 flex items-center justify-center">
              Start Investing With Confidence
            </div>
            <div className="p-5 space-y-2">
              <span className="text-[11px] text-slate-400">January 10, 2024</span>
              <h3 className="font-bold text-slate-900 text-sm">Investment Strategies for Beginners</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                A beginner-friendly overview of how to start investing steadily, avoid common mistakes, and build confidence with simple rules.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-amber-100 p-6 text-amber-800 font-bold text-sm h-32 flex items-center justify-center">
              Build A Budget That Lasts
            </div>
            <div className="p-5 space-y-2">
              <span className="text-[11px] text-slate-400">January 5, 2024</span>
              <h3 className="font-bold text-slate-900 text-sm">Monthly Budget Planning Guide</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Learn how to build a monthly budget that reflects your real income, fixed bills, irregular spending, and savings goals.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* FAQ ACCORDION SECTION */}
      <section className="py-12 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-500">Everything you need to know about Smart Expense Tracker AI</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left font-bold text-slate-900 text-sm flex items-center justify-between hover:text-purple-700 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-purple-600 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
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
