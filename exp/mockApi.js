// ---------------------------------------------------------------------------
// Mock API (Assignment 4)
// Simulates a network round-trip so the UI can be built against realistic
// async behavior before a real backend exists. ~20% random failure rate so
// the retry logic actually gets exercised.
// ---------------------------------------------------------------------------

export function saveDraftMock(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!data || !data.content || !data.content.trim()) {
        reject({ error: "Invalid data: draft content is empty." });
        return;
      }
      const shouldFail = Math.random() < 0.2; // simulate flaky network
      if (shouldFail) {
        reject({ error: "Network hiccup while saving draft." });
        return;
      }
      resolve({ success: true, savedAt: new Date().toISOString() });
    }, 700);
  });
}
