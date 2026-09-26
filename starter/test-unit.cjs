'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const { spawnSync } = require('node:child_process');
const { buildPrompt } = require('./app.js');
const root = path.resolve(__dirname, '..');
const canonical = fs.readFileSync(path.join(root, 'coach/START-HERE.md'), 'utf8');

test('missing or whitespace-only inputs identify each field and produce no prompt', () => {
  for (const blank of ['', '  ', '\t\r\n', '\u2003']) {
    assert.deepEqual(Object.keys(buildPrompt(canonical, blank, blank).errors), ['resume', 'job']);
    assert.equal(buildPrompt(canonical, blank, blank).prompt, null);
    assert.deepEqual(Object.keys(buildPrompt(canonical, blank, 'Fictional job').errors), ['resume']);
    assert.deepEqual(Object.keys(buildPrompt(canonical, 'Fictional resume', blank).errors), ['job']);
  }
});

test('complete canonical instructions occur once and valid input bytes are preserved', () => {
  const resume = '  Fictional Applicant\r\n\tBuilt demonstration tools.\n ';
  const job = '\n Fictional role\r\nRequirements: curious learner.  ';
  const result = buildPrompt(canonical, resume, job);
  assert.deepEqual(result.errors, {});
  assert.equal(result.prompt, canonical + '\n\n## Resume\n\n' + resume + '\n\n## Job posting\n\n' + job);
  assert.equal(result.prompt.split(canonical).length - 1, 1);
});

test('HTML-like content and Unicode remain literal prompt text', () => {
  const resume = '<script>throw new Error("fictional")</script>\nRésumé 🧪 & <b>example</b>';
  const job = '</textarea><img src=x onerror=alert(1)>\n"Research"';
  const result = buildPrompt('Instructions', resume, job);
  assert.equal(result.prompt, 'Instructions\n\n## Resume\n\n' + resume + '\n\n## Job posting\n\n' + job);
});

test('large fictional inputs are not silently truncated', () => {
  const resume = 'Fictional experience\n'.repeat(12000);
  const job = 'Fictional requirement\n'.repeat(12000);
  const result = buildPrompt(canonical, resume, job);
  assert.ok(result.prompt.endsWith(job));
  assert.equal(result.prompt.length, canonical.length + '\n\n## Resume\n\n'.length + resume.length + '\n\n## Job posting\n\n'.length + job.length);
});

test('non-string inputs are rejected instead of implicitly coercing content', () => {
  assert.throws(() => buildPrompt(canonical, null, 'Job'), TypeError);
  assert.throws(() => buildPrompt(canonical, 'Resume', 123), TypeError);
});

test('checked-in generated instructions exactly match the sole canonical source', () => {
  const context = {};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, 'instructions.js'), 'utf8'), context);
  assert.equal(context.COACH_INSTRUCTIONS, canonical);
  const check = spawnSync('python3', [path.join(__dirname, 'build.py'), '--check'], { encoding: 'utf8' });
  assert.equal(check.status, 0, check.stderr);
});

test('build detects stale and absent embeds, then reproduces changed canonical text exactly', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'coaching-starter-build-'));
  try {
    fs.mkdirSync(path.join(temp, 'starter'));
    fs.mkdirSync(path.join(temp, 'coach'));
    fs.copyFileSync(path.join(__dirname, 'build.py'), path.join(temp, 'starter/build.py'));
    const source = 'Synthetic instructions\r\n</script>\u2028Résumé 🧪\n';
    fs.writeFileSync(path.join(temp, 'coach/START-HERE.md'), source);
    const run = (...args) => spawnSync('python3', [path.join(temp, 'starter/build.py'), ...args], { encoding: 'utf8' });
    assert.equal(run('--check').status, 1);
    assert.equal(run().status, 0);
    assert.equal(run('--check').status, 0);
    fs.appendFileSync(path.join(temp, 'coach/START-HERE.md'), 'New synthetic instruction.\n');
    assert.equal(run('--check').status, 1);
    assert.equal(run().status, 0);
    const first = fs.readFileSync(path.join(temp, 'starter/instructions.js'), 'utf8');
    assert.equal(run().status, 0);
    assert.equal(fs.readFileSync(path.join(temp, 'starter/instructions.js'), 'utf8'), first);
    const context = {};
    vm.runInNewContext(first, context);
    assert.equal(context.COACH_INSTRUCTIONS, source + 'New synthetic instruction.\n');
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});
