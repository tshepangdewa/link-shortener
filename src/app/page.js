'use client';

import { useState, useEffect } from 'react';

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [originalUrlPreview, setOriginalUrlPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyCopiedIndex, setHistoryCopiedIndex] = useState(null);

  // Load recent history from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('shortener_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const saveToHistory = (entry) => {
    try {
      const updated = [
        entry,
        ...history.filter((item) => item.shortUrl !== entry.shortUrl),
      ].slice(0, 8);
      setHistory(updated);
      localStorage.setItem('shortener_history', JSON.stringify(updated));
    } catch {
      // Ignore localStorage errors
    }
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('shortener_history');
    } catch {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanUrl = url.trim();
    if (!cleanUrl) return;

    setLoading(true);
    setError('');
    setShortUrl('');
    setCopied(false);

    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: cleanUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to shorten link');
      }

      const generatedShortUrl = `${window.location.origin}/${data.shortCode}`;
      setShortUrl(generatedShortUrl);
      setOriginalUrlPreview(data.originalUrl);

      saveToHistory({
        shortUrl: generatedShortUrl,
        originalUrl: data.originalUrl,
        shortCode: data.shortCode,
        createdAt: new Date().toLocaleDateString(),
      });

      setUrl('');
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text, index = null) => {
    try {
      await navigator.clipboard.writeText(text);
      if (index !== null) {
        setHistoryCopiedIndex(index);
        setTimeout(() => setHistoryCopiedIndex(null), 2000);
      } else {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <main className="main-content">
      <section className="hero-section">
        <h1 className="hero-title">SHORTEN ANY LINK.</h1>
        <p className="hero-subtitle">
          Fast and simple URL shortener. No accounts, no ads, no tracking instant redirects.
        </p>
      </section>

      <section className="card-box">
        <form onSubmit={handleSubmit}>
          <label htmlFor="url-input" className="form-label">
            ENTER DESTINATION URL
          </label>
          <div className="input-row">
            <input
              id="url-input"
              type="text"
              className="url-input"
              placeholder="https://example.com/long-page-address..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
              autoComplete="off"
              spellCheck="false"
              required
            />
            <button
              type="submit"
              className="btn-primary"
              disabled={loading || !url.trim()}
              id="shorten-button"
            >
              {loading ? 'PROCESSING...' : 'SHORTEN LINK'}
            </button>
          </div>
        </form>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {shortUrl && (
          <div className="result-card">
            <div className="result-header">YOUR SHORTENED LINK</div>
            <div className="result-main">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="short-url-link"
                id="result-link"
              >
                {shortUrl}
              </a>
              <div className="result-actions">
                <button
                  type="button"
                  className={`btn-action ${copied ? 'copied' : ''}`}
                  onClick={() => copyToClipboard(shortUrl)}
                  id="copy-button"
                >
                  {copied ? 'COPIED' : 'COPY'}
                </button>
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-action"
                >
                  VISIT &rarr;
                </a>
              </div>
            </div>
            {originalUrlPreview && (
              <div className="target-url-preview">
                DESTINATION: {originalUrlPreview}
              </div>
            )}
          </div>
        )}
      </section>

      {history.length > 0 && (
        <section className="history-section">
          <div className="history-header">
            <span className="history-title">RECENT SHORTENED LINKS</span>
            <button
              type="button"
              className="btn-clear"
              onClick={clearHistory}
            >
              CLEAR HISTORY
            </button>
          </div>

          <ul className="history-list">
            {history.map((item, idx) => (
              <li key={idx} className="history-item">
                <div className="history-details">
                  <a
                    href={item.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="history-short-url"
                  >
                    {item.shortUrl}
                  </a>
                  <p className="history-original-url">{item.originalUrl}</p>
                </div>
                <button
                  type="button"
                  className={`btn-action ${historyCopiedIndex === idx ? 'copied' : ''}`}
                  onClick={() => copyToClipboard(item.shortUrl, idx)}
                >
                  {historyCopiedIndex === idx ? 'COPIED' : 'COPY'}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
