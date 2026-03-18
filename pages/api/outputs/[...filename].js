import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(request, { params }) {
  try {
    const { filename } = params;
    const filePath = path.join(process.cwd(), 'outputs', filename);
    
    const fileBuffer = await readFile(filePath);
    
    return new Response(fileBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (error) {
    return new Response('文件不存在', { status: 404 });
  }
}