// #region agent log
// Debug logging for Angular version resolution during install
const endpoint = 'http://127.0.0.1:7242/ingest/8d00b85d-cd79-47d4-a1f8-1cc938d3a3e9';
const sessionId = 'debug-session';
const runId = `npm-preinstall-${Date.now()}`;
const hypothesisId = 'H1';

async function log(data) {
  try {
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        runId,
        hypothesisId,
        location: 'scripts/log-angular-versions.js',
        message: 'npm version info',
        data,
        timestamp: Date.now(),
      }),
    });
  } catch {
    // Ignore logging failures to not block install
  }
}

async function main() {
  const exec = async (cmd) => {
    const { execSync } = await import('node:child_process');
    return execSync(cmd, { encoding: 'utf8' }).trim();
  };

  const npmVersion = await exec('npm -v');
  const nodeVersion = process.version;
  let coreVersions = '';
  let animationsVersions = '';

  try {
    coreVersions = await exec('npm view @angular/core versions --json');
    animationsVersions = await exec('npm view @angular/animations versions --json');
  } catch (err) {
    await log({ error: String(err) });
    return;
  }

  await log({
    npmVersion,
    nodeVersion,
    resolvedCoreRange: process.env.npm_package_dependencies__angular_core,
    resolvedAnimationsRange: process.env.npm_package_dependencies__angular_animations,
    coreVersions,
    animationsVersions,
    envRegistry: process.env.npm_config_registry || 'default',
  });
}

main().catch(() => {});
// #endregion agent log
