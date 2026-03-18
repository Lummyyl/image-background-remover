import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    algorithms: [
      { id: 'edge-detection', name: '边缘检测', description: '基于边缘检测算法' },
      { id: 'color-based', name: '基于颜色', description: '基于背景颜色分析' },
      { id: 'remove-bg', name: 'Remove.bg API', description: '使用 Remove.bg 专业服务（需要 API Key）' }
    ]
  });
}