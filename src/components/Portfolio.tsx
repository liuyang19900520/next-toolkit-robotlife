'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface PortfolioItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  detailDescription: string;
  techStack: string[];
  features: string[];
  architectureImage: string;
  externalUrl: string;
  emoji: string;
  designDecisions?: string[];
}

const portfolioItems: PortfolioItem[] = [
  {
    id: 'nba-ai-agent',
    title: 'NBA AI Agent',
    subtitle: 'AI-Powered Basketball Analytics',
    description: 'An intelligent NBA analysis agent built with LangChain, capable of game predictions, lineup optimization, and real-time stats analysis.',
    detailDescription: 'This NBA AI Agent leverages Large Language Models and the LangChain framework to provide intelligent basketball analytics. The agent can predict game outcomes, optimize team lineups using AI-driven analysis, and provide real-time leaderboard tracking. It integrates with NBA statistics APIs and uses LangSmith for monitoring and debugging agent performance.',
    techStack: ['Next.js', 'LangChain', 'LangSmith', 'Python', 'FastAPI', 'AWS'],
    features: [
      '🏀 AI Game Prediction - Predict NBA game results using multi-factor analysis',
      '📊 1-Click Lineup Optimizer - AI-powered optimal lineup suggestions',
      '🏆 Real-time Leaderboard - Player and team performance tracking',
      '🤖 Agent Monitoring - LangSmith integration for performance debugging',
    ],
    architectureImage: '/nba-agent-architecture.png',
    externalUrl: 'https://nba-game.liuyang19900520.com/',
    emoji: '🏀',
    designDecisions: [
      'LangChain Agent framework for flexible tool orchestration',
      'LangSmith integration for production monitoring & debugging',
      'FastAPI backend with async endpoints for AI inference',
    ],
  },
  {
    id: 'words-maker',
    title: 'WordsMaker',
    subtitle: 'Automated Vocabulary Extraction Tool',
    description: 'An automated English vocabulary extraction tool for learners who read academic papers or textbooks. Upload a PDF, specify a page range, and get new words imported to your study list.',
    detailDescription: 'WordsMaker is designed for English learners who regularly read academic papers or textbooks. Upload a PDF, specify a page range, and the system automatically: OCRs each page using Google Vision API, processes the extracted text with NLP (spaCy for named-entity recognition, NLTK for POS-tagging and lemmatization) to extract meaningful vocabulary — filtering stopwords, punctuation, and proper nouns, stores word frequencies in DynamoDB building a personal frequency corpus over time, and deduplicates against your existing Eudic study list importing only new words — so you never add duplicates.',
    techStack: ['Next.js', 'Python', 'AWS Lambda', 'DynamoDB', 'Google Vision API', 'Terraform', 'GitHub Actions'],
    features: [
      '📄 PDF OCR Processing - Upload PDFs and OCR each page via Google Vision API',
      '🧠 NLP Vocabulary Extraction - spaCy NER + NLTK POS-tagging & lemmatization for meaningful words',
      '📊 Personal Frequency Corpus - DynamoDB-backed word frequency tracking over time',
      '🔄 Eudic Deduplication - Auto-dedup against your study list, import only new words',
      '☁️ Serverless Architecture - Lambda + Function URL keeps costs near zero',
      '🏗️ Infrastructure as Code - Terraform with S3 state, fully automated CI/CD',
    ],
    architectureImage: '/words-marker-architecture.png',
    externalUrl: 'https://master.do1usm8cu9yli.amplifyapp.com/',
    emoji: '📚',
    designDecisions: [
      'Serverless-first: Lambda + Function URL keeps costs near zero at low usage',
      'Monorepo with separate frontend/backend/infra concerns',
      'Infrastructure-as-Code via Terraform with state in S3',
      'Secrets managed in AWS Secrets Manager, never in source code',
      'CI/CD fully automated: GitHub Actions for backend (Docker → ECR → Lambda), Amplify for frontend',
    ],
  },
];

