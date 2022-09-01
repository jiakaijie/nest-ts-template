import { Injectable, Body } from '@nestjs/common';
import { resolve, extname } from 'path';
import { tmpdir } from 'os';
import uuid = require('uuid');
import fs = require('fs-extra');

import { CreateCdnFileDto } from './dto/create-cdn-file.dto';
import { talOssOne } from '../../utils/taloss';
import { getYYYYMMDD, getYYYYMMDDHH } from '../../utils/time';
import {
  CdnFilesCollection,
  FileTypesCollection,
  FoldersCollection,
} from '../../utils/mongodb';
@Injectable()
export class CdnFilesService {
  async upload(files, bodyData) {
    const codeStartTime = Date.now();

    const { folderId } = bodyData;

    const { name = '' } =
      (await FoldersCollection.findOne({ _id: folderId })) || {};

    // 进来直接创建并且抛出
    const dbArr = await this.createCdnFiles(
      files.map((item) => {
        const { originalname, mimetype, size } = item;
        return {
          originalname,
          mimetype,
          sourceSize: size,
          finalSize: size,
          rate: 0.2,
          folderId,
          folderName: name,
        };
      }),
    );
    // 记录创建的id后续进行update
    dbArr.forEach((item, index) => {
      files[index]._id = item._id;
      files[index].isUploadSuccess = false;
    });
    console.log('初始化创建成功');

    process.nextTick(async () => {
      // 创建保存的临时文件夹
      const temDir = resolve(tmpdir(), uuid.v1());
      fs.mkdirSync(temDir);
      const time = getYYYYMMDDHH(new Date());
      console.log('创建文件夹', temDir);

      files.forEach((fileItem) => {
        process.nextTick(async () => {
          const { originalname, buffer, _id } = fileItem;
          const fileExtname = extname(originalname);
          // 此处把uuid4生成的随机给截掉了，容易发生意外，但是可以让文件名称短一点
          const filePath = resolve(temDir, uuid.v4().slice(0, 8) + fileExtname);
          fileItem.filePath = filePath;

          fs.writeFileSync(filePath, buffer);

          await this.updateCdnFile({ _id }, { rate: 0.7 });
          console.log('写文件');
          const { url, type } = await talOssOne({
            filePath,
            uploadTo: time,
          });
          fileItem.fileType = type;
          await this.updateCdnFile(
            { _id },
            {
              url,
              type,
              rate: 1,
              uploadNum: 1,
              uploadConsumTime: Date.now() - codeStartTime,
            },
          );

          fileItem.isUploadSuccess = true;
          console.log('传图完成，写入数据完成', url);

          if (this.checkSuccess(files)) {
            this.addFileTypes(files);
            // 删除临时文件夹
            fs.removeSync(temDir);
            console.log('删除完成');
          }
        });
      });

      // for await (const fileItem of files) {
      //   const { originalname, buffer, _id } = fileItem;
      //   const fileExtname = extname(originalname);
      //   const filePath = resolve(temDir, uuid.v1() + fileExtname);
      //   fileItem.filePath = filePath;

      //   fs.writeFileSync(filePath, buffer);

      //   await this.updateCdnFile({ _id }, { rate: 0.7 });
      //   console.log('写文件');
      //   const { url, type } = await talOssOne({
      //     filePath,
      //     uploadTo: time,
      //   });
      //   fileItem.fileType = type;
      //   await this.updateCdnFile(
      //     { _id },
      //     {
      //       url,
      //       type,
      //       rate: 1,
      //       uploadNum: 1,
      //       uploadConsumTime: Date.now() - codeStartTime,
      //     },
      //   );
      //   console.log('传图完成，写入数据完成', url);
      // }

      // this.addFileTypes(files);
      // // 删除临时文件夹
      // fs.removeSync(temDir);
      // console.log('删除完成');
    });

    console.log('返回dbArr');
    return dbArr;
  }

  checkSuccess(files) {
    const arr = files.map((item) => item.isUploadSuccess);
    if (arr.includes(false)) {
      return false;
    }
    return true;
  }

  async createCdnFiles(data) {
    return await CdnFilesCollection.insertMany(data);
  }

  async updateCdnFile(query, data) {
    return await CdnFilesCollection.findOneAndUpdate(query, data);
  }

  async findList(queryData) {
    let { page = 1, pageSize = 5 } = queryData;
    const { originalname, type, ids } = queryData;

    const params: any = {};
    if (originalname) {
      params.originalname = originalname;
    }
    if (type) {
      params.type = type;
    }
    if (ids) {
      const idsArr = ids.split(',');
      params._id = { $in: idsArr };
    }
    page = +page;
    pageSize = +pageSize;

    console.log(page, pageSize, params);
    const skipNum = (page - 1) * pageSize;
    const list = await CdnFilesCollection.find(params)
      .sort({ createTime: -1 })
      .skip(skipNum)
      .limit(pageSize);
    const count = await CdnFilesCollection.find(params).count();
    return {
      list,
      count,
    };
  }

  // 一条一条新增，避免对同一个文件新增出多条记录
  async addFileTypes(files) {
    for await (const item of files) {
      const oldFileTypes = await FileTypesCollection.find();
      const checkArr = oldFileTypes.map((item: any) => item.name);
      const { fileType } = item;
      if (!checkArr.includes(fileType)) {
        await FileTypesCollection.insertMany({
          name: fileType,
        });
      }
    }
  }

  async fileTypeList(queryData) {
    const count = await FileTypesCollection.find().count();
    const list = await FileTypesCollection.find();
    return {
      list,
      count,
    };
  }
}
