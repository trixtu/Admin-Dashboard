export function slugString(name: string) {
  let url = "";
  const diacriticsMap: { [key: string]: string } = {
    // Română
    "ă": "a",
    "â": "a",
    "î": "i",
    "ș": "s",
    "ş": "s",
    "ț": "t",
    "ţ": "t",
    // Germană
    "ä": "ae",
    "ö": "oe",
    "ü": "ue",
    "ß": "ss",
    // Alte caractere comune
    "é": "e",
    "è": "e",
    "ê": "e",
    "ç": "c",
    "ñ": "n",
  };

  url = name
    .trim()
    .toLowerCase()
    .split("")
    .map(char => diacriticsMap[char] || char) // Înlocuiește caracterele cu echivalentele lor
    .join("")
    .replace(/[`~!@#$%^&*()_|+\=?;:'",.<>{}\[\]\\\/]/gi, "") // Elimină caracterele speciale
    .replace(/\s+/g, "-"); // Înlocuiește spațiile cu "-"

  return url;
}