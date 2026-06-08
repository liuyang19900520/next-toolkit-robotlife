import { NextResponse } from 'next/server';
import { investmentRepository } from '@/lib/dynamodb/investmentRepository';
import { sanitizeInvestmentPayload, generateInvestmentId } from '@/lib/dynamodb/validators';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: 'Payload must be an array of investments' },
        { status: 400 }
      );
    }

    const createdItems = [];

    // Loop through each item, validate and save
    for (const item of body) {
      try {
        const payload = sanitizeInvestmentPayload(item);
        if (payload.id === undefined) {
          payload.id = generateInvestmentId();
        }
        if (!payload.createdAt) {
          payload.createdAt = new Date().toISOString();
        }
        const createdItem = await investmentRepository.create(payload);
        createdItems.push(createdItem);
      } catch (err: unknown) {
        console.error('Error saving batch item:', item, err);
        // Continue saving other items even if one fails
      }
    }

    return NextResponse.json(
      {
        success: true,
        count: createdItems.length,
        data: createdItems,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Batch create API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const ids = body?.ids;

    if (!Array.isArray(ids)) {
      return NextResponse.json({ error: 'Payload must contain an array of ids' }, { status: 400 });
    }

    const deletedIds: number[] = [];
    const failedIds: number[] = [];

    // 并发删除所有记录
    await Promise.all(
      ids.map(async (id: number) => {
        try {
          await investmentRepository.delete(Number(id));
          deletedIds.push(id);
        } catch (err) {
          console.error(`Error deleting item ${id}:`, err);
          failedIds.push(id);
        }
      })
    );

    return NextResponse.json({
      success: true,
      deletedCount: deletedIds.length,
      failedCount: failedIds.length,
      deletedIds,
      failedIds,
    });
  } catch (error: unknown) {
    console.error('Batch delete API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
