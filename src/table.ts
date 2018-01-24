import { getBorderCharacters, table, TableUserConfig } from 'table';
import colors from './colors';

const config: TableUserConfig = {
  columns: {
    0: {
      alignment: 'right'
    },
    1: {
      alignment: 'left',
      width: 60
    },
    2: {
      alignment: 'right'
    },
    3: {
      alignment: 'left'
    }
  },
  border: getBorderCharacters('norc')
};

const header = [colors.bold('#'), colors.bold('module'), colors.bold('time'), colors.bold('%')];

export default function getTable(data: any[]) {
  data.unshift(header);
  return table(data, config);
}
