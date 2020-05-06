import * as yargs from 'yargs';
import { handleError, log, convertToCSV } from './src/utilities';
import { writeFile } from 'fs';
import * as dotenv from 'dotenv';
import { requestSprintsForBoard, requestSprintReport } from './src/requests';
import {
  SprintReport,
  CompletedIssue,
  SprintElement,
  PuntedIssue,
  IssueEstimate,
} from './src/interfaces';

dotenv.config();

const argv = yargs
  .usage('Usage: $0 [options]')
  .example(
    '$0 -b 10911 -s 5 -v velocity.csv -e effort.csv --count-all --debug',
    'writes sprint velocity to file'
  )
  .option('board', { type: 'number' })
  .alias('b', 'board')
  .describe('b', 'The board ID (rapidViewId) of the board to query')
  .nargs('b', 1)
  .alias('s', 'sprints')
  .nargs('s', 1)
  .describe('s', 'Number of sprints to query (most recent)')
  .default('s', 5)
  .alias('v', 'velocity')
  .nargs('v', 1)
  .describe('v', 'Output file for velocity CSV data (incl path)')
  .default('v', './velocity.csv')
  .alias('e', 'effort')
  .nargs('e', 1)
  .describe('e', 'Output file for effort split CSV data (incl path)')
  .default('e', './effort.csv')
  .boolean('count-all')
  .describe(
    'count-all',
    'Disregards WHEN an issue was added to the sprint, counts ALL issues in sprint as committed'
  )
  .boolean('debug')
  .describe(
    'debug',
    'Passing the debug option writes ALL issue and sprint report information to debug.json'
  )
  .demandOption(['b'])
  .help('h')
  .alias('h', 'help').argv;

log.info(`Board ID: [${argv.b}]`);
log.info(`Number of Sprints to Retrieve: [${argv.s}]`);
log.info(`Velocity Report File: [${argv.v}]`);
log.info(`Effort Breakdown Report File: [${argv.e}]`);

const commitment = (report: SprintReport, countAll: boolean): number => {
  let allIssues = [
    ...report.contents.completedIssues.map(
      (issue: CompletedIssue): IssueEstimate => {
        return {
          key: issue.key,
          estimate: issue.currentEstimateStatistic.statFieldValue.value || 0,
        };
      }
    ),
    ...report.contents.puntedIssues.map(
      (issue: PuntedIssue): IssueEstimate => {
        return {
          key: issue.key,
          estimate: issue.currentEstimateStatistic.statFieldValue.value || 0,
        };
      }
    ),
    ...report.contents.issuesNotCompletedInCurrentSprint.map(
      (issue: CompletedIssue): IssueEstimate => {
        return {
          key: issue.key,
          estimate: issue.currentEstimateStatistic.statFieldValue.value || 0,
        };
      }
    ),
  ];

  if (!countAll) {
    allIssues = allIssues.filter(
      (issue: IssueEstimate) =>
        !report.contents.issueKeysAddedDuringSprint[issue.key]
    );
  }

  return allIssues
    .map((issue) => issue.estimate)
    .reduce((accumulator: number, current: number) => accumulator + current, 0);
};

const writeVelocityReport = (reports: SprintReport[]) => {
  const summary = reports.map((report: SprintReport) => {
    return {
      sprint: report.sprint.name,
      committed: commitment(report, !!argv['count-all']),
      completed: report.contents.completedIssuesEstimateSum.value,
    };
  });
  const csv: string = convertToCSV(summary);
  writeFile(argv.v, csv, 'utf8', (err) => {
    if (err) {
      return log.error(err);
    }
  });
};

const writeEffortBreakdownReport = (reports: SprintReport[]) => {
  const allCompleted = reports
    .map((report: SprintReport) => {
      return report.contents.completedIssues.map((issue: CompletedIssue) => {
        return {
          sprint: report.sprint.name,
          type: issue.typeName,
          estimate: issue.currentEstimateStatistic.statFieldValue.value || 0,
        };
      });
    })
    .reduce(
      (
        obj: { sprint: string; type: string; estimate: number }[],
        item: { sprint: string; type: string; estimate: number }[]
      ) => {
        return obj.concat(item);
      },
      []
    );

  const csv: string = convertToCSV(allCompleted);
  writeFile(argv.e, csv, 'utf8', (err) => {
    if (err) {
      return log.error(err);
    }
  });
};

async function main(boardId: number): Promise<void> {
  try {
    log.info(`Requesting sprints for ${boardId}...`);
    const query = await requestSprintsForBoard(boardId);

    if (!query) {
      log.error(`No sprints found`);
      return;
    }

    // Sort by most recent first, reverse to return to date order
    const sprints = query.sprints
      .sort((a: SprintElement, b: SprintElement) => b.id - a.id)
      .slice(0, argv.s)
      .reverse();

    log.info(`Retrieved [${sprints.length}] sprints...`);
    const reports: SprintReport[] = [];

    log.info(`Retrieving and processing sprint information...`);
    for (const sprint of sprints) {
      log.info('================================');
      console.info(`PROCESSING BOARD: ${boardId} and SPRINT ${sprint.name}`);
      log.info('================================');

      const report = await requestSprintReport(boardId, sprint.id);

      if (!report) {
        log.error(
          `No sprint report for board: ${boardId} and sprint ${sprint.name}`
        );
        return;
      }

      reports.push(report);
    }

    log.info(`Writing velocity reports to file...`);
    writeVelocityReport(reports);

    log.info(`Writing effort breakdown to file...`);
    writeEffortBreakdownReport(reports);

    if (argv.debug) {
      writeFile('debug.json', JSON.stringify(reports), 'utf8', (err) => {
        if (err) {
          return log.error(err);
        }
      });
    }
  } catch (err) {
    handleError(err);
  }

  log.success('Done!');
}

main(argv.b);
