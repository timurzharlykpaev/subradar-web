import React from 'react'

interface LegalLayoutProps {
  title: string
  children: React.ReactNode
}

export function LegalLayout({ title, children }: LegalLayoutProps) {
  return (
    <div className="min-h-dvh" style={{background:'radial-gradient(ellipse at top,#1a0533 0%,#0f0f13 60%)'}}>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <a href="/" className="text-purple-400 text-sm mb-8 inline-block hover:underline">← SubRadar</a>
        <h1 className="text-3xl font-bold mb-8 text-white">{title}</h1>
        <div className="prose prose-invert max-w-none space-y-6 text-gray-300 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  )
}
