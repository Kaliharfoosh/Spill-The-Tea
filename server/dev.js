// Local development server. On Vercel, api/index.js is used instead.
import app from './app.js';

// API_PORT, not PORT: tools (IDE runners, preview servers) often set PORT to the web port (5173),
// which would make the API miss the address Vite proxies /api to (see vite.config.js).
const port = process.env.API_PORT || 3001;
app.listen(port, () => console.log(`API ready on http://localhost:${port}`));
