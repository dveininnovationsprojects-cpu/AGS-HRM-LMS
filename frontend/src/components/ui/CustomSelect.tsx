import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

export interface Option {
  value: string;
  label: string;
  icon?: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
  icon?: React.ReactNode;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Select option...',
  className = '',
  icon
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-[#0e112a] border border-white/10 rounded-xl text-sm text-slate-300 hover:border-primary/50 hover:bg-primary/5 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${isOpen ? 'border-primary/50 bg-primary/5' : ''} ${className.includes('text-primary') ? 'text-primary font-medium border-primary/20 bg-primary/5' : ''}`}
      >
        <span className="flex items-center gap-2 truncate">
          {icon && <span className="text-slate-400">{icon}</span>}
          {selectedOption ? (
            <span className="flex items-center gap-1.5">
              {selectedOption.icon && <span className="text-lg leading-none">{selectedOption.icon}</span>}
              {selectedOption.label}
            </span>
          ) : (
            <span className="text-slate-500">{placeholder}</span>
          )}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full min-w-[200px] mt-2 py-1.5 bg-[#141838] border border-white/10 rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {options.map((opt) => {
                const isSelected = value === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors hover:bg-primary/10 ${
                      isSelected ? 'text-primary bg-primary/5 font-medium' : 'text-slate-300'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {opt.icon && <span className="text-lg leading-none">{opt.icon}</span>}
                      {opt.label}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-primary" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
