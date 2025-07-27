// api/gallery.js
import { list } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { blobs } = await list();

    // Filtrar solo imágenes
    const imageBlobs = blobs.filter(blob =>
      blob.contentType.startsWith('image/')
    );

    // Ordenar por fecha de subida (opcional)
    imageBlobs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    // Devolver solo las URLs
    const urls = imageBlobs.map(blob => blob.url);

    res.status(200).json(urls);
  } catch (error) {
    res.status(500).json({ error: 'No se pudo cargar la galería.' });
  }
}
