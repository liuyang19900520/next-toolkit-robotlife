/**
 * Centralized Category Configuration
 * Based on current DynamoDB data structure.
 */

export const INVESTMENT_CATEGORIES: Record<string, string[]> = {
  股票: ['沪深300/中证500', '双创', '标普', '纳斯达克', '日本', '印度', '香港', '其他'],
  债券: ['中国', '美国'],
  大宗: ['大宗'],
  现金: ['余额宝', '现金', '定期'],
  黄金: ['黄金'],
  加密货币: ['比特币', '以太币', '其他'],
  ideco: ['股票', '债券'],
};

// Extracted large categories for dropdowns
export const TYPE1_OPTIONS = Object.keys(INVESTMENT_CATEGORIES).map((category) => ({
  value: category,
  label: category,
}));

// Helper to get small categories given a large category
export const getType2Options = (type1?: string) => {
  if (!type1 || !INVESTMENT_CATEGORIES[type1]) {
    return [];
  }
  return INVESTMENT_CATEGORIES[type1].map((sub) => ({
    value: sub,
    label: sub,
  }));
};
