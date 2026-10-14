import type { AnchorHTMLAttributes } from 'react';

// Full-page navigation keeps the archived site's router isolated from the new app.
export default function LegacyLink({ href = '/', ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a {...props} href={href.startsWith('/') ? `/legacy${href === '/' ? '' : href}` : href} />;
}
