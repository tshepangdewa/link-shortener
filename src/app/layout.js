import './globals.css';

export const metadata = {
  title: 'URL Shortener — Fast, Minimalist Link Shortener',
  description: 'Fast, permanent, zero-friction URL shortening with no accounts or tracking.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="layout-wrapper">
          <header className="site-nav">
            <div className="nav-inner">
              <div className="brand-badge">
                <span className="brand-indicator"></span>
                <span>LINK SHORTENER</span>
              </div>
              <span className="nav-tagline">NO LOGINS &middot; NO TRACKING</span>
            </div>
          </header>
          {children}
          <footer className="site-footer">
            <div className="footer-inner">
              <span>MINIMALIST URL ENGINE</span>
              <span>POWERED BY SUPABASE &amp; VERCEL</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
