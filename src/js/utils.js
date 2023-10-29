export function slugify(string) {
  return string.toLowerCase().replace(/\s+/g, "-");
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
