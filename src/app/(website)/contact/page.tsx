'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, ShieldAlert, Send, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'GENERAL', message: '' });
  const [ticketId, setTicketId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    const generatedTicket = `APX-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketId(generatedTicket);
    setSubmitted(true);
    toast.success('Your message has been received! Our support team will reply within 2 hours.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400">
            <Phone className="h-3.5 w-3.5" />
            <span>24/7 Client Concierge</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            We Are Here To Assist You <br />
            <span className="text-blue-400">Day & Night</span>
          </h1>
          <p className="text-slate-400 text-base leading-relaxed">
            Have a question about your account, international wire, or security? Reach out to our dedicated support team.
          </p>
        </div>

        {/* Emergency Card Freeze Banner */}
        <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center shrink-0">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Lost or Stolen Card / Emergency Fraud Hotline</h4>
              <p className="text-xs text-slate-400">Report unauthorized activity immediately or freeze your card in the online mobile portal.</p>
            </div>
          </div>
          <a
            href="tel:18005552739"
            className="rounded-xl px-5 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-500 transition-colors shrink-0"
          >
            Call Fraud Hotline: 1-800-555-2739
          </a>
        </div>

        {/* Contact Form + Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Phone className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-white">Telephone Support</h4>
              <p className="text-xs text-slate-400">Toll-Free US: 1-800-555-APEX (2739)</p>
              <p className="text-xs text-slate-400">International: +1 (212) 555-0199</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Mail className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-white">Email Enquiries</h4>
              <p className="text-xs text-slate-400">Client Support: support@apexbank.com</p>
              <p className="text-xs text-slate-400">Business Services: commercial@apexbank.com</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <MapPin className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-white">Global Headquarters</h4>
              <p className="text-xs text-slate-400">ApexBank Tower, 100 Financial Plaza</p>
              <p className="text-xs text-slate-400">Wall Street, New York, NY 10005</p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-8 sm:p-10 space-y-6">
              <h3 className="text-2xl font-bold text-white">Send Us a Direct Message</h3>

              {submitted ? (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-8 text-center space-y-3">
                  <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto" />
                  <h4 className="text-lg font-bold text-white">Message Delivered</h4>
                  <p className="text-xs text-slate-400">Thank you, {formData.name}. Ticket #{ticketId} has been created.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 rounded-xl px-5 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="GENERAL">General Account Inquiry</option>
                      <option value="WIRE">Wire Transfer Assistance</option>
                      <option value="CARD">Card Services & Disputes</option>
                      <option value="LOAN">Loans & Mortgages</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Your Message *</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe your inquiry..."
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg"
                  >
                    <Send className="h-4 w-4" />
                    Submit Support Ticket
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
