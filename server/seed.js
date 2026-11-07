// Demo data so the feed isn't empty. Only inserted into an empty database.

const POSTS = [
  { content: 'Whoever keeps microwaving fish in the IT building kitchen at 9am: we know it is you. We just do not know who you are.', status: 'served', verdict: 'steeped', hours: 3, hot: 42, cold: 2, more: 17 },
  { content: 'Rumour says the library is getting 24/7 opening hours before finals. My sources are a very confident group chat.', status: 'served', verdict: 'weak', hours: 9, hot: 12, cold: 30, more: 8 },
  { content: 'Confession: I have been pretending to understand pointers since first year and it has been going great.', status: 'served', verdict: null, hours: 20, hot: 88, cold: 1, more: 5 },
  { content: 'The vending machine on the ground floor gives two drinks if you press B4 twice. You did not hear it here.', status: 'served', verdict: 'steeped', hours: 30, hot: 64, cold: 4, more: 22 },
  { content: 'Someone in my lab group submitted the report at 11:59:58 and then wrote "sorry for the late reply" in the group chat.', status: 'served', verdict: null, hours: 52, hot: 35, cold: 0, more: 11 },
  { content: 'This post is still brewing and should NOT appear in the public feed.', status: 'brewing', verdict: null, hours: 1, hot: 0, cold: 0, more: 0 },
];

const USERS = [
  ['tea_sipper', 'sipper'],
  ['tea_spiller', 'spiller'],
  ['tea_witness', 'witness'],
  ['tea_verifier', 'verifier'],
  ['tea_moderator', 'moderator'],
  ['tea_admin', 'admin'],
];

export async function seed(db) {
  const { rows } = await db.query('SELECT count(*)::int AS n FROM posts');
  if (rows[0].n > 0) return false;

  for (const [handle, role] of USERS) {
    await db.query('INSERT INTO users (handle, role) VALUES ($1, $2) ON CONFLICT (handle) DO NOTHING', [handle, role]);
  }

  for (const p of POSTS) {
    const { rows: [post] } = await db.query(
      `INSERT INTO posts (content, status, verdict, created_at)
       VALUES ($1, $2, $3, now() - make_interval(hours => $4)) RETURNING id`,
      [p.content, p.status, p.verdict, p.hours],
    );
    for (const kind of ['hot', 'cold', 'more']) {
      await db.query('INSERT INTO reactions (post_id, kind, count) VALUES ($1, $2, $3)', [post.id, kind, p[kind]]);
    }
  }
  return true;
}
