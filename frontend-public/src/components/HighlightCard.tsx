import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface HighlightCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color: 'orange' | 'blue' | 'green' | 'purple';
}

const colorVariants = {
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-950/40',
    iconBg: 'bg-orange-100 dark:bg-orange-900/40',
    iconColor: 'text-orange-600',
    textColor: 'text-orange-600',
    border: 'border-orange-200 dark:border-orange-800',
    hover: 'hover:bg-orange-100 dark:hover:bg-orange-900/50'
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    iconBg: 'bg-blue-100 dark:bg-blue-900/40',
    iconColor: 'text-blue-600',
    textColor: 'text-blue-600',
    border: 'border-blue-200 dark:border-blue-800',
    hover: 'hover:bg-blue-100 dark:hover:bg-blue-900/50'
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-950/40',
    iconBg: 'bg-green-100 dark:bg-green-900/40',
    iconColor: 'text-green-600',
    textColor: 'text-green-600',
    border: 'border-green-200 dark:border-green-800',
    hover: 'hover:bg-green-100 dark:hover:bg-green-900/50'
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    iconBg: 'bg-purple-100 dark:bg-purple-900/40',
    iconColor: 'text-purple-600',
    textColor: 'text-purple-600',
    border: 'border-purple-200 dark:border-purple-800',
    hover: 'hover:bg-purple-100 dark:hover:bg-purple-900/50'
  }
};

export default function HighlightCard({ 
  title, 
  description, 
  icon: Icon, 
  href, 
  color 
}: HighlightCardProps) {
  const variant = colorVariants[color];

  return (
    <Link
      href={href}
      className={`block p-6 rounded-xl border ${variant.bg} ${variant.border} ${variant.hover} transition-colors duration-200 group`}
    >
      <div className="flex items-start space-x-4">
        {/* Icon */}
        <div className={`flex-shrink-0 w-12 h-12 ${variant.iconBg} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
          <Icon className={`h-6 w-6 ${variant.iconColor}`} />
        </div>
        
        {/* Content */}
        <div className="flex-grow">
          <h3 className={`text-lg font-semibold ${variant.textColor} mb-2 group-hover:underline`}>
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      
      {/* Arrow indicator */}
      <div className="mt-4 flex justify-end">
        <div className={`w-6 h-6 ${variant.iconBg} rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform duration-200`}>
          <svg 
            className={`w-3 h-3 ${variant.iconColor}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
