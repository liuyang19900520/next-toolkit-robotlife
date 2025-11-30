import { NextRequest, NextResponse } from "next/server";
import { getInvestmentApiBaseUrl } from "@/config/api";

// 代理 GET 请求 - 获取单个投资
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const backendUrl = getInvestmentApiBaseUrl();
    const { id } = await params;
    const url = `${backendUrl}/investment/${id}`;

    console.log(`代理获取投资详情: ${url}`);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`AWS API 错误 (${response.status}):`, errorText);
      return NextResponse.json(
        {
          data: null,
          message: `API 请求失败: ${response.status} ${response.statusText}`,
          status: response.status,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("代理获取投资详情 API 请求失败:", error);
    
    const errorMessage =
      error instanceof Error ? error.message : "未知错误";
    
    return NextResponse.json(
      {
        data: null,
        message: `请求失败: ${errorMessage}`,
        status: 500,
      },
      { status: 500 }
    );
  }
}

// 代理 PUT 请求 - 更新投资
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const backendUrl = getInvestmentApiBaseUrl();
    const { id } = await params;
    const body = await request.json();
    const url = `${backendUrl}/investment/${id}`;

    console.log(`代理更新投资: ${url}`);

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`AWS API 错误 (${response.status}):`, errorText);
      return NextResponse.json(
        {
          data: null,
          message: `API 请求失败: ${response.status} ${response.statusText}`,
          status: response.status,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("代理更新投资 API 请求失败:", error);
    
    const errorMessage =
      error instanceof Error ? error.message : "未知错误";
    
    return NextResponse.json(
      {
        data: null,
        message: `请求失败: ${errorMessage}`,
        status: 500,
      },
      { status: 500 }
    );
  }
}

// 代理 DELETE 请求 - 删除投资
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const backendUrl = getInvestmentApiBaseUrl();
    const { id } = await params;
    const url = `${backendUrl}/investment/${id}`;

    console.log(`代理删除投资: ${url}`);

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`AWS API 错误 (${response.status}):`, errorText);
      return NextResponse.json(
        {
          data: null,
          message: `API 请求失败: ${response.status} ${response.statusText}`,
          status: response.status,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("代理删除投资 API 请求失败:", error);
    
    const errorMessage =
      error instanceof Error ? error.message : "未知错误";
    
    return NextResponse.json(
      {
        data: null,
        message: `请求失败: ${errorMessage}`,
        status: 500,
      },
      { status: 500 }
    );
  }
}


