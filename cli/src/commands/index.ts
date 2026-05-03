// src/commands/index.ts
import chalk from 'chalk';
import ora from 'ora';
import { cfg } from '../utils/config';
import { api, tunnelApi } from '../services/api';
import { sharePublic, sharePrivate, shareTcp, shareDrive, accessPrivate, setupZrokEndpoint, enableEnvironment } from '../services/zrokRunner';
import { banner, ok, err, dim } from '../utils/display';
import type { ChildProcess } from 'child_process';

// ── login ─────────────────────────────────────────────────────────────
export async function loginCmd(token: string, opts: { server?: string }): Promise<void> {
  if (opts.server) cfg.set('serverUrl', opts.server);
  const spin = ora('Verifying token...').start();
  try {
    const r = await api.get('/api/auth/me', { headers: { 'X-ZROKUI-TOKEN': token } });
    const { email } = r.data.data as { email: string };
    cfg.set('token', token);
    cfg.set('email', email);
    spin.succeed(`Logged in as ${chalk.cyan(email)}`);
    dim(`  Config saved to ${cfg.path}\n`);
  } catch { spin.fail('Invalid token'); process.exit(1); }
}

// ── http ──────────────────────────────────────────────────────────────
export async function httpCmd(port: number, opts: { subdomain?: string; private?: boolean }): Promise<void> {
  if (!cfg.isLoggedIn) { err('Not logged in. Run: zrokui login --token <token>'); process.exit(1); }
  const spin = ora(`Creating tunnel for localhost:${port}...`).start();
  let shareToken: string | null = null;
  let proc: ChildProcess | null = null;

  try {
    const res = await tunnelApi.createShare({
      shareMode: opts.private ? 'private' : 'public',
      backendMode: 'proxy',
      localPort: port,
    });
    shareToken = res.data.data.shareToken;
    spin.stop();

    if (opts.private) {
      proc = sharePrivate(`localhost:${port}`, token => {
        banner('private share', [
          ['Share token:', chalk.cyan(token)],
          ['Local port:', `localhost:${port}`],
        ], 'Share the token with trusted users: zrokui access <token>');
      });
    } else if (opts.subdomain) {
      // Reserved share
      const rRes = await tunnelApi.createReserved({ uniqueName: opts.subdomain, localPort: port });
      const rToken = rRes.data.data.token;
      const url = rRes.data.data.frontendEndpoint;
      proc = sharePublic(`localhost:${port}`, rToken, () => {
        banner('http tunnel (reserved)', [
          ['Forwarding:', `${chalk.cyan(url)} → localhost:${port}`],
          ['Subdomain:', chalk.green(opts.subdomain!)],
        ], 'Ctrl+C to stop');
      });
    } else {
      proc = sharePublic(`localhost:${port}`, undefined, url => {
        banner('http tunnel', [
          ['Forwarding:', `${chalk.cyan(url)} → localhost:${port}`],
          ['Share token:', chalk.gray(shareToken!)],
        ], 'Ctrl+C to stop');
      });
    }
  } catch (e) { spin.fail((e as Error).message); process.exit(1); }

  await graceful(proc!, shareToken);
}

// ── tcp ───────────────────────────────────────────────────────────────
export async function tcpCmd(port: number): Promise<void> {
  if (!cfg.isLoggedIn) { err('Not logged in.'); process.exit(1); }
  const spin = ora(`TCP tunnel for localhost:${port}...`).start();
  let shareToken: string | null = null;

  try {
    const res = await tunnelApi.createShare({ shareMode: 'public', backendMode: 'tcpTunnel', localPort: port });
    shareToken = res.data.data.shareToken;
    spin.stop();
    const proc = shareTcp(`localhost:${port}`, endpoint => {
      banner('tcp tunnel', [
        ['Endpoint:', chalk.cyan(endpoint)],
        ['Local:', `localhost:${port}`],
      ], 'Ctrl+C to stop');
    });
    await graceful(proc, shareToken);
  } catch (e) { spin.fail((e as Error).message); process.exit(1); }
}

// ── drive ─────────────────────────────────────────────────────────────
export async function driveCmd(path: string): Promise<void> {
  if (!cfg.isLoggedIn) { err('Not logged in.'); process.exit(1); }
  const spin = ora(`Sharing ${path}...`).start();
  let shareToken: string | null = null;

  try {
    const res = await tunnelApi.createShare({ shareMode: 'public', backendMode: 'drive', backendProxyEndpoint: path });
    shareToken = res.data.data.shareToken;
    spin.stop();
    const proc = shareDrive(path, url => {
      banner('drive share', [
        ['Public URL:', chalk.cyan(url)],
        ['Path:', path],
      ], 'Ctrl+C to stop');
    });
    await graceful(proc, shareToken);
  } catch (e) { spin.fail((e as Error).message); process.exit(1); }
}

// ── access ────────────────────────────────────────────────────────────
export async function accessCmd(shareToken: string): Promise<void> {
  if (!cfg.isLoggedIn) { err('Not logged in.'); process.exit(1); }
  console.log(chalk.gray(`\n  Connecting to private share ${shareToken}...\n`));
  const proc = accessPrivate(shareToken);
  await graceful(proc, null);
}

// ── list ──────────────────────────────────────────────────────────────
export async function listCmd(): Promise<void> {
  if (!cfg.isLoggedIn) { err('Not logged in.'); process.exit(1); }
  try {
    const r = await tunnelApi.sessions();
    const sessions = r.data.data;
    if (!sessions.length) { dim('\n  No active tunnels.\n'); return; }
    console.log('');
    console.log(chalk.bold('  Active tunnels:'));
    console.log(chalk.gray('  ' + '─'.repeat(60)));
    for (const s of sessions) {
      const url = s.publicUrl ?? chalk.yellow('private');
      console.log(`  ${chalk.cyan(String(url).padEnd(46))} → localhost:${s.localPort}  ${chalk.gray(s.protocol)}`);
    }
    console.log('');
  } catch (e) { err((e as Error).message); }
}

// ── reserve ───────────────────────────────────────────────────────────
export async function reserveCmd(subdomain: string): Promise<void> {
  if (!cfg.isLoggedIn) { err('Not logged in.'); process.exit(1); }
  const spin = ora(`Reserving ${subdomain}...`).start();
  try {
    const r = await tunnelApi.createReserved({ uniqueName: subdomain });
    spin.succeed(`Reserved: ${chalk.cyan(r.data.data.frontendEndpoint)}`);
    dim(`  Use with: zrokui http <port> --subdomain ${subdomain}\n`);
  } catch (e) { spin.fail((e as Error).message); }
}

// ── enable ────────────────────────────────────────────────────────────
export async function enableCmd(accountToken: string): Promise<void> {
  const spin = ora('Setting up zrok environment...').start();
  try {
    await setupZrokEndpoint();
    await enableEnvironment(accountToken);
    spin.succeed('Environment enabled!');
    dim('  You can now create tunnels with: zrokui http 3000\n');
  } catch (e) { spin.fail((e as Error).message); }
}

// ── graceful shutdown helper ───────────────────────────────────────────
async function graceful(proc: ChildProcess, shareToken: string | null): Promise<void> {
  async function cleanup(): Promise<void> {
    console.log(chalk.yellow('\n  Closing tunnel...'));
    proc?.kill('SIGTERM');
    if (shareToken) {
      try { await tunnelApi.deleteShare(shareToken); } catch {}
    }
    ok('Tunnel closed\n');
    process.exit(0);
  }
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  await new Promise(() => {});
}
