#!/usr/bin/env node
/**
 * Ensures Tailwind's native binding is present, and installs it if it is not.
 *
 * Tailwind v4 compiles CSS through a platform-specific native binary shipped as
 * an *optional* dependency. npm skips optional dependencies in several
 * situations — the long-standing bug in https://github.com/npm/cli/issues/4828,
 * an `omit=optional` setting, or a `node_modules` tree created on a different
 * platform (common with containers and devcontainer volumes). The result is a
 * build that dies inside PostCSS with a stack trace that looks like a code
 * fault but is not one.
 *
 * This script detects that state and repairs it, so `npm run dev` and
 * `npm run build` work rather than failing with an error the developer has to
 * decode. It is a no-op when the binding is already loadable.
 */

import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import process from 'node:process'

const require = createRequire(import.meta.url)

// `npm install` inside this script re-triggers the project's own postinstall.
// The nested run would exit immediately anyway (the binding is present by
// then), but the guard makes that explicit rather than incidental.
const GUARD = 'ENSURE_NATIVE_DEPS_RUNNING'
if (process.env[GUARD] === '1') process.exit(0)

/** Reads the version so the repair installs a matching binary. */
function tailwindVersion() {
  try {
    return require('tailwindcss/package.json').version
  } catch {
    return null
  }
}

/** The oxide package for the platform we are actually running on. */
function bindingPackage() {
  const { platform, arch } = process

  if (platform === 'linux') {
    // musl (Alpine) and glibc need different binaries.
    const report = process.report?.getReport()
    const isGlibc = Boolean(
      typeof report === 'object' && report !== null && 'header' in report
        ? report.header?.glibcVersionRuntime
        : false,
    )
    const libc = isGlibc ? 'gnu' : 'musl'
    if (arch === 'x64') return `@tailwindcss/oxide-linux-x64-${libc}`
    if (arch === 'arm64') return `@tailwindcss/oxide-linux-arm64-${libc}`
    if (arch === 'arm') return '@tailwindcss/oxide-linux-arm-gnueabihf'
  }

  if (platform === 'darwin') {
    if (arch === 'arm64') return '@tailwindcss/oxide-darwin-arm64'
    if (arch === 'x64') return '@tailwindcss/oxide-darwin-x64'
  }

  if (platform === 'win32') {
    if (arch === 'x64') return '@tailwindcss/oxide-win32-x64-msvc'
    if (arch === 'arm64') return '@tailwindcss/oxide-win32-arm64-msvc'
  }

  if (platform === 'freebsd' && arch === 'x64') return '@tailwindcss/oxide-freebsd-x64'

  return null
}

function bindingLoads() {
  try {
    require('@tailwindcss/oxide')
    return true
  } catch {
    return false
  }
}

if (bindingLoads()) {
  process.exit(0)
}

const pkg = bindingPackage()

if (!pkg) {
  console.error(
    `\n[ensure-native-deps] Tailwind's native binding is missing and this platform ` +
      `(${process.platform}/${process.arch}) has no known prebuilt binary.\n` +
      `Remove node_modules and package-lock.json, then run "npm install".\n`,
  )
  process.exit(1)
}

const version = tailwindVersion()
const spec = version ? `${pkg}@${version}` : pkg

console.log(
  `\n[ensure-native-deps] Tailwind's native binding is missing on ` +
    `${process.platform}/${process.arch}. Installing ${spec}…`,
)

// `--no-save` keeps package.json and the lockfile untouched: this repairs the
// local tree only, it does not change the project's declared dependencies.
const result = spawnSync(
  process.platform === 'win32' ? 'npm.cmd' : 'npm',
  ['install', spec, '--no-save', '--no-audit', '--no-fund', '--include=optional'],
  { stdio: 'inherit', env: { ...process.env, [GUARD]: '1' } },
)

if (result.status !== 0 || !bindingLoads()) {
  console.error(
    `\n[ensure-native-deps] Automatic repair failed.\n\n` +
      `Run these commands, then try again:\n\n` +
      `  rm -rf node_modules package-lock.json\n` +
      `  npm install\n\n` +
      `If you are in a container, also check that node_modules is not shared ` +
      `with the host — a tree installed on another platform will keep failing.\n`,
  )
  process.exit(1)
}

console.log('[ensure-native-deps] Native binding restored.\n')
