import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="main-content">
      <div className="not-found-box">
        <span className="not-found-code">404</span>
        <h2>Link Not Found</h2>
        <p>The shortened link you entered does not exist or has been removed.</p>
        <Link href="/" className="btn-action">
          Shorten Another Link
        </Link>
      </div>
    </main>
  );
}