export default function Portfolio() {
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  // Handle Escape key to close fullscreen image or modal
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (fullscreenImage) {
        setFullscreenImage(null);
      } else if (selectedItem) {
        setSelectedItem(null);
      }
    }
  }, [fullscreenImage, selectedItem]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Prevent body scroll when fullscreen image is open
  useEffect(() => {
    if (fullscreenImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [fullscreenImage]);

  return (
    <>
      {/* Portfolio Section */}
      <div className="w-full max-w-2xl mt-4">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 text-center sm:text-left">
          Works
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {portfolioItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group relative overflow-hidden rounded-2xl border border-black/[.08] dark:border-white/[.145] bg-white/50 dark:bg-white/[.04] backdrop-blur-sm p-5 text-left transition-all duration-300 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-white/5 hover:border-black/20 dark:hover:border-white/30 hover:-translate-y-1 cursor-pointer"
            >
              {/* Gradient accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="flex items-start gap-3">
                <span className="text-3xl">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-base text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-purple-600 transition-all duration-300">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {item.subtitle}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                    {item.description}
                  </p>
                  {/* Tech badges */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {item.techStack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-black/[.05] dark:bg-white/[.08] text-gray-600 dark:text-gray-300 font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                    {item.techStack.length > 3 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/[.05] dark:bg-white/[.08] text-gray-400 font-medium">
                        +{item.techStack.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Click hint */}
              <div className="absolute bottom-3 right-3 text-xs text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Click for details →
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Detail Modal/Overlay */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedItem(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" />

          {/* Modal Content */}
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-2xl animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with gradient */}
            <div className="relative p-6 pb-4">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 rounded-t-2xl" />

              {/* Close button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/[.05] dark:bg-white/[.1] hover:bg-black/[.1] dark:hover:bg-white/[.2] transition-colors text-gray-500 dark:text-gray-400"
              >
                ✕
              </button>

              <div className="flex items-center gap-3 mt-2">
                <span className="text-4xl">{selectedItem.emoji}</span>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {selectedItem.title}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedItem.subtitle}
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 pb-6 space-y-5">
              {/* Description */}
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {selectedItem.detailDescription}
              </p>

              {/* Features */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Key Features
                </h4>
                <ul className="space-y-2">
                  {selectedItem.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-gray-700 dark:text-gray-300 bg-black/[.02] dark:bg-white/[.04] rounded-lg px-3 py-2"
                    >
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tech Stack */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Tech Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-orange-500/10 to-purple-600/10 border border-orange-500/20 dark:border-purple-500/20 text-gray-700 dark:text-gray-300 font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Design Decisions */}
              {selectedItem.designDecisions && selectedItem.designDecisions.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Key Design Decisions
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedItem.designDecisions.map((decision, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2"
                      >
                        <span className="text-orange-500 mt-0.5 flex-shrink-0">▸</span>
                        {decision}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Architecture Diagram - clickable to fullscreen */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Architecture
                </h4>
                <button
                  onClick={() => setFullscreenImage(selectedItem.architectureImage)}
                  className="group/arch relative w-full rounded-xl overflow-hidden border border-black/[.08] dark:border-white/[.1] bg-[#1a1a2e] cursor-zoom-in transition-all duration-300 hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-500/10"
                >
                  <Image
                    src={selectedItem.architectureImage}
                    alt={`${selectedItem.title} Architecture`}
                    width={800}
                    height={600}
                    className="w-full h-auto object-contain"
                    style={{ maxHeight: '400px' }}
                  />
                  {/* Fullscreen hint overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover/arch:bg-black/30 transition-all duration-300">
                    <div className="opacity-0 group-hover/arch:opacity-100 transition-all duration-300 flex items-center gap-2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 3 21 3 21 9" />
                        <polyline points="9 21 3 21 3 15" />
                        <line x1="21" y1="3" x2="14" y2="10" />
                        <line x1="3" y1="21" x2="10" y2="14" />
                      </svg>
                      Click to enlarge
                    </div>
                  </div>
                </button>
              </div>

              {/* CTA Button */}
              <div className="pt-2">
                <a
                  href={selectedItem.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-sm font-medium hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors"
                >
                  Visit Project
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Image Viewer */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center animate-fadeIn"
          onClick={() => setFullscreenImage(null)}
        >
          {/* Dark backdrop */}
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

          {/* Close button - top right */}
          <button
            onClick={() => setFullscreenImage(null)}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white text-lg backdrop-blur-sm"
            aria-label="Close fullscreen"
          >
            ✕
          </button>

          {/* Hint text - top left */}
          <div className="absolute top-4 left-4 z-10 text-white/50 text-xs flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/70 text-[10px] font-mono">ESC</kbd>
            <span>or click anywhere to close</span>
          </div>

          {/* Image container */}
          <div
            className="relative w-full h-full flex items-center justify-center p-4 sm:p-8 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="relative max-w-full max-h-full overflow-auto rounded-xl cursor-default"
              onClick={() => setFullscreenImage(null)}
            >
              <Image
                src={fullscreenImage}
                alt="Architecture Diagram - Full View"
                width={1600}
                height={1200}
                className="max-w-none w-auto h-auto max-h-[90vh] object-contain rounded-xl"
                quality={100}
                priority
              />
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </>
  );
}
