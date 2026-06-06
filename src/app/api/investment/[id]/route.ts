import { NextRequest, NextResponse } from 'next/server';
import { investmentRepository } from '@/lib/dynamodb/investmentRepository';
import { parseBody, sanitizeInvestmentPayload } from '@/lib/dynamodb/validators';

// 禁用缓存的响应头
const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  Pragma: 'no-cache',
  Expires: '0',
  'Surrogate-Control': 'no-store',
};

// 获取单个投资
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const investmentId = Number(id);

    console.log(`获取投资详情: ${investmentId}`);

    if (isNaN(investmentId)) {
      return NextResponse.json(
        { data: null, message: 'Invalid ID', status: 400 },
        { status: 400, headers: noCacheHeaders }
      );
    }

    const investment = await investmentRepository.getById(investmentId);
    if (!investment) {
      return NextResponse.json(
        { data: null, message: 'Not Found', status: 404 },
        { status: 404, headers: noCacheHeaders }
      );
    }

    return NextResponse.json(
      {
        data: investment,
        message: 'OK',
        status: '0',
      },
      {
        headers: noCacheHeaders,
      }
    );
  } catch (error) {
    console.error('获取投资详情失败:', error);

    const errorMessage = error instanceof Error ? error.message : '未知错误';

    return NextResponse.json(
      {
        data: null,
        message: `请求失败: ${errorMessage}`,
        status: 500,
      },
      {
        status: 500,
        headers: noCacheHeaders,
      }
    );
  }
}

// 更新投资
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const investmentId = Number(id);
    const body = await request.json();

    console.log(`更新投资: ${investmentId}`);

    if (isNaN(investmentId)) {
      return NextResponse.json(
        { data: null, message: 'Invalid ID', status: 400 },
        { status: 400, headers: noCacheHeaders }
      );
    }

    const updatedInvestment = parseBody(body);
    if (!updatedInvestment) {
      return NextResponse.json(
        { data: null, message: 'Invalid request body', status: 400 },
        { status: 400, headers: noCacheHeaders }
      );
    }

    const sanitizedUpdates = sanitizeInvestmentPayload(updatedInvestment);
    if (!Object.keys(sanitizedUpdates).length) {
      return NextResponse.json(
        { data: null, message: 'No valid fields provided for update', status: 400 },
        { status: 400, headers: noCacheHeaders }
      );
    }

    const updatedRecord = await investmentRepository.update(investmentId, sanitizedUpdates);
    if (!updatedRecord) {
      return NextResponse.json(
        { data: null, message: 'Investment Not Found', status: 404 },
        { status: 404, headers: noCacheHeaders }
      );
    }

    return NextResponse.json(
      {
        data: updatedRecord,
        message: 'OK',
        status: '0',
      },
      {
        headers: noCacheHeaders,
      }
    );
  } catch (error) {
    console.error('更新投资失败:', error);

    const errorMessage = error instanceof Error ? error.message : '未知错误';

    return NextResponse.json(
      {
        data: null,
        message: `请求失败: ${errorMessage}`,
        status: 500,
      },
      {
        status: 500,
        headers: noCacheHeaders,
      }
    );
  }
}

// 删除投资
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const investmentId = Number(id);

    console.log(`删除投资: ${investmentId}`);

    if (isNaN(investmentId)) {
      return NextResponse.json(
        { data: null, message: 'Invalid ID', status: 400 },
        { status: 400, headers: noCacheHeaders }
      );
    }

    const deleted = await investmentRepository.delete(investmentId);
    if (!deleted) {
      return NextResponse.json(
        { data: null, message: 'Investment Not Found', status: 404 },
        { status: 404, headers: noCacheHeaders }
      );
    }

    return NextResponse.json(
      {
        data: deleted,
        message: 'OK',
        status: '0',
      },
      {
        headers: noCacheHeaders,
      }
    );
  } catch (error) {
    console.error('删除投资失败:', error);

    const errorMessage = error instanceof Error ? error.message : '未知错误';

    return NextResponse.json(
      {
        data: null,
        message: `请求失败: ${errorMessage}`,
        status: 500,
      },
      {
        status: 500,
        headers: noCacheHeaders,
      }
    );
  }
}
