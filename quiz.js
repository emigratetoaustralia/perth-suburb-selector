/**
 * quiz_v1.js — Perth Suburb Selector
 * Purely functional. No state. index.html owns all UI state.
 * Depends on suburbs.js being loaded first (SUBURBS array must be in scope).
 *
 * Public API:
 *   runQuiz(budget, character, transport)  → sorted suburb array
 *   applyToggles(pool, coastalFilter, sortMode) → filtered + re-sorted array
 *
 * budget:       "below" | "above"
 * character:    "quiet" | "lively"
 * transport:    "car"   | "pt"
 * coastalFilter:"all"   | "coastal"
 * sortMode:     "recommended" | "proximity" | "affordability"
 */

// ---------------------------------------------------------------------------
// Internal constants
// ---------------------------------------------------------------------------

/** Numeric rank for PT sort. Lower = sorted first. */
const PT_RANK = {
  good:     1,
  moderate: 2,
  car:      3,
};

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Filter SUBURBS to the two hard quiz dimensions.
 * Transport is NOT a filter condition — it affects sort only.
 *
 * @param {string} budget    "below" | "above"
 * @param {string} character "quiet" | "lively"
 * @returns {object[]} Shallow copy of matching suburb objects.
 */
function filterSuburbs(budget, character) {
  return SUBURBS.filter(
    (s) => s.budget === budget && s.character === character
  );
}

/**
 * Sort a suburb pool based on the transport answer.
 *
 * "pt"  → primary: PT rank ascending (good first),
 *          secondary: cbd_km ascending.
 *
 * "car" → primary: cbd_km ascending.
 *         (Budget band is identical across the pool since filter already
 *          matched on budget, so a value-based primary would be a no-op.)
 *
 * Does NOT mutate the input array.
 *
 * @param {object[]} pool      Filtered suburb array.
 * @param {string}   transport "car" | "pt"
 * @returns {object[]} New sorted array.
 */
function sortSuburbs(pool, transport) {
  const sorted = [...pool];

  if (transport === "pt") {
    sorted.sort((a, b) => {
      const rankDiff = PT_RANK[a.pt] - PT_RANK[b.pt];
      if (rankDiff !== 0) return rankDiff;
      return a.cbd_km - b.cbd_km;
    });
  } else {
    // "car" — sort by CBD proximity
    sorted.sort((a, b) => a.cbd_km - b.cbd_km);
  }

  return sorted;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Run the full quiz: filter then sort.
 * This is the primary entry point called on quiz completion.
 *
 * @param {string} budget    "below" | "above"
 * @param {string} character "quiet" | "lively"
 * @param {string} transport "car"   | "pt"
 * @returns {object[]} Sorted suburb array ready for display.
 */
function runQuiz(budget, character, transport) {
  const pool = filterSuburbs(budget, character);
  return sortSuburbs(pool, transport);
}

/**
 * Apply post-result toggles to a suburb pool.
 * Called every time either toggle changes. index.html passes the
 * original sorted pool from runQuiz() — this function does not
 * re-run the filter or the transport sort.
 *
 * Operations applied in order:
 *   1. Coastal filter (Toggle 1)
 *   2. Sort re-order  (Toggle 2)
 *
 * Does NOT mutate the input array.
 *
 * @param {object[]} pool          Full sorted pool from runQuiz().
 * @param {string}   coastalFilter "all" | "coastal"
 * @param {string}   sortMode      "recommended" | "proximity" | "affordability"
 *                                 "recommended" preserves the runQuiz() order,
 *                                 which reflects the user's transport answer.
 * @returns {object[]} New array with toggles applied.
 */
function applyToggles(pool, coastalFilter, sortMode) {
  // Step 1 — Coastal filter
  let result = coastalFilter === "coastal"
    ? pool.filter((s) => s.coastal === true)
    : [...pool];

  // Step 2 — Sort re-order ("recommended" keeps runQuiz() order untouched)
  if (sortMode === "proximity") {
    result.sort((a, b) => a.cbd_km - b.cbd_km);
  } else if (sortMode === "affordability") {
    result.sort((a, b) => {
      // Sparse floors (null) treated as highest cost → sent to bottom
      const floorA = a.rent_3br.floor ?? Infinity;
      const floorB = b.rent_3br.floor ?? Infinity;
      return floorA - floorB;
    });
  }

  return result;
}
