#!/usr/bin/env node
/**
 * Launch readiness guard.
 *
 * Run after `next build`. In production mode this is a gate, not advice: it
 * exits non-zero if unresolved placeholder content or a missing critical
 * setting would reach the public site (Rules.md §1, Phases.md §12).
 *
 *   npm run check:launch
 */

import { readdir, readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'

const PLACEHOLDER_MARKER = '[CLIENT TO PROVIDE'
const BUILD_DIR = '.next'

const appEnv = (process.env.NEXT_PUBLIC_APP_ENV ?? 'development').trim()
const isProduction = appEnv === 'production'

const failures = []
const warnings = []
const passes = []

function check(condition, message, { fatal = true } = {}) {
  if (condition) {
    passes.push(message)
  } else if (fatal && isProduction) {
    failures.push(message)
  } else {
    warnings.push(message)
  }
}

function isSet(name) {
  return Boolean(process.env[name]?.trim())
}

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
check(isProduction, 'NEXT_PUBLIC_APP_ENV is "production" (placeholders are suppressed)', {
  fatal: false,
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()
check(
  Boolean(siteUrl) && !siteUrl.includes('localhost'),
  'NEXT_PUBLIC_SITE_URL is set to the real public origin',
)
check(
  Boolean(siteUrl?.startsWith('https://')) || !isProduction,
  'NEXT_PUBLIC_SITE_URL uses https',
)
check(isSet('NEXT_PUBLIC_SUPABASE_URL'), 'Supabase URL is configured')
check(isSet('NEXT_PUBLIC_SUPABASE_ANON_KEY'), 'Supabase anon key is configured')
check(isSet('SUPABASE_SERVICE_ROLE_KEY'), 'Supabase service role key is configured')
check(isSet('RESEND_API_KEY'), 'Transactional email provider is configured')
check(isSet('MAIL_ENQUIRY_RECIPIENTS'), 'Enquiry notification recipients are configured')
check(isSet('NEXT_PUBLIC_GA4_MEASUREMENT_ID'), 'GA4 measurement ID is configured', {
  fatal: false,
})
check(isSet('NEXT_PUBLIC_WHATSAPP_NUMBER'), 'Official WhatsApp number is configured', {
  fatal: false,
})

// The service role key must never be exposed to the browser.
const publicServiceKey = Object.keys(process.env).some(
  (key) => key.startsWith('NEXT_PUBLIC_') && /SERVICE_ROLE/i.test(key),
)
check(!publicServiceKey, 'No service-role key is exposed through a NEXT_PUBLIC_ variable')

// ---------------------------------------------------------------------------
// Build output: no placeholder content may ship
// ---------------------------------------------------------------------------
async function* walk(dir) {
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return
  }
  for (const entry of entries) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'cache') continue
      yield* walk(path)
    } else if (/\.(html|rsc)$/.test(entry.name)) {
      // Only rendered output is scanned. JavaScript chunks legitimately
      // contain the marker string: it is the constant the placeholder system
      // is built from, and the admin dashboard explains it in prose. Neither
      // reaches a public page.
      yield path
    }
  }
}

let buildExists = true
try {
  await stat(BUILD_DIR)
} catch {
  buildExists = false
}

if (!buildExists) {
  warnings.push(`No ${BUILD_DIR} directory found — run "npm run build" before this check`)
} else {
  const offenders = []
  for await (const file of walk(BUILD_DIR)) {
    const contents = await readFile(file, 'utf8')
    if (contents.includes(PLACEHOLDER_MARKER)) offenders.push(file)
  }

  if (offenders.length === 0) {
    passes.push('No "[CLIENT TO PROVIDE]" placeholder content in the build output')
  } else {
    const detail = `Placeholder content found in ${offenders.length} build file(s): ${offenders
      .slice(0, 5)
      .join(', ')}${offenders.length > 5 ? ', …' : ''}`
    if (isProduction) failures.push(detail)
    else warnings.push(`${detail} (expected while NEXT_PUBLIC_APP_ENV is "${appEnv}")`)
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
const tick = '  ✓'
const warn = '  !'
const cross = '  ✗'

console.log(`\nLaunch readiness — NEXT_PUBLIC_APP_ENV="${appEnv}"\n`)
for (const message of passes) console.log(`${tick} ${message}`)
for (const message of warnings) console.log(`${warn} ${message}`)
for (const message of failures) console.log(`${cross} ${message}`)

console.log(
  `\n${passes.length} passed, ${warnings.length} warning(s), ${failures.length} failure(s)`,
)

if (failures.length > 0) {
  console.error('\nNot ready to launch. Resolve the failures above.\n')
  process.exit(1)
}

if (!isProduction) {
  console.log(
    '\nRunning in a non-production environment: warnings are informational.\n' +
      'Set NEXT_PUBLIC_APP_ENV=production to run this as a launch gate.\n',
  )
}

console.log(
  'Automated checks only. The manual items in docs/LAUNCH.md — verified legal\n' +
    'data, certificates, product data, leadership profiles, network numbers and\n' +
    'photography — still require sign-off from the company.\n',
)
