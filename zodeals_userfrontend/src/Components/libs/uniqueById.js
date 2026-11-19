// The API can return the same offer in both "matched" and "panIndia" lists.
// Merge lists and keep each offer once (first occurrence wins).
export const uniqueById = (...lists) => {
  const seen = new Set();
  return lists.flat().filter((x) => {
    const id = x && (x._id || x.id);
    if (!id) return true;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
};
