import { cn } from '@/lib/utils';

/**
 * Animated loading skeleton with shimmer effect.
 * Used as a placeholder while content is loading.
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg bg-muted',
        // Shimmer overlay
        'before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:animate-shimmer',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
