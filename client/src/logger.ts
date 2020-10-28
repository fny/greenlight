import env from "./env"

export function dev(...args: any[]) {
  if (env.isDevelopment()) {
    console.log(...args)
  }
}
