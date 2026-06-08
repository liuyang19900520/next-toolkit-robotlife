export interface OcrAssetItem {
  name: string;
  amount: number;
}

// 常见的支付宝持有页面干扰词
const SYSTEM_KEYWORDS = [
  '全部持有',
  '收益明细',
  '交易记录',
  '全部',
  '名称/金额',
  '日收益',
  '持有收益',
  '累计收益',
  '占比',
  '灵活取用',
  '我的免费保单',
  '共2张保单',
  '以上按照持有收益排序',
  '基金',
  '投资增值',
  '定投',
  '金选',
  '纯债基金',
  '超额收益',
  '持有收益排序',
  '基金名称',
  '基金/产品',
  '持仓明细',
  '持有金额',
  '自选',
  '收益',
];

// 检查是否是合法的资产/基金名称
function isAssetName(line: string): boolean {
  const clean = line.trim();

  // 长度校验
  if (clean.length < 2 || clean.length > 40) return false;

  // 拆分以空格分隔的词，逐个分析
  const parts = clean.split(/\s+/);

  const isInterference = (part: string) => {
    // 移除 + - 号以及空白字符
    const normalized = part.replace(/[+-\s]/g, '');
    if (!normalized) return true;

    // 1. 是否全等匹配特定干扰词
    if (SYSTEM_KEYWORDS.includes(normalized) || SYSTEM_KEYWORDS.includes(part)) return true;

    // 2. 是否是纯数值、百分比、加减号
    if (/^[+-]?[\d,]+(\.\d+)?%?$/.test(part)) return true;

    // 3. 常见标签的模糊匹配 (只要全等于这些，或者仅包含这些)
    const fuzzyLabels = [
      '基金',
      '定投',
      '金选',
      '增值',
      '收益',
      '理财',
      '占比',
      '取用',
      '保单',
      '持有',
      '自选',
      '纯债基金',
      '指数基金',
      '超额收益',
      '纯债',
      '债基金',
    ];
    if (fuzzyLabels.includes(normalized)) return true;

    return false;
  };

  const allPartsAreInterference = parts.every(isInterference);
  if (allPartsAreInterference) return false;

  // 排除整行是数值、百分比的情况
  if (/^[+-]?[\d,]+(\.\d+)?%?$/.test(clean)) return false;

  // 名字中必须包含汉字或字母
  if (!/[\u4e00-\u9fa5a-zA-Z]/.test(clean)) return false;

  return true;
}

// 检查是否是无加减号前缀的持有金额
function isAmount(line: string): boolean {
  const clean = line.trim();

  // 匹配数字，可能包含千分位逗号，且必须以数字开头和结尾，最多两位小数
  // 注意：收益行通常会有 "+" 或 "-"，而持有金额是纯正数，不带加减符号
  return /^\d{1,3}(,\d{3})*(\.\d{1,2})?$/.test(clean);
}

// 解析金额为数值
function parseAmountValue(line: string): number | null {
  const clean = line.trim().replace(/,/g, '');
  const val = parseFloat(clean);
  return isNaN(val) ? null : val;
}

/**
 * 从支付宝持有截图的 OCR 原始文本中，解析提取资产名称和持有金额
 * @param text Google Vision OCR 返回的原始文本 description
 * @returns 资产与金额数组
 */
export function parseAlipayOcrText(text: string): OcrAssetItem[] {
  if (!text) return [];

  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  const items: OcrAssetItem[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (isAssetName(line)) {
      // 锁定一个疑似资产名，在其后 1 - 5 行内搜索金额
      for (let j = 1; j <= 5 && i + j < lines.length; j++) {
        const nextLine = lines[i + j];

        // 如果在遇到金额前，先遇到了另一个资产名，说明当前资产无对应金额，直接截断
        if (isAssetName(nextLine) && !isAmount(nextLine)) {
          break;
        }

        if (isAmount(nextLine)) {
          const amount = parseAmountValue(nextLine);
          if (amount !== null && amount > 0) {
            items.push({
              name: line,
              amount,
            });
            // 消耗掉金额这一行，更新指针 i
            i = i + j;
            break;
          }
        }
      }
    }
  }

  return items;
}
