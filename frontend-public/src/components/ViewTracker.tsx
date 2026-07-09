'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

interface ViewTrackerProps {
  eventName: string;
  label: string;
}

/**
 * Generic analytics tracker that fires an event when the component mounts.
 * Used for monastery and festival detail page view tracking.
 */
export default function ViewTracker({ eventName, label }: ViewTrackerProps) {
  useEffect(() => {
    trackEvent(eventName, {
      category: 'engagement',
      label,
    });
  }, [eventName, label]);

  return null;
}
