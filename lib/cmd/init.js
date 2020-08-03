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
  suc: (msg) => console.log(chalk.green.bold(`\n ✅   ${msg}\n`)),
  fail: (msg) => console.log(chalk.red.bold(`\n ❌   ${msg}\n`)),
  info: (msg) => console.log(chalk.bold(`\n${msg}\n`)),
};
const fs = require('fs-extra');

const spinner = ora('正在生成...');

module.exports = () => {
  co(function* () {
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
    ]);

    const templateTypes = {
      pc: ['admin'],
      mobile: ['tabbar'],
    };

    const templateType = templateTypes[data.device];

    if (templateType && templateType.length) {
      const { template } = yield inquirer.prompt([
        {
          type: 'list',
          message: '请选择模版:',
          name: 'template',
          choices: ['default'].concat(templateType),
        },
      ]);
      data.template = template;
    }

    const { packageType } = yield inquirer.prompt([
      {
        type: 'list',
        message: '请选择安装类型:',
        name: 'packageType',
        choices: ['yarn', 'npm'],
      },
    ]);

    data.packageType = packageType;

    return new Promise((resolve, reject) => {
      resolve(data);
    });
  }).then(({ name, device, template = 'default', packageType }) => {
    if (!name) {
      if (template === 'default') {
        name = `react-app-${device}`;
      } else {
        name = `react-app-${device}-${template}`;
      }
    }

    // 下载基础代码
    let cmdStr = `git clone https://github.com/dyb881/react-app ${name}`;

    spinner.start();

    exec(cmdStr, (err) => {
      if (err) {
        console.log(err);
        tip.fail('请重新运行!');
        process.exit();
      }

      // ------------------------------------ node 载入模版 -------------------------------------------- //

      // 删除 git
      fs.removeSync(`${name}/.git`);
      fs.removeSync(`${name}/.gitignore`);

      // 载入设备代码
      fs.copySync(path.join(__dirname, `../device/${device}/`), `${name}/src/`);

      // 载入模版
      if (template !== 'default') {
        if (template === 'admin') {
          fs.removeSync(`${name}/src/pages`);
        }

        fs.copySync(path.join(__dirname, `../template/${device}-${template}/`), `${name}/src/`);
      }

      // ------------------------------------ node 载入模版 -------------------------------------------- //

      tip.suc('初始化完成！');

      const packages = [];

      if (device === 'pc') {
        packages.push('antd');

        if (template === 'admin') {
          packages.push(
            'screenfull',
            'classnames',
            '@types/classnames',
            '@dyb881/img',
            'react-window',
            '@types/react-window'
          );
        }
      }

      if (device === 'mobile') {
        packages.push('antd-mobile', 'rc-field-form', 'ua-parser-js', '@types/ua-parser-js');

        if (template === 'tabbar') {
          packages.push('@dyb881/tab-bar');
        }
      }

      tip.info('执行以下命令安装依赖');

      let install = `cd ${name}`;
      if (packageType === 'yarn') install += ` && yarn && yarn add ${packages.join(' ')}`;
      if (packageType === 'npm') install += ` && npm i && npm i ${packages.join(' ')}`;
      tip.info(install);

      tip.info('开发模式：npm start');
      tip.info('打包生产代码：npm run build');
      tip.info('启动模拟数据服务：npm run mock');
      tip.info('启动快捷服务：npm run serve');

      if (template === 'admin') {
        tip.info('启动模拟数据服务：npm run mock');
      }

      spinner.stop();
      process.exit();
    });
  });
};
