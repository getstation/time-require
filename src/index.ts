import * as path from 'path';
import * as prettyMs from 'pretty-ms';
import getTable from './table';
import requireHook from './requireHook';

const requireData: RequireData[] = [];
const TRESHOLD = .01;
const cwd = process.cwd();

function log(str: string) {
  console.log(str);
}

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

function formatTable(tableData: RequireData[], totalTime: number) {
  let counter = 0;
  const data: any[] = tableData
    .filter(elt => {
      const avg = elt.time / totalTime;
      return avg >= TRESHOLD;
    })
    .map(elt => {
      const avg = elt.time / totalTime;
      return [counter++, elt.label, prettyMs(elt.time), avg];
    });

  return getTable(data);
}

const hook = requireHook(_hooker);

export default function print() {
  const startTime = hook.hookedAt;
  const totalTime = Date.now() - startTime.getTime();
  log(formatTable(requireData, totalTime));
  // log(chalk.bold.blue("Total require(): ") + chalk.yellow(requireData.length));
  // log(chalk.bold.blue("Total time: ") + chalk.yellow(prettyMs(totalTime)));
}
