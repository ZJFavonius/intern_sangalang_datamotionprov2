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

          {/* Hero Image / Mockup - Workspace with Data Table */}
          <div className="relative max-w-6xl mx-auto">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-2xl opacity-20"></div>
            <div className="relative bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
              {/* Browser Chrome */}
              <div className="bg-gray-800 px-4 py-3 border-b border-gray-700 flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-700 rounded-lg px-3 py-1.5 text-gray-400 text-xs text-center">
                    app.datamotionpro.com/workspaces/project-alpha
                  </div>
                </div>
                <span className="text-gray-400 text-xs font-medium">DataMotionPro</span>
              </div>
              
              {/* Content */}
              <div className="bg-white p-6">
                <div className="grid grid-cols-4 gap-6">
                  {/* Left Sidebar */}
                  <div className="col-span-1 border-r border-gray-200 pr-4">
                    <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Database className="h-4 w-4 text-blue-600" />
                      DataMotionPro
                    </h3>
                    <div className="space-y-3">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">My Workspaces</div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg cursor-pointer">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs font-medium text-gray-900">Project Alpha</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-100">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-xs font-medium text-gray-600">Sales Pipeline</span>
                        </div>
                      </div>
                    </div>
                    <button className="w-full mt-4 py-2 px-3 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-1">
                      <span>+</span> New Workspace
                    </button>
                  </div>
                  
                  {/* Main Content - Data Table */}
                  <div className="col-span-3">
                    <div className="mb-4">
                      <h2 className="text-lg font-bold text-gray-900 mb-1">Customer Data</h2>
                      <p className="text-xs text-gray-500">346 rows • 5 columns</p>
                    </div>
                    
                    {/* Table */}
                    <div className="overflow-x-auto border border-gray-200 rounded-lg">
                      <table className="w-full text-xs">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-3 py-2 text-left font-bold text-gray-900">NAME</th>
                            <th className="px-3 py-2 text-left font-bold text-gray-900">EMAIL</th>
                            <th className="px-3 py-2 text-left font-bold text-gray-900">STATUS</th>
                            <th className="px-3 py-2 text-left font-bold text-gray-900">PLAN</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          <tr className="hover:bg-gray-50">
                            <td className="px-3 py-2 text-gray-900 font-medium">Sarah Johnson</td>
                            <td className="px-3 py-2 text-gray-600">sarah@company.com</td>
                            <td className="px-3 py-2"><span className="px-2 py-1 bg-green-100 text-green-700 font-medium rounded">Active</span></td>
                            <td className="px-3 py-2 text-gray-900">Pro</td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="px-3 py-2 text-gray-900 font-medium">Michael Chen</td>
                            <td className="px-3 py-2 text-gray-600">michael@startup.co</td>
                            <td className="px-3 py-2"><span className="px-2 py-1 bg-yellow-100 text-yellow-700 font-medium rounded">Pending</span></td>
                            <td className="px-3 py-2 text-gray-900">Starter</td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="px-3 py-2 text-gray-900 font-medium">Emily Rodriguez</td>
                            <td className="px-3 py-2 text-gray-600">emily@enterprise.com</td>
                            <td className="px-3 py-2"><span className="px-2 py-1 bg-green-100 text-green-700 font-medium rounded">Active</span></td>
                            <td className="px-3 py-2 text-gray-900">Enterprise</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Features Bar */}
                    <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2 text-xs">
                      <div className="px-2 py-1 bg-blue-50 text-blue-700 font-medium rounded flex items-center gap-1">
                        ⚡ Real-time Collaboration
                      </div>
                      <div className="px-2 py-1 bg-blue-50 text-blue-700 font-medium rounded flex items-center gap-1">
                        ✏️ Editable Cells
                      </div>
                      <div className="px-2 py-1 bg-blue-50 text-blue-700 font-medium rounded flex items-center gap-1">
                        📊 CSV Import/Export
                      </div>
                    </div>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-600">Choose the perfect plan for your team. All plans include a 14-day free trial.</p>
          </div>
          <div className="grid md:grid-cols-3 max-w-6xl mx-auto gap-8">
            {/* Starter Plan */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition">
              <h3 className="text-lg font-bold mb-2 text-gray-900">Starter</h3>
              <div className="text-3xl font-extrabold mb-6">$0<span className="text-sm font-normal text-gray-500">/mo</span></div>
              <p className="text-sm text-gray-600 mb-6">Perfect for getting started</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-gray-600 text-sm"><CheckCircle className="h-4 w-4 text-green-500" />1 Workspace</li>
                <li className="flex items-center gap-2 text-gray-600 text-sm"><CheckCircle className="h-4 w-4 text-green-500" />1,000 Rows/mo</li>
                <li className="flex items-center gap-2 text-gray-600 text-sm"><CheckCircle className="h-4 w-4 text-green-500" />Community Support</li>
                <li className="flex items-center gap-2 text-gray-600 text-sm"><CheckCircle className="h-4 w-4 text-green-500" />Basic CSV Import</li>
              </ul>
              <Link href="/auth/signup" className="block text-center w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-lg transition text-sm">Start Free</Link>
            </div>

            {/* Pro Plan - Featured */}
            <div className="bg-white p-8 rounded-2xl border-2 border-blue-600 shadow-xl relative transform md:scale-105">
              <div className="absolute top-0 right-6 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold">POPULAR</div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">Pro</h3>
              <div className="text-3xl font-extrabold mb-6">$29<span className="text-sm font-normal text-gray-500">/mo</span></div>
              <p className="text-sm text-gray-600 mb-6">Best for growing teams</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-gray-600 text-sm"><CheckCircle className="h-4 w-4 text-blue-500" />Unlimited Workspaces</li>
                <li className="flex items-center gap-2 text-gray-600 text-sm"><CheckCircle className="h-4 w-4 text-blue-500" />100,000 Rows/mo</li>
                <li className="flex items-center gap-2 text-gray-600 text-sm"><CheckCircle className="h-4 w-4 text-blue-500" />Priority Email Support</li>
                <li className="flex items-center gap-2 text-gray-600 text-sm"><CheckCircle className="h-4 w-4 text-blue-500" />Advanced Permissions</li>
                <li className="flex items-center gap-2 text-gray-600 text-sm"><CheckCircle className="h-4 w-4 text-blue-500" />CSV Import/Export</li>
              </ul>
              <Link href="/auth/signup" className="block text-center w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition text-sm">Go Pro</Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition">
              <h3 className="text-lg font-bold mb-2 text-gray-900">Enterprise</h3>
              <div className="text-3xl font-extrabold mb-6">Custom<span className="text-sm font-normal text-gray-500"></span></div>
              <p className="text-sm text-gray-600 mb-6">For large-scale operations</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-gray-600 text-sm"><CheckCircle className="h-4 w-4 text-purple-500" />Everything in Pro</li>
                <li className="flex items-center gap-2 text-gray-600 text-sm"><CheckCircle className="h-4 w-4 text-purple-500" />Unlimited Rows/mo</li>
                <li className="flex items-center gap-2 text-gray-600 text-sm"><CheckCircle className="h-4 w-4 text-purple-500" />24/7 Phone & Chat</li>
                <li className="flex items-center gap-2 text-gray-600 text-sm"><CheckCircle className="h-4 w-4 text-purple-500" />Custom Integrations</li>
                <li className="flex items-center gap-2 text-gray-600 text-sm"><CheckCircle className="h-4 w-4 text-purple-500" />SSO & Advanced Security</li>
              </ul>
              <Link href="/auth/signup" className="block text-center w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition text-sm">Contact Sales</Link>
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
