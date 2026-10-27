import type { Metadata } from 'next';
import '@fontsource/vt323';
import '@fontsource/cinzel/400.css';
import '@fontsource/cinzel/600.css';
import '@fontsource/cinzel/700.css';
import './globals.css';

const SITE = process.env.NEXT_PUBLIC_SITE_URL
  || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL : 'http://localhost:3000');
const BLURB = 'Last login: June 12, 2009. An original interactive experience by Molly Curtis.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: 'Welcome Back',
  description: BLURB,
  openGraph: {
    type: 'website',
    siteName: 'Welcome Back',
    title: 'Welcome Back',
    description: BLURB,
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'A 2009 family computer on a desk, turned on' }],
  },
  twitter: { card: 'summary_large_image', title: 'Welcome Back', description: BLURB, images: ['/og.jpg'] },
  authors: [{ name: 'Molly Curtis', url: 'https://mollycurtis.github.io/' }],
  creator: 'Molly Curtis',
  other: {
    copyright: '© 2027 Molly Curtis. All rights reserved.',
    author: 'Molly Curtis',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="author" content="Molly Curtis" />
        <meta name="copyright" content="© 2027 Molly Curtis. All rights reserved." />
        <script
          type="text/plain"
          id="credits"
          dangerouslySetInnerHTML={{ __html: `
  Welcome Back
  Original interactive experience designed & developed by Molly Curtis
  © 2027 Molly Curtis. All rights reserved.
  https://mollycurtis.github.io/
` }}
        />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
            <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}');` }} />
          </>
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
