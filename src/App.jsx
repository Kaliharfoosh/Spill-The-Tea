import { useEffect, useState } from 'react';

const REACTIONS = [
  { kind: 'hot', emoji: '☕', label: 'Hot tea' },
  { kind: 'cold', emoji: '🧊', label: 'Cold / fake' },
  { kind: 'more', emoji: '🫖', label: 'Spill more' },
];

const VERDICTS = {
  steeped: { text: 'Steeped', icon: '✓', title: 'Confirmed by a Verifier' },
  weak: { text: 'Weak brew', icon: '?', title: 'Marked unverified by a Verifier' },
};

function Cup({ post }) {
  const verdict = post.verdict && VERDICTS[post.verdict];
  return (
    <article className="cup">
      <header className="cup-head">
        <span className="anon">Anonymous spiller</span>
        <span className="dot">·</span>
        <span className="when">{post.when}</span>
        {verdict && (
          <span className={`stamp stamp-${post.verdict}`} title={verdict.title}>
            {verdict.icon} {verdict.text}
          </span>
        )}
      </header>
      <p className="cup-body">{post.content}</p>
      <footer className="reactions">
        {REACTIONS.map((r) => (
          <button key={r.kind} className="react" title={r.label} disabled>
            <span aria-hidden="true">{r.emoji}</span>
            <span className="count">{post.reactions?.[r.kind] ?? 0}</span>
            <span className="sr-only">{r.label}</span>
          </button>
        ))}
      </footer>
    </article>
  );
}

export default function App() {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/posts')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then(setPosts)
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div className="page">
      <header className="masthead">
        <div className="brand">
          <span className="pot" aria-hidden="true">🫖</span>
          <div>
            <h1>Spill The Tea</h1>
            <p className="tagline">Campus tea, served anonymously. Even our admins can't tell who spilled it.</p>
          </div>
        </div>
      </header>

      <main className="feed">
        <h2 className="section-title">Freshly served</h2>
        {error && <p className="notice">Couldn't pour the tea: {error}</p>}
        {!posts && !error && <p className="notice">Brewing…</p>}
        {posts?.length === 0 && <p className="notice">The pot is empty. No tea yet.</p>}
        {posts?.map((p) => <Cup key={p.id} post={p} />)}
      </main>

      <footer className="foot">
        BUE · Data Privacy 26CSCN26H · a privacy-hardened mini-application
      </footer>
    </div>
  );
}
