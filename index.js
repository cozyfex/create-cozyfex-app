#!/usr/bin/env node

'use strict';

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const clc = require('cli-color');
const yargs = require('yargs');
let templateName = 'vite-react-typescript-recoil-query';
let projectName = templateName;
let gitRepo = `https://github.com/cozyfex/${templateName}`;

const argv = yargs
  .command('dir', '', {
    year: {
      description: 'The project directory name',
      alias: 'd',
      type: 'string',
    },
  })
  .option('template', {
    alias: 't',
    description: 'Tell the template name',
    type: 'string',
  })
  .help()
  .alias('help', 'h').argv;


const createProjectDirectory = (projectPath) => {
  try {
    fs.mkdirSync(projectPath);
  } catch (err) {
    if (err.code === 'EEXIST') {
      console.log(`The directory ${clc.redBright(`'${projectName}' already exist`)} in the current directory, please give it another name.`);
    } else {
      console.log(err);
    }
    process.exit(1);
  }
};

const main = async () => {
  try {
    console.log(argv);

    if (argv._.length) {
      projectName = argv._[0];
      console.log(`The project directory is ${clc.yellowBright(projectName)}.`);
    }

    if ('template' in argv) {
      switch (argv.template) {
        case 'vite-react-typescript-recoil-query':
          templateName = 'vite-react-typescript-recoil-query';
          gitRepo = `https://github.com/cozyfex/${templateName}`;
          break;
        default:
          console.log(`There is no ${clc.yellowBright(argv.template)} template.`);
          process.exit(1);
          break;
      }
    }

    const currentPath = process.cwd();
    const projectPath = path.join(currentPath, projectName);

    createProjectDirectory(projectPath);

    console.log(clc.greenBright('Downloading files...'));
    execSync(`git clone --depth 1 ${gitRepo} ${projectPath}`);

    process.chdir(projectPath);

    console.log('Installing dependencies...');
    execSync('npm install');

    console.log('Removing useless files');
    execSync('npx rimraf ./.git');
    // fs.rmdirSync(path.join(projectPath), { recursive: true });

    console.log();
    console.log(clc.greenBright('The installation is done, this is ready to use !'));

  } catch (error) {
    console.log(error);
  }
};

main().then();
