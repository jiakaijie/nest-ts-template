import mongoose = require('mongoose');

// 表名称
export const fileTypesCollectionName = 'file_types';

// cdnFiles表字段Schema信息
export const fileTypesCollectionSchema = new mongoose.Schema({
  // 文件类型名
  name: {
    type: String,
    default: '',
  },
  // 创建时间
  createTime: {
    type: Date,
    default: Date.now,
  },
  // 更新时间
  updateTime: {
    type: Date,
    default: Date.now,
  },
  // 创建人
  creator: {
    type: String,
    default: 'jiakaijie',
  },
});
