import { Stock } from '../types/stock';

export const formatPrice = (price: number): string => {
  return price.toFixed(2);
};

export const formatChange = (change: number): string => {
  return `${change > 0 ? '+' : ''}${change.toFixed(2)}`;
};

export const formatChangePercent = (percent: number): string => {
  return `${percent > 0 ? '+' : ''}${percent.toFixed(2)}%`;
};

export const getChangeColor = (value: number): string => {
  return value > 0 ? '#f5222d' : value < 0 ? '#52c41a' : 'inherit';
};

export const generateRandomStock = (): Partial<Stock> => {
  const randomCode = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  const randomName = `测试股票${randomCode}`;
  const randomPrice = +(Math.random() * 100 + 10).toFixed(2);
  const randomChange = +(Math.random() * 4 - 2).toFixed(2);
  const randomChangePercent = +((randomChange / randomPrice) * 100).toFixed(2);

  return {
    id: crypto.randomUUID(),
    code: randomCode,
    name: randomName,
    price: randomPrice,
    change: randomChange,
    changePercent: randomChangePercent
  };
};