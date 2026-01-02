import crypto from 'crypto';

function requireSecret(): string {
  const secret = process.env.SUBSCRIBER_TOKEN_SECRET;
  if (!secret) {
    throw new Error('SUBSCRIBER_TOKEN_SECRET is not configured');
  }
  return secret;
}

export function sha256(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

export function generateConfirmToken(ttlHours: number = 48): {
  token: string;
  tokenHash: string;
  expiresAt: Date;
} {
  const token = crypto.randomBytes(32).toString('base64url');
  const tokenHash = sha256(token);
  const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000);
  return { token, tokenHash, expiresAt };
}

export function createManageToken(subscriberId: string): string {
  const secret = requireSecret();
  const sig = crypto.createHmac('sha256', secret).update(subscriberId).digest('base64url');
  return `${subscriberId}.${sig}`;
}

export function verifyManageToken(token: string): string | null {
  const secret = requireSecret();
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [subscriberId, providedSig] = parts;
  if (!subscriberId || !providedSig) return null;

  const expectedSig = crypto.createHmac('sha256', secret).update(subscriberId).digest('base64url');

  try {
    const a = Buffer.from(providedSig);
    const b = Buffer.from(expectedSig);
    if (a.length !== b.length) return null;
    if (!crypto.timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }

  return subscriberId;
}
