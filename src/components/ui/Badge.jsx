import React from 'react';
import { cn } from '../../utils/cn';

const badgeVariants = {
  variant: {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground hover:bg-accent hover:text-accent-foreground",
    success: "border-transparent bg-green-100 text-green-800 hover:bg-green-200",
    warning: "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    info: "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200",
  },
  size: {
    default: "h-6 px-2.5 py-0.5 text-xs",
    sm: "h-5 px-2 py-0.5 text-xs",
    lg: "h-7 px-3 py-1 text-sm",
  },
};

const Badge = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default",
  children,
  ...props 
}, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md border font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        badgeVariants.variant[variant],
        badgeVariants.size[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export { Badge, badgeVariants };
