import './globals.css';

export const metadata = {
  title: 'ShortLink — Fast and Simple URL Shortener',
  description: 'Fast, permanent, zero-friction URL shortening with no accounts, no ads, no tracking.',
};

// ==========================================
// SOCIAL LINKS & SVG ASSETS CONFIGURATION
// ==========================================
// Your SVG files are located in the /public folder:
// - /public/github.svg
// - /public/instagram.svg
// - /public/linkedin.svg
const SOCIAL_LINKS = [
  {
    name: 'GitHub',
    url: 'https://github.com/tshepangdewa', // <-- Put your GitHub profile URL here
    icon: '/github.svg', // Directory: /public/github.svg
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com/tshepangdewa', // <-- Put your Instagram profile URL here
    icon: '/instagram.svg', // Directory: /public/instagram.svg
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/tshepangdewa', // <-- Put your LinkedIn profile URL here
    icon: '/linkedin.svg', // Directory: /public/linkedin.svg
  },
];

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="layout-wrapper">
          <header className="site-nav">
            <div className="nav-inner">
              <div className="brand-badge">
                <span className="brand-indicator"></span>
                <span>ShortLink</span>
              </div>
            </div>
          </header>

          {children}

          <footer className="site-footer">
            <div className="footer-container">
              <div className="footer-left">
                <h2 className="footer-name">Tshepang Dewa</h2>
                <p className="footer-bio">Building useful digital experiences.</p>
                <p className="footer-copyright">
                  &copy;2026 Tshepang Dewa. All rights reserved.
                </p>
              </div>

              <div className="footer-right">
                <span className="footer-social-label">Social</span>
                <div className="footer-social-links">
                  {SOCIAL_LINKS.map((item) => (
                    <a
                      key={item.name}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-btn"
                      aria-label={item.name}
                    >
                      <img
                        src={item.icon}
                        alt={item.name}
                        className="social-icon"
                        width="20"
                        height="20"
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
