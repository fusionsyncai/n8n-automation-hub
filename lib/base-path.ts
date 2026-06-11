export const BASE_PATH = "/workflow";

/** Prefix a public asset path with the configured basePath for raw <a>/href use. */
export function assetPath(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${normalized}`;
}
