import { NextRequest, NextResponse } from "next/server";
import { getInvestmentApiBaseUrl } from "@/config/api";

// 禁用缓存的响应头
const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
  'Surrogate-Control': 'no-store',
};

// 代理 GET 请求 - 获取投资列表
export async function GET(request: NextRequest) {
  try {
    const backendUrl = getInvestmentApiBaseUrl();
    
    const { searchParams } = new URL(request.url);
    
    // 构建查询参数字符串
    const queryString = searchParams.toString();
    const url = `${backendUrl}/investment${
      queryString ? `?${queryString}` : ""
    }`;

    console.log(`代理请求投资列表: ${url}`);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // 设置缓存和超时
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API 错误 (${response.status}):`, errorText);
      return NextResponse.json(
        {
          data: [],
          message: `API 请求失败: ${response.status} ${response.statusText}`,
          status: response.status,
        },
        { 
          status: response.status,
          headers: noCacheHeaders,
        }
      );
    }

    const data = await response.json();
    // 禁用缓存，确保每次请求都获取最新数据
    return NextResponse.json(data, {
      headers: noCacheHeaders,
    });
  } catch (error) {
    console.error("代理投资 API 请求失败:", error);
    
    const errorMessage =
      error instanceof Error ? error.message : "未知错误";
    
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

// 代理 POST 请求 - 创建投资
export async function POST(request: NextRequest) {
  try {
    const backendUrl = getInvestmentApiBaseUrl();
    const body = await request.json();
    const url = `${backendUrl}/investment`;

    console.log(`代理创建投资: ${url}`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API 错误 (${response.status}):`, errorText);
      return NextResponse.json(
        {
          data: null,
          message: `API 请求失败: ${response.status} ${response.statusText}`,
          status: response.status,
        },
        { 
          status: response.status,
          headers: noCacheHeaders,
        }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, {
      headers: noCacheHeaders,
    });
  } catch (error) {
    console.error("代理创建投资 API 请求失败:", error);
    
    const errorMessage =
      error instanceof Error ? error.message : "未知错误";
    
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
