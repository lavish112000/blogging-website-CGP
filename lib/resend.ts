type ResendEmailPayload = {
  from: string;
  to: string[];
  subject: string;
  html?: string;
  text?: string;
};

export async function sendResendEmail(payload: ResendEmailPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured');
  }

  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    let detail = '';
    try {
      const text = await resp.text();
      if (text) detail = `: ${text.slice(0, 300)}`;
    } catch {
      // ignore
    }
    throw new Error(`Resend API failed (${resp.status})${detail}`);
  }
}
