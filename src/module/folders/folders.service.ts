import { Injectable } from '@nestjs/common';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';

import { FoldersCollection, CdnFilesCollection } from '../../utils/mongodb';

@Injectable()
export class FoldersService {
  async create(createFolderDto: CreateFolderDto) {
    const { name = '', describe = '' } = createFolderDto;

    // const params: any = {};
    // if (name) {
    //   params.name = name;
    // }

    // const one = await this.findOneByObj(params);
    // if (one) {
    //   return '新增失败';
    // } else {
    return await FoldersCollection.insertMany({
      name,
      describe,
    });
    // }
  }

  async findAll(queryData) {
    let { page = 1, pageSize = 5 } = queryData;
    const { name } = queryData;

    page = page ? +page : 1;
    pageSize = pageSize ? +pageSize : 5;

    const params: CreateFolderDto = {};
    if (name) {
      params.name = name;
    }

    const count = await FoldersCollection.find(params).count();
    const list = await FoldersCollection.find(params)
      .sort({ createTime: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return {
      list,
      count,
    };
  }

  async findOneByObj(obj) {
    return await FoldersCollection.find(obj);
  }

  async findOne(id) {
    return await FoldersCollection.find({ _id: id });
  }

  async update(id: string, updateFolderDto: UpdateFolderDto) {
    const { name } = updateFolderDto;
    try {
      const data = await this.findOneByObj({
        _id: id,
      });
      if (data) {
        return await FoldersCollection.update(
          { _id: id },
          {
            $set: {
              name,
              updateTime: Date.now(),
            },
          },
        );
      } else {
        return '资源不存在';
      }
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    const list = await CdnFilesCollection.find({ folderId: id });
    if (list.length) {
      return '不可删除';
    } else {
      return await FoldersCollection.remove({ _id: id });
    }
  }
}
