// api/upload.js
import { put } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);

  const boundary = req.headers['content-type'].split('boundary=')[1];
  const [header, content] = buffer.toString().split(`--${boundary}`);

  const match = /filename="(.+?)"/.exec(header);
  const filename = match ? match[1] : `foto-${Date.now()}.jpg`;

  try {
    const blob = await put(filename, buffer, {
      access: 'public',
    });

    return res.status(200).json({ url: blob.url });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al subir la imagen' });
  }
}
