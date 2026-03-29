import { readFileSync, writeFileSync } from 'fs';

const csv = readFileSync('c:/Users/HP/Downloads/Product_export.csv', 'utf-8');

// Parse CSV respecting quoted fields
function parseCSV(text) {
  const lines = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (inQuotes && text[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      lines[lines.length - 1].push(current);
      current = '';
    } else if ((ch === '\n' || ch === '\r') && !inQuotes) {
      if (current || lines.length) {
        if (!lines.length) lines.push([]);
        lines[lines.length - 1].push(current);
        current = '';
        lines.push([]);
      }
    } else {
      if (!lines.length) lines.push([]);
      current += ch;
    }
  }
  if (current) { if (!lines.length) lines.push([]); lines[lines.length - 1].push(current); }
  return lines.filter(l => l.length > 1);
}

function toPostgresArray(val) {
  if (!val || val.trim() === '' || val.trim() === '[]') return 'ARRAY[]::text[]';
  let arr;
  try {
    const parsed = JSON.parse(val);
    arr = Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    arr = [val.trim()];
  }
  const escaped = arr.map(s => `'${String(s).replace(/'/g, "''")}'`).join(', ');
  return `ARRAY[${escaped}]`;
}

function esc(val) {
  if (val === null || val === undefined || val === '') return 'NULL';
  return `'${String(val).replace(/'/g, "''")}'`;
}

const rows = parseCSV(csv);
const headers = rows[0].map(h => h.trim());
const data = rows.slice(1);

const idx = (name) => headers.indexOf(name);

let sql = `-- Products import\nINSERT INTO products (name, description, image, active, category, price, created_date) VALUES\n`;

const values = data.map(row => {
  const name     = row[idx('name')] || '';
  const desc     = row[idx('description')] || '';
  const imageRaw = row[idx('image')] || '';
  const active   = (row[idx('active')] || 'true').trim() === 'true';
  const catRaw   = row[idx('category')] || '';
  const price    = parseFloat(row[idx('price')]) || 0;
  const created  = row[idx('created_date')] || '';

  // category: could be array or plain string
  let category = catRaw.trim();
  try {
    const parsed = JSON.parse(catRaw);
    category = Array.isArray(parsed) ? parsed[0] : String(parsed);
  } catch { /* plain string */ }

  return `  (${esc(name)}, ${esc(desc)}, ${toPostgresArray(imageRaw)}, ${active}, ${esc(category)}, ${price}, ${esc(created)})`;
});

sql += values.join(',\n') + ';\n';

writeFileSync('c:/Users/HP/Downloads/chef-halavi-5acab3d6/supabase/products_import.sql', sql, 'utf-8');
console.log(`Done — ${data.length} products written to supabase/products_import.sql`);
