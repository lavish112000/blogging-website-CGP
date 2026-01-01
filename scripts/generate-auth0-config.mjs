import fs from 'node:fs';

const clientId = process.env.AUTH0_CLIENT_ID || '';
const domain = process.env.AUTH0_DOMAIN || '';

// Write a config file only used by apps that choose to load Auth0 settings from disk.
// This keeps credentials out of the repo, while letting Netlify inject env vars at build time.
const config = {
  clientId,
  domain,
};

try {
  fs.writeFileSync('auth_config.json', JSON.stringify(config, null, 2) + '\n', 'utf8');

  if (!clientId || !domain) {
    // Non-fatal: we don't want builds to fail for local/dev unless you explicitly require Auth0.
    console.warn(
      '[generate-auth0-config] Wrote auth_config.json but AUTH0_CLIENT_ID/AUTH0_DOMAIN were not fully set.'
    );
  } else {
    console.log('[generate-auth0-config] Wrote auth_config.json from env vars.');
  }
} catch (error) {
  console.warn('[generate-auth0-config] Failed to write auth_config.json:', error);
  // Non-fatal
}
