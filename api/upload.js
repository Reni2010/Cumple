// api/upload.js
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const busboy = (await import('busboy')).default;
  const bb = busboy({ headers: req.headers });
  const uploadsDir = path.join(process.cwd(), 'public/uploads');

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  let savePath = '';

  bb.on('file', (fieldname, file, info) => {
    const { filename } = info;
    const uniqueName = `${Date.now()}-${filename.replace(/\s+/g, '-')}`;
    savePath = path.join(uploadsDir, uniqueName);
    file.pipe(fs.createWriteStream(savePath));
  });

  bb.on('close', () => {
    const relativePath = savePath.split('public')[1].replace(/\\/g, '/');
    res.status(200).json({ url: relativePath });
  });

  req.pipe(bb);
}
