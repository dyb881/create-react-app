#!/usr/bin/env node

'use strict';
// 操作命令行
const exec = require('child_process').exec;
const co = require('co');
const ora = require('ora');
const prompt = require('co-prompt');
const inquirer = require('inquirer');
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

    const { type } = yield inquirer.prompt([
      {
        type: 'list',
        message: '请选择模版:',
        name: 'type',
        choices: ['default', 'mobile', 'admin'],
      },
    ]);

    return new Promise((resolve, reject) => {
      resolve({
        projectName,
        type,
      });
    });
  }).then(result => {
    const { projectName, type } = result;
    const name = projectName || `react-app-${type}`;

    let cmdStr = `git clone https://github.com/dyb881/react-app ${name}`;
    cmdStr += ` && rm -rf ${name}/src/*`;
    cmdStr += ` && cp -R ${path.join(__dirname, `../template/${type}/`)} ${name}/src/`;

    spinner.start();

    exec(cmdStr, err => {
      if (err) {
        console.log(err);
        tip.fail('请重新运行!');
        exec(`rm -rf ${name}`);
        process.exit();
      }

      tip.suc('初始化完成！');

      tip.info('执行以下命令安装依赖');
      let info = `cd ${name} && npm i && npm i mobx mobx-react`;
      if (type === 'mobile') info += ' @dyb881/auto-rem @dyb881/tab-bar';
      if (type === 'admin') info += ' react-media react-json-view @dyb881/mock-server';
      tip.info(info);

      tip.info('开发模式：npm start');
      tip.info('打包生产代码：npm run build');
      tip.info('启动模拟数据服务：npm run mock');
      tip.info('启动快捷服务：npm run serve');

      spinner.stop();
      process.exit();
    });
  });
};
