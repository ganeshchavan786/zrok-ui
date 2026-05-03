// src/services/zrokRunner.ts
import { spawn, ChildProcess } from 'child_process';
import chalk from 'chalk';
import { cfg } from '../utils/config';

const DEBUG = !!process.env.ZROKUI_DEBUG;

function log(line: string) {
  if (DEBUG) console.log(chalk.gray(`  [zrok] ${line}`));
}

function spawnZrok(args: string[], onLine?: (l: string) => void): ChildProcess {
  const proc = spawn('zrok', args, { stdio: ['ignore', 'pipe', 'pipe'] });
  proc.stdout?.on('data', (d: Buffer) => { const l = d.toString().trim(); if (l) { log(l); onLine?.(l); } });
  proc.stderr?.on('data', (d: Buffer) => { const l = d.toString().trim(); if (l) { log(l); onLine?.(l); } });
  proc.on('exit', code => { if (code && code !== 0) console.error(chalk.red(`\n✗ zrok exited (${code})`)); });
  return proc;
}

// Configure zrok to point at our server
export async function setupZrokEndpoint(): Promise<void> {
  return new Promise((res, rej) => {
    const p = spawn('zrok', ['config', 'set', 'apiEndpoint', cfg.serverUrl.replace('/api', '')], { stdio: 'inherit' });
    p.on('exit', c => c === 0 ? res() : rej(new Error('zrok config failed')));
  });
}

// Enable environment using zrok account token
export async function enableEnvironment(accountToken: string): Promise<void> {
  return new Promise((res, rej) => {
    const p = spawn('zrok', ['enable', accountToken], { stdio: 'inherit' });
    p.on('exit', c => c === 0 ? res() : rej(new Error('zrok enable failed')));
  });
}

// Public HTTP share
export function sharePublic(endpoint: string, reservedToken?: string, onUrl?: (url: string) => void): ChildProcess {
  const args = ['share', 'public', endpoint];
  if (reservedToken) args.push('--share-token', reservedToken);
  return spawnZrok(args, line => {
    const m = line.match(/https?:\/\/[^\s]+/);
    if (m) onUrl?.(m[0]);
  });
}

// Private share
export function sharePrivate(endpoint: string, onToken?: (t: string) => void): ChildProcess {
  return spawnZrok(['share', 'private', endpoint], line => {
    const m = line.match(/share token[:\s]+([a-zA-Z0-9]+)/i);
    if (m) onToken?.(m[1]);
  });
}

// TCP tunnel
export function shareTcp(endpoint: string, onEndpoint?: (e: string) => void): ChildProcess {
  return spawnZrok(['share', 'public', '--backend-mode', 'tcpTunnel', endpoint], line => {
    const m = line.match(/[a-zA-Z0-9.-]+:\d+/);
    if (m) onEndpoint?.(m[0]);
  });
}

// Drive/file share
export function shareDrive(path: string, onUrl?: (url: string) => void): ChildProcess {
  return spawnZrok(['share', 'public', '--backend-mode', 'drive', path], line => {
    const m = line.match(/https?:\/\/[^\s]+/);
    if (m) onUrl?.(m[0]);
  });
}

// Access a private share
export function accessPrivate(shareToken: string): ChildProcess {
  return spawnZrok(['access', 'private', shareToken], line => {
    const m = line.match(/listening on ([^\s]+)/i);
    if (m) console.log(chalk.green(`\n✓ Listening at ${m[1]}\n`));
  });
}
