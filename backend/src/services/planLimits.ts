// backend/src/services/planLimits.ts

export type Plan = 'free' | 'pro' | 'team';

export interface PlanConfig {
  maxTunnels: number;
  maxReserved: number;
  bandwidthGB: number;   // per day
  tcpAllowed: boolean;
  driveAllowed: boolean;
  privateAllowed: boolean;
  customDomain: boolean;
}

export const PLANS: Record<Plan, PlanConfig> = {
  free: {
    maxTunnels: 2,
    maxReserved: 1,
    bandwidthGB: 1,
    tcpAllowed: false,
    driveAllowed: false,
    privateAllowed: true,
    customDomain: false,
  },
  pro: {
    maxTunnels: 10,
    maxReserved: 5,
    bandwidthGB: 10,
    tcpAllowed: true,
    driveAllowed: true,
    privateAllowed: true,
    customDomain: true,
  },
  team: {
    maxTunnels: 50,
    maxReserved: 20,
    bandwidthGB: 100,
    tcpAllowed: true,
    driveAllowed: true,
    privateAllowed: true,
    customDomain: true,
  },
};

export function getPlanConfig(plan: Plan): PlanConfig {
  return PLANS[plan] ?? PLANS.free;
}

export function checkTunnelAllowed(
  plan: Plan,
  backendMode: string,
  activeTunnels: number
): { allowed: boolean; reason?: string } {
  const cfg = getPlanConfig(plan);

  if (activeTunnels >= cfg.maxTunnels) {
    return { allowed: false, reason: `Max ${cfg.maxTunnels} tunnels on ${plan} plan. Upgrade to create more.` };
  }
  if (backendMode === 'tcpTunnel' && !cfg.tcpAllowed) {
    return { allowed: false, reason: `TCP tunnels require Pro plan or higher.` };
  }
  if (backendMode === 'drive' && !cfg.driveAllowed) {
    return { allowed: false, reason: `Drive sharing requires Pro plan or higher.` };
  }

  return { allowed: true };
}
