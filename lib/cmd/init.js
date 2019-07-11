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

    let type = yield prompt('项目类型，不填为默认(default/mobile/pc): ');

    if (type && !['mobile', 'pc'].includes(type)) {
      console.log(err);
      tip.fail('请填写正确的项目类型!');
      process.exit();
    }

    if (!type) {
      type = 'default';
    }

    return new Promise((resolve, reject) => {
      resolve({
        projectName,
        type,
      });
    });
  }).then(result => {
    const { projectName, type } = result;
    const name = projectName || `react-app-${type}`;

    let cmdStr = `
      git clone https://github.com/dyb881/react-app ${name}
      && cp -R ${path.join(__dirname, `../template/${type}/`)} ${name}/src/pages/
      && npm i mobx mobx-react
    `;

    if (type === 'mobile') {
      cmdStr += `
        && npm i @dyb881/auto-rem @dyb881/tab-bar
      `;
    }

    spinner.start();

    exec(cmdStr, err => {
      if (err) {
        console.log(err);
        tip.fail('请重新运行!');
        exec(`rm -rf ${name}`);
        process.exit();
      }

      tip.suc('初始化完成！');
      tip.info(`cd ${name} && npm install`);
      spinner.stop();
      process.exit();
    });
  });
};
