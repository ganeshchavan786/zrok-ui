// src/utils/display.ts
import chalk from 'chalk';

const LINE = chalk.gray('─'.repeat(58));

export function banner(title: string, rows: [string, string][], footer?: string): void {
  console.log('');
  console.log(`  ${chalk.bold.white('zrokui')} ${chalk.gray('─')} ${chalk.gray(title)}`);
  console.log(`  ${LINE}`);
  for (const [label, value] of rows) {
    console.log(`  ${chalk.gray(label.padEnd(16))} ${value}`);
  }
  console.log(`  ${LINE}`);
  if (footer) console.log(`  ${chalk.gray(footer)}`);
  console.log('');
}

export function ok(msg: string)  { console.log(chalk.green(`✓ ${msg}`)); }
export function err(msg: string) { console.error(chalk.red(`✗ ${msg}`)); }
export function dim(msg: string) { console.log(chalk.gray(msg)); }
