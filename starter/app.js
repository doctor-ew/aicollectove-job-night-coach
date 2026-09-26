/* Plain classic script: file:// needs no module loader or server. */
(function (root) {
  'use strict';

  function buildPrompt(instructions, resume, jobPosting) {
    if (![instructions, resume, jobPosting].every(value => typeof value === 'string')) {
      throw new TypeError('Instructions and both inputs must be strings.');
    }
    const errors = {};
    if (!resume.trim()) errors.resume = 'Add your resume before copying.';
    if (!jobPosting.trim()) errors.job = 'Add the job posting before copying.';
    return {
      errors,
      prompt: Object.keys(errors).length ? null : instructions + '\n\n## Resume\n\n' + resume + '\n\n## Job posting\n\n' + jobPosting
    };
  }

  const api = { buildPrompt };
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.CoachingStarter = api;
  if (typeof document === 'undefined') return;

  const form = document.getElementById('coaching-form');
  const resume = document.getElementById('resume');
  const job = document.getElementById('job-posting');
  const button = document.getElementById('copy-prompt');
  const status = document.getElementById('copy-status');
  const fallback = document.getElementById('manual-copy');
  const prepared = document.getElementById('prepared-prompt');
  const fields = [[resume, document.getElementById('resume-error'), 'resume'], [job, document.getElementById('job-error'), 'job']];
  let version = 0;

  function clearFeedback() {
    version += 1;
    status.textContent = '';
    fallback.hidden = true;
    prepared.value = '';
    for (const [field, error] of fields) {
      field.removeAttribute('aria-invalid');
      error.textContent = '';
      error.hidden = true;
    }
  }

  function freshPage() {
    form.reset();
    resume.value = '';
    job.value = '';
    clearFeedback();
  }
  freshPage();
  root.addEventListener('pageshow', freshPage);
  resume.addEventListener('input', clearFeedback);
  job.addEventListener('input', clearFeedback);

  document.getElementById('select-prompt').addEventListener('click', () => {
    prepared.focus();
    prepared.select();
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (button.disabled) return;
    clearFeedback();
    const result = buildPrompt(root.COACH_INSTRUCTIONS, resume.value, job.value);
    if (result.prompt === null) {
      for (const [field, error, key] of fields) {
        if (result.errors[key]) {
          field.setAttribute('aria-invalid', 'true');
          error.textContent = result.errors[key];
          error.hidden = false;
        }
      }
      status.textContent = 'Please fill in both required fields.';
      fields.find(([, , key]) => result.errors[key])[0].focus();
      return;
    }
    const copiedVersion = version;
    button.disabled = true;
    let copied = false;
    try {
      if (!root.navigator.clipboard || typeof root.navigator.clipboard.writeText !== 'function') throw new Error('Clipboard unavailable');
      await root.navigator.clipboard.writeText(result.prompt);
      copied = true;
    } catch (_) {
      // A denied or unavailable clipboard never becomes a success message.
    } finally {
      button.disabled = false;
    }
    if (version !== copiedVersion) {
      status.textContent = copied ? 'The earlier prompt was copied. Copy again to include your edits.' : 'Your inputs changed. Select Copy coaching prompt again.';
      return;
    }
    if (copied) {
      status.textContent = 'Coaching prompt copied. Paste it into a new AI conversation.';
    } else {
      prepared.value = result.prompt;
      fallback.hidden = false;
      status.textContent = 'Automatic copying is unavailable. Use the complete prompt below to copy manually.';
      prepared.focus();
      prepared.select();
    }
  });
}(globalThis));
