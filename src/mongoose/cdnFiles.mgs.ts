import mongoose = require('mongoose');

// 表名称
export const cdnFilesCollectionName = 'cdn_files';

// cdnFiles表字段Schema信息
export const cdnFilesCollectionSchema = new mongoose.Schema({
  // cdn地址
  url: {
    type: String,
    default: '',
  },
  // 原文件名称
  originalname: {
    type: String,
    default: '',
  },
  // mimetype
  mimetype: {
    type: String,
    default: '',
  },
  // 文件类型
  type: {
    type: String,
    default: '',
  },
  // 源文件大小
  sourceSize: {
    type: Number,
    default: 0,
  },
  // 处理后文件大小
  finalSize: {
    type: Number,
    default: 0,
  },
  // 上传进度 上传完成改成1
  rate: {
    type: Number,
    default: 0,
  },
  // 上传次数，如果重新上传次数+1
  uploadNum: {
    type: Number,
    default: 0,
  },
  // 是否经过压缩（这里指的是图压算法）0 | 1
  isCompress: {
    type: Number,
    default: 0,
  },
  // 总共上传的耗时
  uploadConsumTime: {
    type: Number,
    default: 0,
  },
  folderId: {
    type: String,
    default: '',
  },
  folderName: {
    type: String,
    default: '',
  },
  // 创建时间
  createTime: {
    type: Date,
    default: Date.now,
  },
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
