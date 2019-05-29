#!/usr/bin/env node

'use strict';
// 操作命令行
const exec = require('child_process').exec;
const co = require('co');
const ora = require('ora');
const prompt = require('co-prompt');
const chalk = require('chalk');
const path = require('path');
const tip = {
  suc: msg => console.log(chalk.green.bold(`\n ✅   ${msg}\n`)),
  fail: msg => console.log(chalk.red.bold(`\n ❌   ${msg}\n`)),
  info: msg => console.log(chalk.blue(`\n${msg}\n`)),
};
const spinner = ora('正在生成...');

module.exports = () => {
  co(function*() {
    // 处理用户输入
    const projectName = yield prompt('项目包名: ');

    const type = yield prompt('项目类型(pc/mobile): ');
    if (!['pc', 'mobile'].includes(type)) {
      tip.fail('请正确填写项目类型！');
      process.exit();
    }

    return new Promise((resolve, reject) => {
      resolve({
        projectName,
        type,
      });
    });
  }).then(result => {
    const { projectName, type } = result;
    const name = projectName || 'react-limit';

    let cmdStr = `
      git clone https://github.com/dyb881/react-limit ${name} &&
      cp -R ${name}/src/page-${type} ${name}/src/page &&
      rm -rf ${name}/src/page-pc &&
      rm -rf ${name}/src/page-mobile
    `;

    spinner.start();

    exec(cmdStr, err => {
      if (err) {
        console.log(err);
        tip.fail('请重新运行!');
        process.exit();
      }

      setReadme(result);
    });
  });
};
