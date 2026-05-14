declare module '*.png'
declare module '*.woff'
declare module '*.woff2'
declare module '*.svg' {
  const content: string
  export default content
}
