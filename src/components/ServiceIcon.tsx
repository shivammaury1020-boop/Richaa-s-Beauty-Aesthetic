import React from 'react';
import {
  Droplets,
  Eye,
  Feather,
  Flower2,
  Heart,
  Scissors,
  Sparkles,
  Sun,
} from 'lucide-react';
import type { ServiceIconKey } from '../types/site';

export function ServiceIcon({
  icon,
  className = 'w-5 h-5',
}: {
  icon: ServiceIconKey;
  className?: string;
}) {
  const props = { className, strokeWidth: 1.4, 'aria-hidden': true as const };
  switch (icon) {
    case 'eye':
      return <Eye {...props} />;
    case 'feather':
      return <Feather {...props} />;
    case 'scissors':
      return <Scissors {...props} />;
    case 'droplet':
      return <Droplets {...props} />;
    case 'flower':
      return <Flower2 {...props} />;
    case 'sun':
      return <Sun {...props} />;
    case 'heart':
      return <Heart {...props} />;
    case 'sparkles':
    default:
      return <Sparkles {...props} />;
  }
}
