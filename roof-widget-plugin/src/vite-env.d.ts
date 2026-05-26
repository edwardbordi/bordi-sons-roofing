/// <reference types="vite/client" />

// Tailwind-processed CSS imported as a string, injected into the Shadow DOM.
declare module "*.css?inline" {
  const css: string;
  export default css;
}
