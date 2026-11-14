// Vercel serverless entry point: every /api/* request is routed here (see vercel.json).
// It must stay in the root api/ folder, because that is where Vercel looks for functions.
import app from '../backend/app.js';

export default app;
