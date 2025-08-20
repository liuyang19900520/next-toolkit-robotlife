import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get("ticker") || "DIS";

    console.log(`测试API: 获取股票 ${ticker} 的数据`);

    // 直接调用本地API
    const [scoreResponse, detailResponse] = await Promise.all([
      fetch(`http://127.0.0.1:8000/score?ticker=${ticker}`),
      fetch(`http://127.0.0.1:8000/data?ticker=${ticker}`),
    ]);

    if (!scoreResponse.ok || !detailResponse.ok) {
      throw new Error(
        `API请求失败: score=${scoreResponse.status}, detail=${detailResponse.status}`
      );
    }

    const scoreData = await scoreResponse.json();
    const detailData = await detailResponse.json();

    return NextResponse.json({
      success: true,
      ticker,
      scoreData,
      detailData,
      message: "API连接成功",
    });
  } catch (error) {
    console.error("API测试失败:", error);

    // 提供更详细的错误信息
    let errorMessage = "未知错误";
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error("错误详情:", error.stack);
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        message: "API连接失败",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
