// src/env.d.ts
/// <reference types="astro/client" />

declare module "@theme/*" {
  type ComponentType<T = any>
    = | import("astro").AstroComponentFactory<T>
      | import("vue").DefineComponent<T>
      | import("react").FunctionComponent<T>
      | import("preact").FunctionalComponent<T>
      | import("solid-js").Component<T>
      | import("svelte").SvelteComponent<T>;

  const component: ComponentType;
  export default component;
}
