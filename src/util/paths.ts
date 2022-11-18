import { realpathSync, existsSync } from 'fs'
import { resolve as resolvePath } from 'path'

const rootDir = realpathSync(process.cwd())

export const resolve = (relativePath: string): string =>
  resolvePath(rootDir, relativePath)

export const exists = (relativePath: string): boolean =>
  existsSync(resolve(relativePath))
