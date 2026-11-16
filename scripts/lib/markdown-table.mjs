// Escaping for cells of GitHub Flavored Markdown (GFM) tables.
//
// A table cell ends at every `|` that is not escaped. GFM reads "backslash +
// any character" as one unit, so an escaped pipe needs an escaped backslash in
// front of it whenever the text itself contains a backslash. Escaping only the
// pipe (`a\|b` -> `a\\|b`) therefore ends the cell early. Here every Markdown
// special character, including the backslash itself, is escaped in a single
// pass, so nothing is escaped twice and the order cannot matter.

/** ASCII punctuation that Markdown or GFM interprets inside a table cell. */
const SPECIAL = /[\\`*_~[\]<>&|!#]/g;

/**
 * Any value as plain text for one table cell: line breaks and other
 * whitespace collapse to single spaces (a newline would end the row),
 * Markdown special characters are backslash-escaped.
 * `null`/`undefined` become an empty cell; numbers and other types use String().
 * @param {unknown} value
 * @returns {string}
 */
export function mdCell(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/\s+/g, ' ').trim().replace(SPECIAL, '\\$&');
}

/**
 * A short technical value (file path, identifier) as inline code in a table
 * cell. In GFM tables a pipe must be escaped even inside a code span; a
 * backslash or backtick cannot be represented safely there, so such values
 * fall back to escaped plain text.
 * @param {unknown} value
 * @returns {string}
 */
export function mdCodeCell(value) {
  if (value === null || value === undefined) return '';
  const text = String(value).replace(/\s+/g, ' ').trim();
  if (text === '' || /[`\\]/.test(text)) return mdCell(text);
  // The text has no backslash here; the class still includes it so the escaping is complete on its own.
  return '`' + text.replace(/[\\|]/g, '\\$&') + '`';
}

/**
 * The first `max` characters (code points, not UTF-16 units, so no emoji or
 * other astral character is cut in half), with "…" if something was cut.
 * Cut before escaping, so an escape sequence is never split.
 * @param {unknown} value
 * @param {number} max
 * @returns {string}
 */
export function excerpt(value, max) {
  const chars = Array.from(value === null || value === undefined ? '' : String(value));
  return chars.length > max ? chars.slice(0, max).join('') + '…' : chars.join('');
}

/**
 * One table row from already escaped cells.
 * @param {string[]} cells
 * @returns {string}
 */
export function mdRow(cells) {
  return `| ${cells.join(' | ')} |`;
}
