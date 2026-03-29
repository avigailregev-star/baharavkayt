/**
 * Compatibility shim — keeps the same `base44.entities / base44.auth` interface
 * that all pages already use, but backed entirely by Supabase.
 */
import { supabase } from './supabaseClient';
import { entities } from './entities';

const auth = {
  async me() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw error ?? new Error('Not authenticated');
    return user;
  },

  async logout(redirectUrl) {
    await supabase.auth.signOut();
    window.location.href = redirectUrl ?? '/';
  },

  redirectToLogin(redirectUrl) {
    const dest = redirectUrl
      ? `/admin-login?redirect=${encodeURIComponent(redirectUrl)}`
      : '/admin-login';
    window.location.href = dest;
  },
};

// no-op — Base44 activity logging is no longer needed
const appLogs = {
  logUserInApp: () => Promise.resolve(),
};

export const base44 = { entities, auth, appLogs };
