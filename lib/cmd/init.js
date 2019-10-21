#!/usr/bin/env node

'use strict';
// 操作命令行
const exec = require('child_process').exec;
const co = require('co');
const ora = require('ora');
const inquirer = require('inquirer');
const chalk = require('chalk');
const path = require('path');
const tip = {
  suc: msg => console.log(chalk.green.bold(`\n ✅   ${msg}\n`)),
  fail: msg => console.log(chalk.red.bold(`\n ❌   ${msg}\n`)),
  info: msg => console.log(chalk.bold(`\n${msg}\n`)),
};
const fs = require('fs-extra');

const spinner = ora('正在生成...');

module.exports = () => {
  co(function*() {
    // 处理用户输入
    const data = yield inquirer.prompt([
      {
        type: 'input',
        message: '请输入项目名称:',
        name: 'name',
      },
      {
        type: 'list',
        message: '请选择运行设备:',
        name: 'device',
        choices: ['pc', 'mobile'],
      },
      {
        type: 'list',
        message: '请选择状态管理:',
        name: 'state',
        choices: ['default', 'mobx'],
      },
    ]);

    if (data.state === 'mobx') {
      const { template } = yield inquirer.prompt([
        {
          type: 'list',
          message: '请选择模版:',
          name: 'template',
          choices: ['default'].concat(
            {
              pc: ['admin'],
              mobile: ['tabs'],
            }[data.device]
          ),
        },
      ]);
      data.template = template;
    }

    return new Promise((resolve, reject) => {
      resolve(data);
    });
  }).then(({ name, device, state, template }) => {
    template = template || 'default';
    name = name || `react-app-${device}-${state}-${template}`;

    // 下载基础代码
    let cmdStr = `git clone https://github.com/dyb881/react-app ${name}`;

    spinner.start();

    exec(cmdStr, err => {
      if (err) {
        console.log(err);
        tip.fail('请重新运行!');
        fs.removeSync(name);
        process.exit();
      }

      // ------------------------------------ node 载入模版 -------------------------------------------- //

      // 删除 git
      fs.removeSync(`${name}/.git`);
      fs.removeSync(`${name}/.gitignore`);

      // 载入状态管理
      if (state !== 'default') {
        fs.copySync(path.join(__dirname, `../state/${state}/`), `${name}/src/`);
      }

      // 载入设备代码
      fs.copySync(path.join(__dirname, `../device/${device}/`), `${name}/src/`);

      // 载入模版
      if (template !== 'default') {
        fs.removeSync(`${name}/src/pages/*`);
        fs.copySync(path.join(__dirname, `../template/${device}-${state}-${template}/`), `${name}/src/`);
      }

      // ------------------------------------ node 载入模版 -------------------------------------------- //

      tip.suc('初始化完成！');

      const packages = [];

      if (device === 'pc') packages.push('react-media', 'classnames', '@types/classnames');
      if (device === 'mobile') packages.push('@dyb881/auto-rem');

      if (state === 'mobx') {
        packages.push('mobx', 'mobx-react');
        if (template === 'tabs') packages.push('@dyb881/tab-bar');
      }

      tip.info('执行以下命令安装依赖');
      tip.info(`cd ${name} && npm i && npm i ${packages.join(' ')}`);
      tip.info('or');
      tip.info(`cd ${name} && yarn && yarn add ${packages.join(' ')}`);

      tip.info('开发模式：npm start');
      tip.info('打包生产代码：npm run build');
      tip.info('启动模拟数据服务：npm run mock');
      tip.info('启动快捷服务：npm run serve');

      spinner.stop();
      process.exit();
    });
  });
};
