import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { BackgroundRemover } from '../../../src/background-remover';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const image = formData.get('image');
    const algorithm = formData.get('algorithm') || 'edge-detection';
    const threshold = parseFloat(formData.get('threshold')) || 0.5;
    const feathering = parseInt(formData.get('feathering')) || 2;
    const removeBgApiKey = formData.get('removeBgApiKey') || '';

    if (!image) {
      return NextResponse.json({ error: '没有上传文件' }, { status: 400 });
    }

    // 确保输出目录存在
    const outputDir = path.join(process.cwd(), 'outputs');
    await mkdir(outputDir, { recursive: true });

    // 生成输出文件名
    const timestamp = Date.now();
    const filename = `processed-${timestamp}-${image.name}`;
    const outputPath = path.join(outputDir, filename);

    // 移除背景
    await removeBackground(image.path, outputPath, {
      algorithm,
      threshold,
      feathering,
      removeBgApiKey
    });

    // 生成访问URL
    const outputUrl = `/outputs/${filename}`;
    
    return NextResponse.json({
      success: true,
      originalName: image.name,
      outputUrl: outputUrl,
      message: '背景移除成功！'
    });

  } catch (error) {
    console.error('处理失败:', error.message);
    return NextResponse.json({ 
      error: '处理失败: ' + error.message 
    }, { status: 500 });
  }
}

async function removeBackground(inputPath, outputPath, options = {}) {
  const { removeBackground } = await import('../../../src/background-remover');
  
  await removeBackground(inputPath, outputPath, options);
}