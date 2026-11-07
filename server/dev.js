// Local development server. On Vercel, api/index.js is used instead.
import app from './app.js';

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`API ready on http://localhost:${port}`));
