/// <reference types="astro/client" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  glob<T = any>(
    pattern: string,
    options?: { eager?: boolean; as?: string }
  ): Record<string, T> | Record<string, () => Promise<T>>;
}
