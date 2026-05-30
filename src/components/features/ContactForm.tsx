'use client'

import { useState } from 'react'
import { Send, CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Film Scoring',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.')
      }

      setStatus('success')
      setFormData({
        name: '',
        email: '',
        projectType: 'Film Scoring',
        message: '',
      })
    } catch (err: any) {
      console.error(err)
      setStatus('error')
      setErrorMessage(err.message || 'Server connection failed.')
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto p-8 rounded-2xl glass-panel relative overflow-hidden">
      {status === 'success' ? (
        <div className="text-center py-10 space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal/10 text-teal border border-teal/20 mb-2">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-white">Message Sent!</h3>
          <p className="text-neutral-400 text-sm max-w-sm mx-auto">
            Thank you for reaching out. Srikant or a team member will get back to you shortly.
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="mt-6 px-6 py-2.5 bg-neutral-900 border border-neutral-800 text-neutral-300 text-sm font-semibold rounded-lg hover:border-gold hover:text-gold transition-all duration-300 cursor-pointer"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider font-semibold text-neutral-400">
              Your Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. A.R. Rahman"
              className="w-full px-4 py-3 bg-neutral-900/40 border border-neutral-800 focus:border-teal focus:ring-1 focus:ring-teal rounded-lg text-white placeholder-neutral-600 text-sm transition-all outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider font-semibold text-neutral-400">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              placeholder="e.g. director@studio.com"
              className="w-full px-4 py-3 bg-neutral-900/40 border border-neutral-800 focus:border-teal focus:ring-1 focus:ring-teal rounded-lg text-white placeholder-neutral-600 text-sm transition-all outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider font-semibold text-neutral-400">
              Project Type
            </label>
            <select
              name="projectType"
              value={formData.projectType}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-neutral-900/40 border border-neutral-800 focus:border-teal focus:ring-1 focus:ring-teal rounded-lg text-white text-sm transition-all outline-none"
            >
              <option value="Film Scoring">Film Scoring / Soundtrack</option>
              <option value="Orchestration">Orchestration & Arrangement</option>
              <option value="Music Production">Music Production & Programming</option>
              <option value="Ad Films & Jingles">Ad Films & Jingles</option>
              <option value="Game Music">Video Game Soundtracks</option>
              <option value="General Inquiry">General Business Inquiry</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider font-semibold text-neutral-400">
              Message details
            </label>
            <textarea
              name="message"
              required
              rows={4}
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Describe your project, deadlines, and requirements..."
              className="w-full px-4 py-3 bg-neutral-900/40 border border-neutral-800 focus:border-teal focus:ring-1 focus:ring-teal rounded-lg text-white placeholder-neutral-600 text-sm transition-all outline-none resize-none"
            />
          </div>

          {status === 'error' && (
            <div className="flex items-center gap-2 text-red-400 bg-red-950/20 border border-red-900/30 p-3 rounded-lg text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className={cn(
              "w-full py-3.5 bg-gradient-to-r from-gold to-teal text-background font-bold text-sm rounded-lg flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all duration-300 disabled:opacity-50 cursor-pointer"
            )}
          >
            {status === 'loading' ? (
              <span>Sending...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send Collaboration Proposal</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  )
}
