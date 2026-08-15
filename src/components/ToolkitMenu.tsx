'use client';

import { useState, useRef, useEffect } from 'react';

interface ToolkitOption {
  label: string;
  url: string;
  description: string;
}

const toolkitOptions: ToolkitOption[] = [
  {
    label: 'Wallet',
    url: 'https://wallet.liuyang19900520.com/',
    description: 'Web3 Wallet',
  },
];

export default function ToolkitMenu() {
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
        <span>Toolkit</span>
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
            {toolkitOptions.map((option) => (
              <a
                key={option.url}
                href={option.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
                onClick={() => setIsOpen(false)}
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-foreground/5 text-foreground transition-colors group-hover:bg-foreground group-hover:text-background">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                </span>
                <div className="flex flex-col">
                  <span className="font-medium">{option.label}</span>
                  <span className="text-[10px] text-gray-500 uppercase">
                    {option.description}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
