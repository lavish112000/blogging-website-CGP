import { sendResendEmail } from '@/lib/resend';

function requireFrom(): string {
  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) {
    throw new Error('RESEND_FROM_EMAIL is not configured');
  }
  return from;
}

export async function sendConfirmSubscriptionEmail(opts: {
  to: string;
  confirmUrl: string;
  manageUrl: string;
}): Promise<void> {
  const from = requireFrom();

  const subject = 'Confirm your subscription';
  const text = `Confirm your subscription: ${opts.confirmUrl}\n\nManage subscription: ${opts.manageUrl}`;
  const html = `
    <div style="font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial;line-height:1.6">
      <h2>Confirm your subscription</h2>
      <p>Please confirm your email to start receiving updates.</p>
      <p><a href="${opts.confirmUrl}">Confirm subscription</a></p>
      <hr />
      <p style="font-size:12px;color:#666">You can manage your subscription here: <a href="${opts.manageUrl}">${opts.manageUrl}</a></p>
    </div>
  `;

  await sendResendEmail({
    from,
    to: [opts.to],
    subject,
    text,
    html,
  });
}

export async function sendUnsubscribedEmail(opts: { to: string; resubscribeUrl: string }): Promise<void> {
  const from = requireFrom();

  const subject = 'You are unsubscribed';
  const text = `You have been unsubscribed. Resubscribe: ${opts.resubscribeUrl}`;
  const html = `
    <div style="font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial;line-height:1.6">
      <h2>Unsubscribed</h2>
      <p>You have been unsubscribed. If this was a mistake, you can resubscribe:</p>
      <p><a href="${opts.resubscribeUrl}">Resubscribe</a></p>
    </div>
  `;

  await sendResendEmail({
    from,
    to: [opts.to],
    subject,
    text,
    html,
  });
}
