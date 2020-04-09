import chalk from 'chalk';
import { AxiosError } from 'axios';

export const convertToCSV = (arr: any[]) => {
  const array = [Object.keys(arr[0])].concat(arr);

  return array
    .map((it) => {
      return Object.values(it).toString();
    })
    .join('\n');
};

export const log = {
  info(entry: any) {
    console.log(chalk.cyan(entry));
  },

  success(entry: any) {
    console.log(chalk.green(entry));
  },

  warn(entry: any) {
    console.log(chalk.keyword('orange')(entry));
  },

  error(entry: any) {
    console.log(chalk.bold.red(entry));
  },
};

export const handleError = (err: AxiosError) => {
  if (err.response) {
    log.error(`Error Response ${err}`);
    log.error('====================');
    log.error('Error Response Data:');
    log.error('====================');
    log.error(JSON.stringify(err.response.data));
    log.error('====================');
  } else {
    log.error(err);
  }
};
