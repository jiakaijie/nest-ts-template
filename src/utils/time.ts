import moment = require('moment');

export const getYYYYMMDD = (date: Date): string => {
  return moment(date).format('YYYYMMDD');
};

export const getYYYYMMDDHH = (date: Date): string => {
  return moment(date).format('YYYY-MM-DD-HH');
};

export const getHHMMSS = (date: Date): string => {
  return moment(date).format('HHmmss');
};

export const getmmss = (date: Date) => {
  return moment(date).format('mmss');
};

export const getWeek = (date: Date) => {
  const weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return weeks[moment(date).day()];
};
