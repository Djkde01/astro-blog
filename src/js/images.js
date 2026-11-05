const images = import.meta.glob("/src/assets/images/*.webp", { eager: true });

export function resolveImage(src) {
  const image = images[src];
  if (!image) throw new Error(`Image not found under src/assets/images: ${src}`);
  return image.default;
}

export function socialImageUrl(src) {
  return new URL(resolveImage(src).src, import.meta.env.SITE).href;
}
