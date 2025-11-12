"use client";

import type { LucideProps } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

interface HolographicIconProps extends LucideProps {
  icon: React.ElementType;
}

export function HolographicIcon({ icon: Icon, className, ...props }: HolographicIconProps) {
  return (
      <Icon className={cn("holographic-icon", className)} {...props} />
  );
}
