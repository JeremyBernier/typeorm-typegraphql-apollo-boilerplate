const FILLER_WORDS = new Set(["the", "a"]);

// https://gist.github.com/codeguy/6684588
export function slugifySimple(text: string): string {
  return text
    .toString() // Cast to string (optional)
    .normalize("NFKD") // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
    .toLowerCase() // Convert the string to lowercase letters
    .trim() // Remove whitespace from both sides of a string (optional)
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

export function slugify(text: string): string {
  const slug = slugifySimple(text);
  const split = slug.split("-");
  if (split.length <= 1) {
    return slug;
  }
  if (FILLER_WORDS.has(split[0])) {
    split.shift();
  }
  if (split.length > 2 && split[split.length - 1] === "podcast") {
    split.pop();
  }
  return split.join("-");
}

// https://stackoverflow.com/a/1373724/3494595
export function isValidEmail(email) {
  var re =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  return re.test(email);
}

export const filterAndFormat = (obj, filterFields, formatValue) => {
  return Object.keys(obj)
    .filter((key) => key in filterFields)
    .reduce(
      (accum, cur) => ({
        ...accum,
        [cur]: formatValue(cur, obj[cur]),
      }),
      {}
    );
};
