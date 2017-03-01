// declaration.d.ts
declare module '*.css' {
    const content: any
    export default content
}

interface Window {
    processedStore: String
}