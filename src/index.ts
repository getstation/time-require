import * as path from 'path';
import * as prettyMs from 'pretty-ms';
import colors, { write } from './colors';
import requireHook from './requireHook';
import getTable from './table';

const requireData: RequireData[] = [];
const TRESHOLD = .01;
const cwd = process.cwd();

export interface RequireData {
  order: number
  time: number
  label: string
  name: string
  filename: string
}

/**
 * Callback/listener used by requireHook hook to collect all the modules in their loading order
 */
function _hooker(data: any) {
  let filename = path.relative(cwd, data.filename);
  // use the shortest name
  if (filename.length > data.filename) {
    filename = data.filename;
  }
  requireData.push({
    order: requireData.length, // loading order
    time: data.startedIn, // time
    get label(){ return `${this.name} (${this.filename})` },
    name: data.name,
    filename,
  });
}

function toPercentage(value: number, numDecimals = 2) {
  const val100 = value;
  return val100.toFixed(val100 % 1 === 0 ? 0 : numDecimals) + '%'
}

function formatTable(tableData: RequireData[], totalTime: number) {
  let counter = 0;
  const data: any[] = tableData
    .filter(elt => {
      const avg = elt.time / totalTime;
      return avg >= TRESHOLD;
    })
    .map(elt => {
      const avg = elt.time / totalTime;
      let ms = prettyMs(elt.time);
      if (elt.time >= 1000) {
        ms = colors.danger(` ${ms} `);
      } else if (elt.time >= 500) {
        ms = colors.warn(` ${ms} `);
      } else {
        ms = colors.info(` ${ms} `);
      }
      return [colors.bold(counter++), elt.label, ms, toPercentage(avg)];
    });

  return getTable(data);
}

const hook = requireHook(_hooker);

export default function print() {
  const startTime = hook.hookedAt;
  const totalTime = Date.now() - startTime.getTime();
  write(formatTable(requireData, totalTime));
  write(colors.bold("Total require(): ") +requireData.length);
  write(colors.bold("Total time: ") + prettyMs(totalTime));
}
