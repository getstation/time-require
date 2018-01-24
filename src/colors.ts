const isNode = process && 'type' in process && process['type'] !== 'renderer';

export interface Colors {
  bold: Function
  danger: Function
  warn: Function
  info: Function
}

function getChalk() {
  const chalk = require('chalk');
  return {
    bold: chalk.bold,
    danger: chalk.bgRed.white.bold,
    warn: chalk.bgYellow.black.bold,
    info: chalk.bgWhite.black.bold
  }
}

function pass(s: string) {
  return s;
}

function getTiza() {
  return {
    bold: pass,
    danger: pass,
    warn: pass,
    info: pass
  }
}

export const write = console.log;

export default isNode ? getChalk() : getTiza();
