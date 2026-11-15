import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {APP_VERSION} from '../lib/version.mjs';

test('App-Version, package.json und CHANGELOG stimmen überein', async () => {
  const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
  assert.equal(APP_VERSION, pkg.version);
  assert.match(APP_VERSION, /^\d+\.\d+\.\d+$/);
  const changelog = await readFile(new URL('../CHANGELOG.md', import.meta.url), 'utf8');
  assert.ok(changelog.includes(`## [${APP_VERSION}]`), 'CHANGELOG.md braucht einen Eintrag für ' + APP_VERSION);
});
