'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Send, Loader2, CheckCircle } from 'lucide-react'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Something went wrong')

      setStatus('success')
      setMessage('Thanks for subscribing!')
      setEmail('')
    } catch (error) {
      setStatus('error')
      setMessage('Failed to subscribe. Please try again.')
    }
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-600 to-accent-purple p-8 md:p-16"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-6">
              <Mail className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Join 2,500+ Knowledge Seekers
            </h2>
            
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Get weekly insights, exclusive content, and the latest articles delivered straight to your inbox. 
              No spam, unsubscribe anytime.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-xl bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 font-medium disabled:opacity-50"
                required
                disabled={status === 'loading' || status === 'success'}
              />
              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="px-8 py-4 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors inline-flex items-center justify-center whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : status === 'success' ? (
                  <>
                    Subscribed <CheckCircle className="w-5 h-5 ml-2" />
                  </>
                ) : (
                  <>
                    Subscribe <Send className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </form>
            {message && (
              <p className={`mt-4 text-sm font-medium ${status === 'error' ? 'text-red-200' : 'text-green-200'}`}>
                {message}
              </p>
            )}

            <p className="text-sm text-white/70 mt-4">
              By subscribing, you agree to our Privacy Policy and consent to receive updates.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
