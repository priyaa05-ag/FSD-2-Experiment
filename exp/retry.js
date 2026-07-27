// ---------------------------------------------------------------------------
// Retry Logic Pattern (Assignment 4)
// Reattempts a failing async operation up to `retries` times before
// surfacing the failure to the caller.
// ---------------------------------------------------------------------------

export async function retry(fn, retries = 3, onAttempt) {
  try {
    return await fn();
  } catch (err) {
    if (onAttempt) onAttempt(retries);
    if (retries > 0) {
      return retry(fn, retries - 1, onAttempt);
    }
    throw err;
  }
}
