#!/usr/bin/env node
// src/index.ts
import { Command } from 'commander';
import chalk from 'chalk';
import { cfg } from './utils/config';
import { loginCmd, httpCmd, tcpCmd, driveCmd, accessCmd, listCmd, reserveCmd, enableCmd } from './commands/index';

const p = new Command();
p.name('zrokui').description(chalk.cyan('zrokui') + ' — expose localhost to the internet').version('1.0.0');

// login
p.command('login').description('Authenticate with your API token')
  .requiredOption('--token <token>', 'API token from the zrokui dashboard')
  .option('--server <url>', 'Custom server URL')
  .action(o => loginCmd(o.token, o));

// logout
p.command('logout').description('Clear saved credentials')
  .action(() => { cfg.clear(); console.log(chalk.green('✓ Logged out')); });

// whoami
p.command('whoami').description('Show current user')
  .action(() => {
    if (!cfg.isLoggedIn) { console.log(chalk.gray('Not logged in')); return; }
    console.log(`Logged in as ${chalk.cyan(cfg.email)}`);
    console.log(chalk.gray(`Server: ${cfg.serverUrl}`));
  });

// enable — setup zrok environment (needed once per machine)
p.command('enable <accountToken>').description('Enable zrok environment on this machine (run once)')
  .action(t => enableCmd(t));

// http
p.command('http <port>').description('Expose a local HTTP service')
  .option('--subdomain <name>', 'Use a reserved subdomain')
  .option('--private', 'Create a private (encrypted) share')
  .action(async (port, o) => await httpCmd(Number(port), o));

// tcp
p.command('tcp <port>').description('Expose a local TCP service (DB, SSH, etc.)')
  .action(async port => await tcpCmd(Number(port)));

// drive
p.command('drive <path>').description('Share a local folder via the web')
  .action(async path => await driveCmd(path));

// access
p.command('access <shareToken>').description('Access a private share from another user')
  .action(async t => await accessCmd(t));

// list
p.command('list').description('List your active tunnels')
  .action(async () => await listCmd());

// reserve
p.command('reserve <subdomain>').description('Reserve a persistent subdomain')
  .action(async s => await reserveCmd(s));

// config
p.command('config').description('Show current config')
  .action(() => {
    console.log(`\n  Server:  ${cfg.serverUrl}`);
    console.log(`  Email:   ${cfg.email || chalk.gray('(not set)')}`);
    console.log(`  Config:  ${cfg.path}\n`);
  });

if (!process.argv.slice(2).length) p.outputHelp();
p.parse(process.argv);
