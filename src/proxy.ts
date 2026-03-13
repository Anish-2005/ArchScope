import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // Redirect legacy single-segment report URLs to /report/legacy/:id
  // Only when path is exactly /report/:id (no trailing slash, no extra segments)
  const reportSingleSegment = pathname.match(/^\/report\/([^/]+)\/?$/);
  if (reportSingleSegment) {
    const id = reportSingleSegment[1];
    // If the path already starts with /report/legacy, skip
    if (!pathname.startsWith('/report/legacy')) {
      url.pathname = `/report/legacy/${id}`;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/report/:path*'],
};
