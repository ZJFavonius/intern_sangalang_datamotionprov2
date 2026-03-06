'use client'

import Link from 'next/link'
import { Database, Zap, Shield, Users, ArrowRight, CheckCircle, BarChart3, FileSpreadsheet, Star, Globe, Lock } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg">
                <Database className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                DataMotionPro
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8 mr-8">
              <a href="#features" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">Features</a>
              <a href="#testimonials" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">Testimonials</a>
              <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">Pricing</a>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/auth/signin"
                className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
            <Zap className="h-4 w-4" />
            <span>The Future of Data Management is Here</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Manage Data with
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Unrivaled Efficiency
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            DataMotionPro combines the power of a database with the simplicity of a spreadsheet. 
            Import, organize, and automate your workflows in seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/auth/signup"
              className="group bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              Start Free Trial
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition" />
            </Link>
            <Link
              href="/auth/signin"
              className="bg-white border border-gray-200 text-gray-900 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition shadow-sm"
            >
              View Demo
            </Link>
          </div>

          {/* Hero Image / Mockup */}
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25"></div>
            <div className="relative bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden aspect-video flex items-center justify-center bg-slate-50">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-90"></div>
              <div className="relative z-10 bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-white shadow-xl max-w-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <Database className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-bold text-gray-900">DataMotion Dashboard</span>
                </div>
                <div className="space-y-3">
                  <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-blue-500"></div>
                  </div>
                  <div className="h-4 w-5/6 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-indigo-500"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="h-16 bg-blue-50 rounded-xl border border-blue-100"></div>
                    <div className="h-16 bg-indigo-50 rounded-xl border border-indigo-100"></div>
                    <div className="h-16 bg-purple-50 rounded-xl border border-purple-100"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Scale
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We've built the tools so you can focus on what matters: your data.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Smart Workspaces', desc: 'Customizable environments for every project and team.', icon: Globe, color: 'text-blue-600', bg: 'bg-blue-50' },
              { title: 'Real-time Sync', desc: 'Collaborate instantly with live updates and cell-level locking.', icon: Zap, color: 'text-yellow-600', bg: 'bg-yellow-50' },
              { title: 'Ironclad Security', desc: 'Enterprise-grade encryption and granular permission controls.', icon: Lock, color: 'text-purple-600', bg: 'bg-purple-50' },
              { title: 'Deep Insights', desc: 'Powerful filtering and reporting tools for better decisions.', icon: BarChart3, color: 'text-green-600', bg: 'bg-green-50' },
            ].map((f, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300">
                <div className={`${f.bg} ${f.color} w-12 h-12 rounded-xl flex items-center justify-center mb-6`}>
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Trusted by Data Teams</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Chen', role: 'Data Analyst at TechFlow', text: 'The best data tool I have used in years. It just works.' },
              { name: 'James Miller', role: 'Product Manager', text: 'DataMotionPro saved us hours of manual entry every single week.' },
              { name: 'Elena Rodriguez', role: 'CTO at CloudScale', text: 'The permissions system is exactly what our enterprise clients needed.' },
            ].map((t, i) => (
              <div key={i} className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-gray-700 italic mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={`https://ui-avatars.com/api/?name=${t.name}&background=random`} alt={t.name} className="h-10 w-10 rounded-full" />
                  <div>
                    <h4 className="font-bold text-gray-900">{t.name}</h4>
                    <p className="text-sm text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Simple, Transparent Pricing</h2>
          </div>
          <div className="grid md:grid-cols-2 max-w-4xl mx-auto gap-8">
            <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-bold mb-2">Free</h3>
              <div className="text-4xl font-extrabold mb-6">$0<span className="text-lg font-normal text-gray-500">/mo</span></div>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-2 text-gray-600"><CheckCircle className="h-5 w-5 text-green-500" /> 1 Workspace</li>
                <li className="flex items-center gap-2 text-gray-600"><CheckCircle className="h-5 w-5 text-green-500" /> 1,000 Rows</li>
                <li className="flex items-center gap-2 text-gray-600"><CheckCircle className="h-5 w-5 text-green-500" /> Community Support</li>
              </ul>
              <Link href="/auth/signup" className="block text-center w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-xl transition">Start for Free</Link>
            </div>
            <div className="bg-white p-10 rounded-3xl border-2 border-blue-600 shadow-xl relative">
              <div className="absolute top-0 right-10 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">MOST POPULAR</div>
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <div className="text-4xl font-extrabold mb-6">$19<span className="text-lg font-normal text-gray-500">/mo</span></div>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-2 text-gray-600"><CheckCircle className="h-5 w-5 text-blue-500" /> Unlimited Workspaces</li>
                <li className="flex items-center gap-2 text-gray-600"><CheckCircle className="h-5 w-5 text-blue-500" /> 100,000 Rows</li>
                <li className="flex items-center gap-2 text-gray-600"><CheckCircle className="h-5 w-5 text-blue-500" /> Priority Support</li>
                <li className="flex items-center gap-2 text-gray-600"><CheckCircle className="h-5 w-5 text-blue-500" /> Advanced Permissions</li>
              </ul>
              <Link href="/auth/signup" className="block text-center w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition">Go Pro</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
            <div className="max-w-xs">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Database className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">DataMotionPro</span>
              </div>
              <p className="text-sm leading-relaxed">The modern data layer for your next big thing. Scale faster, build better.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
              <div>
                <h4 className="text-white font-bold mb-4">Product</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition">Features</a></li>
                  <li><a href="#" className="hover:text-white transition">Integrations</a></li>
                  <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition">About</a></li>
                  <li><a href="#" className="hover:text-white transition">Careers</a></li>
                  <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center text-sm">
            &copy; 2024 DataMotionPro. Built with passion for data teams.
          </div>
        </div>
      </footer>
    </div>
  )
}
