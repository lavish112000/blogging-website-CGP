'use client'

import { useState } from 'react'
import { Sparkles, FileText, Wand2, Copy, Check } from 'lucide-react'

/**
 * AI DRAFT GENERATOR
 * Generate article drafts using AI
 * ADMIN ONLY - Protected by layout
 * NO INDEX - Blocked from search engines via parent layout
 */
export default function AIDraftsPage() {
  const [topic, setTopic] = useState('')
  const [category, setCategory] = useState('technology')
  const [template, setTemplate] = useState('comprehensive-guide')
  const [draft, setDraft] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const generateDraft = async () => {
    if (!topic.trim()) {
      alert('Please enter a topic')
      return
    }

    setLoading(true)
    setDraft(null)

    try {
      const response = await fetch('/api/ai-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, category, template })
      })

      const data = await response.json()
      if (data.success) {
        setDraft(data.draft)
      } else {
        alert('Failed to generate draft')
      }
    } catch (error) {
      console.error('Failed to generate draft:', error)
      alert('Error generating draft')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (!draft) return

    const markdown = `---
title: "${draft.title}"
description: "${draft.description}"
date: "${new Date().toISOString().split('T')[0]}"
author: "Lalit Choudhary"
category: "${category}"
tags: ${JSON.stringify(draft.tags)}
featured: ${draft.featured}
priority: ${draft.priority}
breaking: ${draft.breaking}
summary: "${draft.summary}"
---

${draft.body}
`

    navigator.clipboard.writeText(markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-purple-500" />
          AI Draft Generator
        </h1>
        <p className="text-muted-foreground mt-2">
          Generate structured article drafts using AI assistance
        </p>
      </div>

      {/* Generator Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="bg-card border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Draft Settings</h2>

          {/* Topic */}
          <div>
            <label className="block text-sm font-medium mb-2">Article Topic *</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Quantum Computing, Sustainable Tech, AI in Healthcare"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="technology">Technology</option>
              <option value="business">Business</option>
              <option value="design">Design</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="blog">Blog</option>
            </select>
          </div>

          {/* Template */}
          <div>
            <label className="block text-sm font-medium mb-2">Template Style</label>
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="comprehensive-guide">Comprehensive Guide</option>
              <option value="breaking-news">Breaking News</option>
              <option value="how-to">How-To Tutorial</option>
              <option value="analysis">Industry Analysis</option>
              <option value="opinion">Opinion Piece</option>
            </select>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateDraft}
            disabled={loading || !topic.trim()}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Wand2 className="w-5 h-5" />
            {loading ? 'Generating Draft...' : 'Generate Draft'}
          </button>

          {/* Notice */}
          <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 text-sm">
            <p className="text-yellow-900 dark:text-yellow-100">
              <strong>Note:</strong> AI-generated content is a starting point. Always review, fact-check, and customize before publishing.
            </p>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Generated Draft</h2>
            {draft && (
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Markdown
                  </>
                )}
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
              <p className="text-muted-foreground">Generating your draft...</p>
            </div>
          ) : draft ? (
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {/* Title */}
              <div>
                <label className="text-xs text-muted-foreground">Title</label>
                <p className="text-lg font-bold">{draft.title}</p>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs text-muted-foreground">Description</label>
                <p className="text-sm">{draft.description}</p>
              </div>

              {/* Summary */}
              <div>
                <label className="text-xs text-muted-foreground">AI Summary</label>
                <p className="text-sm bg-blue-50 dark:bg-blue-950 p-3 rounded border border-blue-200 dark:border-blue-800">
                  {draft.summary}
                </p>
              </div>

              {/* Tags */}
              <div>
                <label className="text-xs text-muted-foreground">Tags</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {draft.tags.map((tag: string) => (
                    <span key={tag} className="px-2 py-1 bg-muted text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Body Preview */}
              <div>
                <label className="text-xs text-muted-foreground">Article Body</label>
                <div className="mt-2 p-4 bg-muted/30 rounded border border-border prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-sm">{draft.body}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
              <FileText className="w-16 h-16 mb-4 opacity-50" />
              <p>Enter a topic and click "Generate Draft" to begin</p>
            </div>
          )}
        </div>
      </div>

      {/* How to Use */}
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">How to Use AI Drafts</h3>
        <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
          <li><strong>1. Generate:</strong> Enter topic, select category/template, click generate</li>
          <li><strong>2. Review:</strong> Read the draft and check for accuracy</li>
          <li><strong>3. Copy:</strong> Click "Copy Markdown" to get the full MDX format</li>
          <li><strong>4. Paste:</strong> Go to CMS, create new article, paste content</li>
          <li><strong>5. Customize:</strong> Edit, add images, fact-check, personalize</li>
          <li><strong>6. Publish:</strong> Save as draft or publish directly</li>
        </ol>
      </div>

      {/* AI Integration */}
      <div className="bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
        <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Upgrade to Real AI
        </h3>
        <p className="text-sm text-purple-800 dark:text-purple-200">
          Currently using template-based generation. For production, integrate:
        </p>
        <ul className="text-sm text-purple-800 dark:text-purple-200 mt-2 space-y-1 ml-4">
          <li>• <strong>OpenAI GPT-4</strong> - Best quality and creativity</li>
          <li>• <strong>Google Gemini</strong> - Great for news and research</li>
          <li>• <strong>Anthropic Claude</strong> - Excellent for long-form content</li>
        </ul>
        <p className="text-xs text-purple-700 dark:text-purple-300 mt-2">
          See <code className="bg-purple-100 dark:bg-purple-900 px-1 rounded">PUBLISHER_FEATURES.md</code> for integration guide.
        </p>
      </div>
    </div>
  )
}
