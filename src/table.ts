import { table, TableUserConfig } from 'table';

const config: TableUserConfig = {
  columns: {
    0: {
      alignment: 'right'
    },
    1: {
      alignment: 'left'
    },
    2: {
      alignment: 'right'
    },
    3: {
      alignment: 'left'
    }
  }
};

export default function getTable(data: any[]) {
  return table(data, config);
}
