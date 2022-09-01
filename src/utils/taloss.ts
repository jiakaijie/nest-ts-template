import { extname, basename } from 'path';
import fs = require('fs-extra');
import TalOss = require('@xes/tal-oss');
import fileType = require('file-type');

import config from 'src/config';

const talOssConfig = config.talOss;
const { staticHost, bucket, accessKeyId, accessKeySecret } = talOssConfig;

const commonUrl = `${staticHost}/${bucket}`;

type TalOssOneType = {
  codeTime: number;
  duration: number;
  url: string;
  filePath: string;
  type: string;
};

/**
 * 单文件上传
 * @param { filePath: '/Users/jiakaijie/a.png'(文件路径), uploadTo: 'abc'(上传到oss的哪个目录下) }
 * @returns ''
 * 给一个文件路径（绝对路径）,实现了判断文件是否存在,是不是文件,验证流媒体文件并且修改文件类型,上传文件；
 * 返回执行时间,上传后的url,文件路径（外层需要删除文件）
 */
// 上传到哪个文件夹交给外层，专门设计的
const talOssOne = async ({ filePath, uploadTo }): Promise<TalOssOneType> => {
  const codeFirstTime = Date.now();
  if (!fs.existsSync(filePath)) {
    console.log('文件不存在');
    return;
  }
  if (!fs.statSync(filePath).isFile()) {
    console.log('不是文件');
    return;
  }
  // 原来的文件后缀.png
  const oldExtName = extname(filePath);
  // 真实的文件流类型
  const fileTypeFromFile = await fileType.fromFile(filePath);
  // 真实的文件后缀.gif
  const realFileExtname = fileTypeFromFile
    ? `.${fileTypeFromFile?.ext}`
    : oldExtName;
  const fileExtname =
    realFileExtname === oldExtName ? oldExtName : realFileExtname;

  // 文件名称 a.png
  const fileBasename = basename(filePath);
  // 最终文件名称 a.gif
  const newFileName = `${fileBasename.split(oldExtName)[0]}${fileExtname}`;

  const newFilePath = `${filePath.split(fileBasename)[0]}${newFileName}`;
  fs.renameSync(filePath, newFilePath);

  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    new TalOss({
      uploadTo,
      bucket,
      limit: 100,
      accessKeyId,
      accessKeySecret,
      success() {
        resolve({
          codeTime: startTime - codeFirstTime,
          duration: Date.now() - startTime,
          url: `${commonUrl}/${uploadTo}/${newFileName}`,
          filePath: newFilePath,
          type: fileExtname.slice(1),
        });
      },
      fail(err) {
        console.log(
          '================若为测试环境, 请检查是否绑定测试环境hosts: 120.52.32.211 upload.xueersi.com',
        );
        reject(err);
      },
    }).uploadFile(newFilePath);
  });
};

/**
 * 多文件上传
 * @param { folderDirPath: '/Users/jiakaijie'(本地对应的上传目录), uploadTo: 'abc'(上传到oss的哪个目录下) }
 * @returns ''
 */
const talOssAll = ({ folderDirPath, uploadTo }) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    new TalOss({
      uploadFrom: folderDirPath, //  文件夹
      uploadTo,
      bucket,
      limit: 100,
      accessKeyId,
      accessKeySecret,
      success() {
        console.log('================全部文件上传完毕================');
        resolve({
          url: `${staticHost}/${bucket}/${uploadTo}/`,
          duration: Date.now() - startTime,
        });
      },
      fail(err) {
        console.log('================文件上传失败================');
        console.log(
          '================若为测试环境, 请检查是否绑定测试环境hosts: 120.52.32.211 upload.xueersi.com',
        );
        reject(err);
      },
    }).upload();
  });
};

export { talOssOne, talOssAll };
