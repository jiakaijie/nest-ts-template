import mongoose = require('mongoose');

// 表名称
export const foldersCollectionName = 'folders';

// folders表字段Schema信息
export const foldersCollectionSchema = new mongoose.Schema({
  // 项目名称
  name: {
    type: String,
    default: '',
  },
  // 描述
  describe: {
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
