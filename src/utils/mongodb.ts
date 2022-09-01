import mongoose = require('mongoose');
import config from '../config';
import {
  cdnFilesCollectionName,
  cdnFilesCollectionSchema,
} from '../mongoose/cdnFiles.mgs';
import {
  fileTypesCollectionName,
  fileTypesCollectionSchema,
} from '../mongoose/fileTypes.mgs';
import {
  foldersCollectionName,
  foldersCollectionSchema,
} from '../mongoose/folders.mgs';

const mongodb = config.mongodb;
const { host, db1 } = mongodb;

// 定义所有的表并且抛出供使用
let CdnFilesCollection;
let FileTypesCollection;
let FoldersCollection;

(async () => {
  const url = `mongodb://${host}/${db1}`;
  mongoose.connection.on('connecting', () => {
    console.log(`mongodb ${url} 开始连接`);
  });
  mongoose.connection.on('disconnected', () => {
    console.log(`mongodb 未连接上`);
  });

  mongoose.connection.on('error', (err) => {
    console.log(`mongodb 异常`, err);
  });

  try {
    // 直接连接数据库名，没有库不会失败
    const mongo = await mongoose.connect(`mongodb://${host}/${db1}`);
    // {
    //   serverSelectionTimeoutMS: 3000,
    //   socketTimeoutMS: 2000,
    // }
    console.log(`mongodb ${url}连接成功`);
    // model方法会直接进行创建表
    // mongoose包限制表名称规范必须_做分割，最后必须加s, 否则包会将表名称做转换，本身mogodb名称定义不遵循这个
    // 每次经过Schema后如果新加了字段，mongodb中老数据的字段不会增加，但是mongoose查出来后，会把没有的字段补上默任值
    // mongoose默认的主键_id在nodejs中输出是一个Object.id() -> 返给前端的时候会变成字符串的id
    // mongoose时间设置在nodejs中应该是显示一个IOS的Date对象，返给前端会自动转换成字符串的IOS时间格式
    CdnFilesCollection = mongoose.model(
      cdnFilesCollectionName,
      cdnFilesCollectionSchema,
    );
    console.log(`mongodb 库${db1}中 表${cdnFilesCollectionName} 加载成功`);

    FileTypesCollection = mongoose.model(
      fileTypesCollectionName,
      fileTypesCollectionSchema,
    );
    console.log(`mongodb 库${db1}中 表${fileTypesCollectionName} 加载成功`);

    FoldersCollection = mongoose.model(
      foldersCollectionName,
      foldersCollectionSchema,
    );
    console.log(`mongodb 库${db1}中 表${foldersCollectionName} 加载成功`);
  } catch (err) {}
})();

export { CdnFilesCollection, FileTypesCollection, FoldersCollection };
