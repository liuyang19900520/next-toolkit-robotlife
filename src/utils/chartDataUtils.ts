import { Investment } from '@/types';
import { TYPE1_OPTIONS, INVESTMENT_CATEGORIES } from '@/config/categories';

const CATEGORIES = TYPE1_OPTIONS.map((opt) => opt.value);

export const getRmbPieChartData = (investments: Investment[], activeCategory: string | null) => {
  let sourceData = investments;

  if (sourceData.length > 0) {
    const years = sourceData.map((item) => Number(item.year)).filter(Boolean);
    if (years.length > 0) {
      const latestYear = String(Math.max(...years));
      sourceData = sourceData.filter((item) => item.year === latestYear);
    }
  }

  // 仅保留人民币资产
  sourceData = sourceData.filter((item) => item.currency === 'CNY');

  if (activeCategory) {
    const subCategories = INVESTMENT_CATEGORIES[activeCategory] || [];
    const subCategoryData = subCategories.map((subCategory) => {
      const filtered = sourceData.filter(
        (item) => item.type1 === activeCategory && item.type2 === subCategory
      );
      const value = filtered.reduce((sum, item) => sum + Number(item.price), 0);
      return { type: subCategory, value: Math.round(value) };
    });
    return subCategoryData.filter((item) => item.value > 0);
  }

  const categoryData = CATEGORIES.map((category) => {
    const filtered = sourceData.filter((item) => item.type1 === category);
    const value = filtered.reduce((sum, item) => sum + Number(item.price), 0);
    return { type: category, value: Math.round(value) };
  });
  return categoryData.filter((item) => item.value > 0);
};

export const getNonRmbPieChartData = (
  investments: Investment[],
  activeCategory: string | null,
  rates: { USDJPY: number; USDCNY: number; JPYUSD: number; JPYCNY: number }
) => {
  let sourceData = investments;

  if (sourceData.length > 0) {
    const years = sourceData.map((item) => Number(item.year)).filter(Boolean);
    if (years.length > 0) {
      const latestYear = String(Math.max(...years));
      sourceData = sourceData.filter((item) => item.year === latestYear);
    }
  }

  // 过滤掉人民币，剩下的外币全部折算为日元
  sourceData = sourceData.filter((item) => item.currency !== 'CNY');

  if (activeCategory) {
    const subCategories = INVESTMENT_CATEGORIES[activeCategory] || [];
    const subCategoryData = subCategories.map((subCategory) => {
      const filtered = sourceData.filter(
        (item) => item.type1 === activeCategory && item.type2 === subCategory
      );
      const value = filtered.reduce((sum, item) => {
        let amount = Number(item.price);
        if (item.currency === 'USD') amount *= rates.USDJPY;
        return sum + amount;
      }, 0);
      return { type: subCategory, value: Math.round(value) };
    });
    return subCategoryData.filter((item) => item.value > 0);
  }

  const categoryData = CATEGORIES.map((category) => {
    const filtered = sourceData.filter((item) => item.type1 === category);
    const value = filtered.reduce((sum, item) => {
      let amount = Number(item.price);
      if (item.currency === 'USD') amount *= rates.USDJPY;
      return sum + amount;
    }, 0);
    return { type: category, value: Math.round(value) };
  });
  return categoryData.filter((item) => item.value > 0);
};

export const getTotalPieChartData = (
  investments: Investment[],
  activeCategory: string | null,
  rates: { USDJPY: number; USDCNY: number; JPYUSD: number; JPYCNY: number }
) => {
  let sourceData = investments;

  if (sourceData.length > 0) {
    const years = sourceData.map((item) => Number(item.year)).filter(Boolean);
    if (years.length > 0) {
      const latestYear = String(Math.max(...years));
      sourceData = sourceData.filter((item) => item.year === latestYear);
    }
  }

  if (activeCategory) {
    const subCategories = INVESTMENT_CATEGORIES[activeCategory] || [];
    const subCategoryData = subCategories.map((subCategory) => {
      const filtered = sourceData.filter(
        (item) => item.type1 === activeCategory && item.type2 === subCategory
      );
      const value = filtered.reduce((sum, item) => {
        let amount = Number(item.price);
        if (item.currency === 'USD') amount *= rates.USDJPY;
        if (item.currency === 'CNY') amount *= rates.USDJPY / rates.USDCNY;
        return sum + amount;
      }, 0);
      return { type: subCategory, value: Math.round(value) };
    });
    return subCategoryData.filter((item) => item.value > 0);
  }

  const categoryData = CATEGORIES.map((category) => {
    const filtered = sourceData.filter((item) => item.type1 === category);
    const value = filtered.reduce((sum, item) => {
      let amount = Number(item.price);
      if (item.currency === 'USD') amount *= rates.USDJPY;
      if (item.currency === 'CNY') amount *= rates.USDJPY / rates.USDCNY;
      return sum + amount;
    }, 0);
    return { type: category, value: Math.round(value) };
  });
  return categoryData.filter((item) => item.value > 0);
};
