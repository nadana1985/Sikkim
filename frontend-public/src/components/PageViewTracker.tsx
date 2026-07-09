'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';

/**
 * Tracks page views on route changes using Next.js pathname.
 * Sends a GA page_view event each time the path changes.
 */
export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    trackEvent('page_view', {
      category: 'engagement',
      label: pathname,
    });
  }, [pathname]);

  return null;
}
