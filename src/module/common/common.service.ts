import { Injectable } from '@nestjs/common';
import { logSwitchDto, changeLogSwitchDto } from './dto/common.dto';

import { resolve } from 'path';
import os = require('os');

// 本质上还是commonjs规范，但是前端加上import eslint不报错
import fs = require('fs-extra');
// 暂时去除掉puppeteer大，部署很慢
// import puppeteer = require('puppeteer');
import archiver = require('archiver');
import uuid = require('uuid');

import initLogData from '../../utils/initLogData';
import redisClient from '../../utils/redis';
import { CdnFilesCollection } from '../../utils/mongodb';

@Injectable()
export class CommonService {
  nodeConfigDir = resolve(__dirname, '../../../nodeConfig');
  logJsonDir = resolve(this.nodeConfigDir, 'log.json');
  redisLogDataKey = 'platform:common:logData';

  showAnswerConfig;
  constructor() {
    this.showAnswerConfig = {
      all: 1,
      hasAnswer: 2,
      noAnswer: 3,
    };
  }

  async initLogSwitch() {
    await redisClient.set(this.redisLogDataKey, JSON.stringify(initLogData));
  }

  async isLogDataRedisExist(): Promise<boolean> {
    const data = await redisClient.get(this.redisLogDataKey);
    return data === null ? false : true;
  }

  async getLogConfig(queryData: logSwitchDto): Promise<any> {
    const go = async () => {
      const value = await redisClient.get(this.redisLogDataKey);
      const logData = JSON.parse(value);
      const endType = queryData.endType || '';
      if (logData[endType]) {
        return logData[endType];
      } else {
        return logData;
      }
    };
    if (await this.isLogDataRedisExist()) {
      return await go();
    } else {
      await this.initLogSwitch();
      return await go();
    }
  }

  // 无用
  async checkAndWriteJson(): Promise<void> {
    const isDirExists = await this.checkFileIsExists(this.nodeConfigDir);
    if (isDirExists) {
      const isLogJsonDirExists = await this.checkFileIsExists(this.logJsonDir);
      if (isLogJsonDirExists) {
        try {
          fs.readJsonSync(this.logJsonDir);
        } catch {
          this.writeJson(this.logJsonDir, initLogData);
        }
      } else {
        this.writeJson(this.logJsonDir, initLogData);
      }
    } else {
      fs.mkdirSync(this.nodeConfigDir);
      this.writeJson(this.logJsonDir, initLogData);
    }
  }

