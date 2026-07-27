// ---------------------------------------------------------------------------
// Strategy Design Pattern (Assignment 3)
// Each platform owns its own validation strategy. Adding a new platform means
// adding one entry here — nothing else in the app needs to change
// (Open/Closed Principle).
// ---------------------------------------------------------------------------

export const PLATFORMS = {
  twitter: {
    key: "twitter",
    label: "Twitter / X",
    limit: 280,
    color: "#1D9BF0",
    hint: "Short and punchy. Hashtags count toward the limit.",
  },
  linkedin: {
    key: "linkedin",
    label: "LinkedIn",
    limit: 3000,
    color: "#0A66C2",
    hint: "Room for context. First 2-3 lines matter most before 'see more'.",
  },
  instagram: {
    key: "instagram",
    label: "Instagram",
    limit: 2200,
    color: "#DD2A7B",
    hint: "Caption + hashtags share the limit. Aim for 30 hashtags max.",
  },
};

// Each strategy takes the raw content string and returns:
// { valid: boolean, errors: string[] }
const strategies = {
  twitter: (content) => {
    const errors = [];
    if (!content.trim()) errors.push("Post can't be empty.");
    if (content.length > PLATFORMS.twitter.limit) {
      errors.push(`Exceeds Twitter's ${PLATFORMS.twitter.limit} character limit.`);
    }
    return { valid: errors.length === 0, errors };
  },

  linkedin: (content) => {
    const errors = [];
    if (!content.trim()) errors.push("Post can't be empty.");
    if (content.length > PLATFORMS.linkedin.limit) {
      errors.push(`Exceeds LinkedIn's ${PLATFORMS.linkedin.limit} character limit.`);
    }
    return { valid: errors.length === 0, errors };
  },

  instagram: (content) => {
    const errors = [];
    if (!content.trim()) errors.push("Caption can't be empty.");
    if (content.length > PLATFORMS.instagram.limit) {
      errors.push(`Exceeds Instagram's ${PLATFORMS.instagram.limit} character limit.`);
    }
    const hashtagCount = (content.match(/#\w+/g) || []).length;
    if (hashtagCount > 30) {
      errors.push("Instagram allows a maximum of 30 hashtags.");
    }
    return { valid: errors.length === 0, errors };
  },
};

/**
 * Dynamically select and run the strategy for a given platform.
 * This is the single call-site the rest of the app depends on.
 */
export function validateContent(platformKey, content) {
  const strategy = strategies[platformKey];
  if (!strategy) {
    return { valid: false, errors: [`No validation strategy for '${platformKey}'.`] };
  }
  return strategy(content);
}

export function getLimit(platformKey) {
  return PLATFORMS[platformKey]?.limit ?? Infinity;
}
