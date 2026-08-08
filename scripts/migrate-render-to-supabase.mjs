const sourceUrl = "https://server-full-gospel.onrender.com";
const supabaseUrl = process.env.SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !secretKey) {
  throw new Error("Set SUPABASE_URL and SUPABASE_SECRET_KEY before running this script.");
}

const readJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`GET ${url} failed: ${response.status}`);
  return response.json();
};

const upsert = async (table, records) => {
  const batchSize = 10;
  for (let index = 0; index < records.length; index += batchSize) {
    const batch = records.slice(index, index + batchSize);
    const response = await fetch(
      `${supabaseUrl}/rest/v1/${table}?on_conflict=legacy_id`,
      {
        method: "POST",
        headers: {
          apikey: secretKey,
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates,return=minimal",
        },
        body: JSON.stringify(batch),
      }
    );
    if (!response.ok) {
      throw new Error(`${table} import failed: ${await response.text()}`);
    }
    console.log(`${table}: imported ${Math.min(index + batch.length, records.length)}/${records.length}`);
  }
};

const [sourcePosts, sourceMezmurs] = await Promise.all([
  readJson(`${sourceUrl}/posts`),
  readJson(`${sourceUrl}/mezmur`),
]);

const posts = sourcePosts.map((post) => ({
  legacy_id: post._id,
  title: post.title || "Untitled",
  message: post.message || "",
  tags: Array.isArray(post.tags) ? post.tags : [],
  selected_file: post.selectedFile || null,
  name: post.name || "",
  likes: [],
  created_at: post.createdAt || new Date().toISOString(),
}));

const mezmurs = sourceMezmurs.map((mezmur) => ({
  legacy_id: mezmur._id,
  title: mezmur.title || "Untitled",
  artist: mezmur.artist || "",
  lyrics: mezmur.langetext || "",
  name: mezmur.name || "",
  created_at: mezmur.createdAt || new Date().toISOString(),
}));

if (posts.length) await upsert("posts", posts);
if (mezmurs.length) await upsert("mezmurs", mezmurs);

console.log(`Imported ${posts.length} posts and ${mezmurs.length} mezmurs.`);
