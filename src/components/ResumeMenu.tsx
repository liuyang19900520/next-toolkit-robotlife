'use client';

import { useState, useRef, useEffect } from 'react';

interface ResumeOption {
  label: string;
  url: string;
  type: 'html' | 'pdf';
  lang: 'jp' | 'en';
}

const resumeOptions: ResumeOption[] = [
  {
    label: 'HTML Version (JP)',
    url: '/resume/resume.html',
    type: 'html',
    lang: 'jp',
  },
  {
    label: '履歴書 (PDF - JP)',
    url: '/resume/履歴書_劉洋.pdf',
    type: 'pdf',
    lang: 'jp',
  },
  {
    label: '職務経歴書 (PDF - JP)',
    url: '/resume/職務経歴書_劉洋.pdf',
    type: 'pdf',
    lang: 'jp',
  },
  // Future English versions placeholder
  /*
  {
    label: 'Resume (EN)',
    url: '/resume/resume-en.pdf',
    type: 'pdf',
    lang: 'en',
  },
  */
];

export default function ResumeMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-all flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44 gap-2 group"
      >
        <span>Resume</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 rounded-xl border border-black/[.08] dark:border-white/[.145] bg-white/80 dark:bg-black/80 backdrop-blur-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-left">
          <div className="py-2">
            <div className="px-4 py-2 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              Japanese Version
            </div>
            {resumeOptions.filter(o => o.lang === 'jp').map((option) => (
              <a
                key={option.url}
                href={option.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
                onClick={() => setIsOpen(false)}
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-foreground/5 text-foreground transition-colors group-hover:bg-foreground group-hover:text-background">
                  {option.type === 'html' ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  )}
                </span>
                <div className="flex flex-col">
                  <span className="font-medium">{option.label}</span>
                  <span className="text-[10px] text-gray-500 uppercase">{option.type} version</span>
                </div>
              </a>
            ))}

            <div className="mx-2 mt-2 h-[1px] bg-black/[.05] dark:bg-white/[.05]" />

            <div className="px-4 py-3 text-xs text-gray-400 dark:text-gray-500">
              <span className="flex items-center gap-2 italic">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                English versions coming soon...
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
