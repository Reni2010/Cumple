// api/gallery.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const dir = path.join(process.cwd(), 'public/uploads');

  if (!fs.existsSync(dir)) {
    return res.status(200).json([]);
  }

  const files = fs.readdirSync(dir).map(name => `/uploads/${name}`);
  res.status(200).json(files);
}
