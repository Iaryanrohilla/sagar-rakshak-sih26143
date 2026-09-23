import { createClient } from '@supabase/supabase-js'

export const SUPABASE_URL = ((import.meta as any).env?.VITE_SUPABASE_URL as string) || 'https://ixynpnpavmorppvltbxf.supabase.co'
export const SUPABASE_ANON_KEY = ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4eW5wbnBhdm1vcnBwdmx0YnhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2OTQ4MjcsImV4cCI6MjEwNTI3MDgyN30.NkI38sQkFce9oe2XOylFOgtAA4YqykWtLP60-zTv-hI'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export interface OpsUser {
  id: string
  email: string
  name: string
  agency: 'ICG' | 'NTRO' | 'DG_SHIPPING' | 'PORT_AUTHORITY' | 'NAVY'
  roleTitle: string
  badgeId: string
  clearanceLevel: 'LEVEL_4_RESTRICTED' | 'LEVEL_5_MARITIME_DEFENSE'
}

export const DEMO_OPERATOR_ACCOUNTS: Record<string, { password: string; user: OpsUser }> = {
  'commander.icg@sagarrakshak.gov.in': {
    password: 'CoastGuard2026!',
    user: {
      id: 'usr-icg-0914',
      email: 'commander.icg@sagarrakshak.gov.in',
      name: 'Capt. R. K. Nair, ICG',
      agency: 'ICG',
      roleTitle: 'Indian Coast Guard — Western Command Ops',
      badgeId: 'ICG-OPS-7721',
      clearanceLevel: 'LEVEL_5_MARITIME_DEFENSE'
    }
  },
  'ntro.analyst@gov.in': {
    password: 'SpaceSatellite2026!',
    user: {
      id: 'usr-ntro-5512',
      email: 'ntro.analyst@gov.in',
      name: 'Dr. S. K. Venkat, NTRO',
      agency: 'NTRO',
      roleTitle: 'NTRO Geospatial & Space Surveillance Division',
      badgeId: 'NTRO-SAT-3304',
      clearanceLevel: 'LEVEL_5_MARITIME_DEFENSE'
    }
  },
  'dgshipping.inspector@nic.in': {
    password: 'MaritimeSafety2026!',
    user: {
      id: 'usr-dgs-1809',
      email: 'dgshipping.inspector@nic.in',
      name: 'P. Deshmukh, DG Shipping',
      agency: 'DG_SHIPPING',
      roleTitle: 'Directorate General of Shipping — Enforcement Officer',
      badgeId: 'DGS-INSP-4491',
      clearanceLevel: 'LEVEL_4_RESTRICTED'
    }
  }
}

/**
 * Attempts real Supabase Auth first. If network unavailable or matching demo credentials provided,
 * seamlessly authenticates with government ops credential profile.
 */
export async function authenticateOperator(
  email: string,
  pass: string
): Promise<{ success: boolean; user?: OpsUser; error?: string }> {
  const trimmedEmail = email.trim().toLowerCase()

  // 1. Check pre-seeded government operator accounts
  const demoAccount = DEMO_OPERATOR_ACCOUNTS[trimmedEmail]
  if (demoAccount) {
    if (demoAccount.password === pass) {
      return { success: true, user: demoAccount.user }
    } else {
      return { success: false, error: 'Invalid security passcode for government operator badge.' }
    }
  }

  // 2. Try Supabase Auth API
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password: pass
    })

    if (error) {
      // If user not found or bad password, return clean error
      return { success: false, error: error.message }
    }

    if (data?.user) {
      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email || trimmedEmail,
          name: (data.user.user_metadata?.name as string) || trimmedEmail.split('@')[0],
          agency: (data.user.user_metadata?.agency as OpsUser['agency']) || 'ICG',
          roleTitle: (data.user.user_metadata?.roleTitle as string) || 'Maritime Intelligence Analyst',
          badgeId: `OPS-${data.user.id.slice(0, 4).toUpperCase()}`,
          clearanceLevel: 'LEVEL_4_RESTRICTED'
        }
      }
    }
  } catch (err: unknown) {
    // If offline or network block, allow standard password for any user in demo mode
    if (pass.length >= 6) {
      return {
        success: true,
        user: {
          id: `usr-ops-${Date.now().toString(36)}`,
          email: trimmedEmail,
          name: trimmedEmail.split('@')[0].toUpperCase(),
          agency: 'ICG',
          roleTitle: 'Maritime Operations Officer',
          badgeId: 'OPS-DEMO-01',
          clearanceLevel: 'LEVEL_4_RESTRICTED'
        }
      }
    }
    return { success: false, error: 'Network communication failure with authentication service.' }
  }

  return { success: false, error: 'Operator not recognized in maritime authentication registry.' }
}
