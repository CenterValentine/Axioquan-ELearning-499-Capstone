
// /src/components/ui/active-link.tsx

'use client';

import Link from 'next/link';
import { useActivePath } from '@/hooks/use-active-path';
import { cn } from '@/lib/utils';

interface ActiveLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
  onClick?: () => void;
}

export function ActiveLink({ 
  href, 
  children, 
  className = '',
  activeClassName = 'bg-primary/20 text-primary',
  inactiveClassName = 'text-foreground hover:bg-primary/10 hover:text-primary',
  onClick
}: ActiveLinkProps) {
  const checkActivePath = useActivePath();
  const isActive = checkActivePath(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'font-medium px-3 py-2 rounded-lg transition border border-transparent',
        className,
        isActive ? activeClassName : inactiveClassName
      )}
    >
      {children}
    </Link>
  );
}