  // 无用
  checkFileIsExists(dir): Promise<boolean> {
    return new Promise((resolve) => {
      fs.exists(dir, (success) => {
        if (success) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  // 无用
  writeJson(dir, data): void {
    fs.writeJsonSync(dir, data);
  }

  async changeLogConfig(bodyData: changeLogSwitchDto): Promise<any> {
    const go = async () => {
      const value = await redisClient.get(this.redisLogDataKey);
      const logData = JSON.parse(value);
      const { endType, logSwitch } = bodyData;
      if (logData.hasOwnProperty(endType)) {
        const endTypeObj = logData[endType];
        logData[endType].logSwitch = this.checkOneOrZero(logSwitch)
          ? logSwitch
          : endTypeObj.logSwitch;
      }
      return await redisClient.set(
        this.redisLogDataKey,
        JSON.stringify(logData),
      );
    };
    if (await this.isLogDataRedisExist()) {
      return await go();
    } else {
      await this.initLogSwitch();
      return await go();
    }
  }

  checkOneOrZero(data) {
    return data === 0 || data === 1;
  }

  async openBrowser() {
    // @ts-ignore
    const browser = await puppeteer.launch();
    return browser;
  }

  async closeBrowser(browser: any) {
    await browser.close();
  }

  chengeTime(timeStr: string) {
    // return timeStr.slice(5, 10).replace(/\-/g, '/');
    return timeStr.slice(5, 10);
  }

  async browserPrintPdf(browser: any, dir: string, data: any) {
    const nameConfig = {
      0: '无答案',
      1: '有答案',
    };
    const { user_list, start_time, end_time } = data;
    const { user_name } = user_list[0];
    const newStartTime = this.chengeTime(start_time);
    const newEndTime = this.chengeTime(end_time);
    const pdfName = `${user_name}-${newStartTime}-${newEndTime}-${
      nameConfig[data.isShowAnswer]
    }`;

    const hrefConfig = {
      dev: 'https://localhost:8024/ugc/wrongQuestion',
      test: 'https://dev.ai101test.com/ugc/wrongQuestion',
      pro: 'https://localhost:8024/ugc/wrongQuestion',
    };
    const page = await browser.newPage();
    console.log('新开页面成功');
    await page.goto(`${hrefConfig.test}?data=${JSON.stringify(data)}`, {
      waitUntil: 'networkidle0',
    });
    console.log('网页加载');
    console.log(`${hrefConfig.test}?data=${JSON.stringify(data)}`);
    await page.pdf({ path: `${dir}/${pdfName}.pdf`, format: 'a4' });
    console.log(`生成pdf成功`);
    console.log(`${dir}/${pdfName}.pdf`);
  }

  async sleep(time: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });
  }

  async compressedFolder(targetPath: string, outputZipFilePath: string) {
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(outputZipFilePath);
      const archive = archiver('zip', {
        zlib: { level: 9 },
      });
      output.on('close', function () {
        resolve(200);
      });
      output.on('end', function () {
        console.log('Data has been drained');
      });
      archive.on('warning', function (err: any) {
        if (err.code === 'ENOENT') {
        } else {
          throw err;
        }
      });
      archive.on('error', function (err: any) {
        throw err;
      });
      archive.pipe(output);
      archive.directory(targetPath, '学生错题集');
      archive.finalize();
    });
  }

  async generatePdf(queryData: any, res: any) {
    const queryDataData = queryData.data || '{}';

    const dir = resolve(os.tmpdir(), uuid.v4() + 'pdf');
    const zipDir = resolve(os.tmpdir(), uuid.v4() + 'pdf.zip');

    fs.removeSync(dir);
    fs.mkdirSync(dir);

    console.log(`创建文件夹成功${dir}`);

    const browser = await this.openBrowser();

    console.log('打开浏览器成功');

    const newData = JSON.parse(queryDataData) || {};
    let { user_list = [], show_answer = 1 } = newData;
    user_list = user_list ? user_list : [];
    show_answer = show_answer ? +show_answer : this.showAnswerConfig.all;

    const arr = [0, 1];
    for (let i = 0; i < user_list.length; i++) {
      const data = {
        ...newData,
        user_list: [user_list[i]],
      };
      if (show_answer === this.showAnswerConfig.all) {
        for (let j = 0; j < arr.length; j++) {
          data.isShowAnswer = arr[j];
          await this.browserPrintPdf(browser, dir, data);
        }
      } else if (show_answer === this.showAnswerConfig.hasAnswer) {
        data.isShowAnswer = arr[1];
        await this.browserPrintPdf(browser, dir, data);
      } else {
        data.isShowAnswer = arr[0];
        await this.browserPrintPdf(browser, dir, data);
      }
    }

    console.log('打印完成');
    await this.closeBrowser(browser);
    console.log('关闭浏览器');
    await this.compressedFolder(dir, zipDir);

    console.log('压缩完成');
    res.set({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'X-Requested-With',
      'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
      'Content-Disposition': 'attachment;filename=pdfs.zip',
      'Content-type': 'application/octet-stream',
    });
    const fReadStream = fs.createReadStream(zipDir);
    fReadStream.on('data', (chunk: any) => {
      res.write(chunk, 'binary');
    });
    fReadStream.on('end', () => {
      fs.removeSync(dir);
      fs.removeSync(zipDir);
      console.log('返回pdf完成');
      res.end();
    });
  }

  async getCdnFils() {
    // await CdnFilesCollection.insertMany({ url: '贾凯杰的urlxxxx1' });
    const list = await CdnFilesCollection.find();
    console.log(list);
    return list;
  }
}
