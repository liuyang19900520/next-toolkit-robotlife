import { NextResponse } from 'next/server';
import { parseAlipayOcrText } from '@/lib/ocr/alipayParser';

const VISION_URL = 'https://vision.googleapis.com/v1/images:annotate?key={api_key}';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      console.error('GOOGLE_API_KEY is not configured in environment variables.');
      return NextResponse.json(
        { error: 'Google OCR service key is not configured on server' },
        { status: 500 }
      );
    }

    const body = await request.json();
    let base64Image = body?.image;

    if (!base64Image) {
      return NextResponse.json({ error: 'Image data is required' }, { status: 400 });
    }

    // 去除 Data URL 前缀 (如: "data:image/png;base64,")
    const match = base64Image.match(/^data:image\/\w+;base64,(.+)$/);
    if (match) {
      base64Image = match[1];
    }

    // 构建 Google Vision API 请求负载
    const url = VISION_URL.replace('{api_key}', apiKey);
    const payload = {
      requests: [
        {
          image: { content: base64Image },
          features: [{ type: 'TEXT_DETECTION' }],
        },
      ],
    };

    // 发起 HTTP 请求
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Vision API error response:', errorText);
      return NextResponse.json(
        { error: 'Failed to query text detection service' },
        { status: response.status }
      );
    }

    const result = await response.json();

    const responses = result.get ? result.get('responses') : result.responses;
    if (!responses || responses.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    const annotations = responses[0].textAnnotations;
    if (!annotations || annotations.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    // 获取完整页面的文本拼接
    const fullText = annotations[0].description || '';

    // 解析提取资产列表
    const parsedData = parseAlipayOcrText(fullText);

    return NextResponse.json({
      success: true,
      data: parsedData,
    });
  } catch (error: unknown) {
    console.error('OCR Route internal error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
