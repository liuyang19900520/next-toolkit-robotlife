import { NextRequest, NextResponse } from 'next/server';
import { investmentRepository } from '@/lib/dynamodb/investmentRepository';
import {
  parseBody,
  sanitizeInvestmentPayload,
  generateInvestmentId,
} from '@/lib/dynamodb/validators';

// 禁用缓存的响应头
const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  Pragma: 'no-cache',
  Expires: '0',
  'Surrogate-Control': 'no-store',
};

// 获取投资列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    console.log(`获取投资列表`);

    const investments = await investmentRepository.list({
      filters: queryParams,
    });

    return NextResponse.json(
      {
        data: investments,
        message: 'OK',
        status: '0',
      },
      {
        headers: noCacheHeaders,
      }
    );
  } catch (error) {
    console.error('获取投资列表失败:', error);

    const errorMessage = error instanceof Error ? error.message : '未知错误';

    return NextResponse.json(
      {
        data: [],
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

// 创建投资
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newInvestment = parseBody(body);
    if (!newInvestment) {
      throw new Error('Invalid request body');
    }

    const investmentPayload = sanitizeInvestmentPayload(newInvestment);

    // Auto-generate ID if not provided
    if (investmentPayload.id === undefined) {
      investmentPayload.id = generateInvestmentId();
    }

    // Add timestamp
    if (!investmentPayload.createdAt) {
      investmentPayload.createdAt = new Date().toISOString();
    }

    console.log(`创建投资: ${investmentPayload.id}`);

    const created = await investmentRepository.create(investmentPayload);

    return NextResponse.json(
      {
        data: created,
        message: 'OK',
        status: '0',
      },
      {
        headers: noCacheHeaders,
      }
    );
  } catch (error) {
    console.error('创建投资失败:', error);

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
