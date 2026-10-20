import Keycloak, { type KeycloakTokenParsed } from 'keycloak-js';
import type { User, UserRole } from '../types';
import { PERMISSIONS_BY_ROLE, migrateRole } from '../utils/permissions';

const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'orcait',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'orcait-crm',
});

let initPromise: Promise<boolean> | null = null;

export function keycloakConfigured() {
  return Boolean(import.meta.env.VITE_KEYCLOAK_URL);
}

export function initKeycloak() {
  if (!keycloakConfigured()) return Promise.resolve(false);
  if (!initPromise) {
    initPromise = keycloak
      .init({
        onLoad: 'check-sso',
        pkceMethod: 'S256',
        checkLoginIframe: false,
      })
      .catch((error) => {
        initPromise = null;
        throw error;
      });
  }
  return initPromise;
}

export function loginWithKeycloak() {
  return keycloak.login({
    redirectUri: `${window.location.origin}/dashboard`,
  });
}

export function logoutKeycloak() {
  return keycloak.logout({
    redirectUri: `${window.location.origin}/login`,
  });
}

const ROLE_PRIORITY: UserRole[] = [
  'administrator',
  'service_coordinator',
  'support_associate',
  'technician',
];

function roleFromToken(token: KeycloakTokenParsed | undefined): UserRole {
  const roles = token?.realm_access?.roles ?? [];
  const match = ROLE_PRIORITY.find((role) => roles.includes(role));
  return migrateRole(match ?? 'support_associate');
}

export function userFromKeycloak(): User | null {
  if (!keycloak.authenticated || !keycloak.tokenParsed) return null;
  const token = keycloak.tokenParsed;
  const role = roleFromToken(token);
  const username = token.preferred_username || token.sub || 'user';
  const name = [token.given_name, token.family_name].filter(Boolean).join(' ') || username;
  return {
    id: token.sub || username,
    username,
    name,
    email: token.email || '',
    role,
    permissions: { ...PERMISSIONS_BY_ROLE[role] },
    lastLogin: new Date().toLocaleString('en-AU', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }),
  };
}

export { keycloak };
