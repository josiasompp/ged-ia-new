import React from 'react';
import { cn } from '@/lib/utils';

const Timeline = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("relative pl-6 after:absolute after:inset-y-0 after:w-px after:bg-gray-200 after:left-6", className)}>
    {children}
  </div>
));
Timeline.displayName = "Timeline";

const TimelineItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("relative pl-8 py-4", className)} {...props}>
    {children}
  </div>
));
TimelineItem.displayName = "TimelineItem";

const TimelineDot = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("absolute left-0 top-4 -translate-x-1/2 w-8 h-8 bg-white dark:bg-gray-950 rounded-full flex items-center justify-center border-4 border-white", className)} {...props}>
    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800">
        {children}
    </div>
  </div>
));
TimelineDot.displayName = "TimelineDot";

const TimelineContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props}>
    {children}
  </div>
));
TimelineContent.displayName = "TimelineContent";

const TimelineTitle = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("font-semibold text-gray-800 dark:text-white", className)} {...props}>
    {children}
  </div>
));
TimelineTitle.displayName = "TimelineTitle";

const TimelineTime = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("text-sm text-gray-500 dark:text-gray-400", className)} {...props}>
    {children}
  </div>
));
TimelineTime.displayName = "TimelineTime";

const TimelineBody = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("mt-2 text-sm text-gray-600 dark:text-gray-400", className)} {...props}>
    {children}
  </div>
));
TimelineBody.displayName = "TimelineBody";

export { Timeline, TimelineItem, TimelineDot, TimelineContent, TimelineTitle, TimelineTime, TimelineBody };