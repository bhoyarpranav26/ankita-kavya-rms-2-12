// Lightweight shims to quiet TypeScript in environments without @types/react installed
declare module 'react' {
  const React: any
  export = React
}

declare module 'react/jsx-runtime' {
  export function jsx(type: any, props?: any, key?: any): any
  export function jsxs(type: any, props?: any, key?: any): any
  export function jsxDEV(type: any, props?: any, key?: any): any
  export const Fragment: any
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any
  }
}

// allow react-icons imports without types
declare module 'react-icons/*' {
  const content: any
  export default content
}
