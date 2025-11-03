import 'dotenv/config';

const key = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
if (!key) {
  console.error('GOOGLE_API_KEY is not set in your environment/.env');
  process.exit(1);
}

const url = 'https://generativelanguage.googleapis.com/v1/models';

try {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'x-goog-api-key': key,
      'accept': 'application/json'
    }
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`HTTP ${res.status}: ${text}`);
    process.exit(1);
  }
  const data = await res.json();
  const models = data.models || [];
  for (const m of models) {
    const methods = (m.supportedGenerationMethods || []).join(',');
    console.log(`${m.name}\t${methods}`);
  }
} catch (err) {
  console.error(err?.stack || String(err));
  process.exit(1);
}
