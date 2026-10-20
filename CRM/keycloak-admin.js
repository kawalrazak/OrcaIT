import { createPublicKey, randomInt, verify as verifySignature } from 'node:crypto';

const CRM_ROLES = [
  'administrator',
  'service_coordinator',
  'support_associate',
  'technician',
];

const ROLE_PRIORITY = [
  'administrator',
  'service_coordinator',
  'support_associate',
  'technician',
];

function keycloakBase() {
  return (process.env.KEYCLOAK_URL || process.env.VITE_KEYCLOAK_URL || '').replace(/\/$/, '');
}

function keycloakRealm() {
  return process.env.KEYCLOAK_REALM || process.env.VITE_KEYCLOAK_REALM || 'orcait';
}

function decodeJwtPayload(token) {
  const part = String(token || '').split('.')[1];
  if (!part) return null;
  try {
    return JSON.parse(Buffer.from(part, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}

function passwordProblems(password) {
  const missing = [];
  if (password.length < 10) missing.push('at least 10 characters');
  if (!/[a-z]/.test(password)) missing.push('a lowercase letter');
  if (!/[A-Z]/.test(password)) missing.push('an uppercase letter');
  if (!/\d/.test(password)) missing.push('a number');
  if (!/[^A-Za-z0-9]/.test(password)) missing.push('a symbol');
  return missing;
}

function normalizeAustralianPhone(phone) {
  const compact = String(phone || '').replace(/[\s()-]/g, '');
  if (!compact) return '';
  let national = compact;
  if (national.startsWith('+61')) national = `0${national.slice(3)}`;
  else if (/^61\d{9}$/.test(national)) national = `0${national.slice(2)}`;
  if (/^04\d{8}$/.test(national) || /^0[2378]\d{8}$/.test(national)) return national;
  return '';
}

function pickRole(roles) {
  const names = Array.isArray(roles) ? roles : [];
  return ROLE_PRIORITY.find((role) => names.includes(role)) || 'support_associate';
}

function displayName(user) {
  const full = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
  return full || user.username || user.email || 'User';
}

function phoneOf(user) {
  const value = user.attributes?.phone;
  if (Array.isArray(value)) return value[0] || '';
  return typeof value === 'string' ? value : '';
}

function generatePassword() {
  const lower = 'abcdefghijkmnopqrstuvwxyz';
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const digits = '23456789';
  const symbols = '!@#$%&*?';
  const all = lower + upper + digits + symbols;
  const chars = [
    lower[randomInt(lower.length)],
    upper[randomInt(upper.length)],
    digits[randomInt(digits.length)],
    symbols[randomInt(symbols.length)],
  ];
  for (let index = 4; index < 16; index += 1) chars.push(all[randomInt(all.length)]);
  for (let index = chars.length - 1; index > 0; index -= 1) {
    const swap = randomInt(index + 1);
    const current = chars[index];
    chars[index] = chars[swap];
    chars[swap] = current;
  }
  return chars.join('');
}

export function createKeycloakAdmin() {
  const base = keycloakBase();
  const realm = keycloakRealm();
  let cached = null;

  async function adminToken() {
    const username = process.env.KEYCLOAK_ADMIN_USERNAME || 'admin';
    const password = process.env.KEYCLOAK_ADMIN_PASSWORD || '';
    if (!base || !password) {
      const error = new Error('Keycloak admin is not configured.');
      error.status = 503;
      throw error;
    }
    if (cached && cached.expiresAt > Date.now() + 15000) return cached.token;

    const response = await fetch(`${base}/realms/master/protocol/openid-connect/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'password',
        client_id: 'admin-cli',
        username,
        password,
      }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.access_token) {
      cached = null;
      const error = new Error('Could not reach Keycloak to manage users.');
      error.status = 502;
      throw error;
    }
    cached = {
      token: data.access_token,
      expiresAt: Date.now() + Number(data.expires_in || 60) * 1000,
    };
    return cached.token;
  }

  async function adminFetch(pathname, options = {}) {
    const token = await adminToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    };
    return fetch(`${base}/admin/realms/${realm}${pathname}`, {
      ...options,
      headers,
    });
  }

  async function errorMessage(response, fallback) {
    const data = await response.json().catch(() => ({}));
    return data.errorMessage || data.error_description || data.error || fallback;
  }

  let jwksCache = null;

  async function signingKeys() {
    if (!base) return [];
    if (jwksCache && jwksCache.expiresAt > Date.now()) return jwksCache.keys;
    const response = await fetch(`${base}/realms/${realm}/protocol/openid-connect/certs`);
    if (!response.ok) return [];
    const data = await response.json();
    const keys = Array.isArray(data.keys) ? data.keys : [];
    jwksCache = { keys, expiresAt: Date.now() + 10 * 60 * 1000 };
    return keys;
  }

  function signatureValid(token, jwk) {
    const [header, payload, signature] = String(token).split('.');
    if (!header || !payload || !signature) return false;
    try {
      const key = createPublicKey({ key: jwk, format: 'jwk' });
      return verifySignature(
        'RSA-SHA256',
        Buffer.from(`${header}.${payload}`),
        key,
        Buffer.from(signature, 'base64url'),
      );
    } catch {
      return false;
    }
  }

  function authError(message, status) {
    const error = new Error(message);
    error.status = status;
    return error;
  }

  async function verifyAdministrator(authorization) {
    const token = String(authorization || '').replace(/^Bearer\s+/i, '').trim();
    if (!base) throw authError('Keycloak is not configured.', 503);
    if (!token) throw authError('No sign-in token was sent.', 401);
    const payload = decodeJwtPayload(token);
    if (!payload) throw authError('Sign-in token could not be read.', 401);
    if (payload.exp && payload.exp * 1000 < Date.now()) throw authError('Sign-in expired. Refresh and try again.', 401);
    const header = decodeJwtPayload(`x.${token.split('.')[0]}.x`);
    const keys = await signingKeys();
    if (!keys.length) throw authError('Keycloak certificates could not be loaded.', 502);
    const jwk = keys.find((key) => key.kid && key.kid === header?.kid) || keys.find((key) => key.kty === 'RSA');
    if (!jwk || !signatureValid(token, jwk)) throw authError('Sign-in token was rejected.', 401);
    const roles = payload.realm_access?.roles || [];
    if (!roles.includes('administrator')) throw authError('This account does not have the administrator role.', 403);
    return {
      id: payload.sub || '',
      username: payload.preferred_username || '',
      name:
        [payload.given_name, payload.family_name].filter(Boolean).join(' ') ||
        payload.preferred_username ||
        '',
    };
  }

  async function roleRep(name) {
    const response = await adminFetch(`/roles/${encodeURIComponent(name)}`);
    if (!response.ok) {
      const error = new Error(await errorMessage(response, `Role ${name} was not found.`));
      error.status = response.status;
      throw error;
    }
    return response.json();
  }

  async function realmRoles(userId) {
    const response = await adminFetch(`/users/${encodeURIComponent(userId)}/role-mappings/realm`);
    if (!response.ok) return [];
    const roles = await response.json();
    return Array.isArray(roles) ? roles : [];
  }

  function toUser(user, roles) {
    return {
      id: user.id,
      username: user.username || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      name: displayName(user),
      email: user.email || '',
      phone: phoneOf(user),
      role: pickRole(roles.map((role) => role.name || role)),
      enabled: user.enabled !== false,
      createdAt: user.createdTimestamp ? new Date(user.createdTimestamp).toISOString() : '',
    };
  }

  async function getRawUser(userId) {
    const response = await adminFetch(`/users/${encodeURIComponent(userId)}`);
    if (response.status === 404) {
      const error = new Error('User was not found.');
      error.status = 404;
      throw error;
    }
    if (!response.ok) {
      const error = new Error(await errorMessage(response, 'Could not load the user.'));
      error.status = response.status;
      throw error;
    }
    return response.json();
  }

  async function ensureUsernameEditable() {
    const response = await adminFetch('');
    if (!response.ok) return;
    const realmRep = await response.json();
    if (realmRep.editUsernameAllowed) return;
    const updated = await adminFetch('', {
      method: 'PUT',
      body: JSON.stringify({ ...realmRep, editUsernameAllowed: true }),
    });
    if (!updated.ok) {
      const error = new Error('Usernames cannot be changed yet.');
      error.status = updated.status;
      throw error;
    }
  }

  async function listUsers() {
    const response = await adminFetch('/users?max=200');
    if (!response.ok) {
      const error = new Error(await errorMessage(response, 'Could not load users.'));
      error.status = response.status;
      throw error;
    }
    const users = await response.json();
    const detailed = await Promise.all(
      (Array.isArray(users) ? users : []).map(async (user) => {
        const roles = await realmRoles(user.id);
        return toUser(user, roles);
      }),
    );
    detailed.sort((a, b) => a.name.localeCompare(b.name));
    return detailed;
  }

  async function setRole(userId, role) {
    if (!CRM_ROLES.includes(role)) {
      const error = new Error('Choose a valid role.');
      error.status = 400;
      throw error;
    }
    const current = await realmRoles(userId);
    const removable = current.filter((item) => CRM_ROLES.includes(item.name));
    if (removable.length) {
      const removed = await adminFetch(`/users/${encodeURIComponent(userId)}/role-mappings/realm`, {
        method: 'DELETE',
        body: JSON.stringify(removable),
      });
      if (!removed.ok && removed.status !== 404) {
        const error = new Error(await errorMessage(removed, 'Could not update the role.'));
        error.status = removed.status;
        throw error;
      }
    }
    const added = await adminFetch(`/users/${encodeURIComponent(userId)}/role-mappings/realm`, {
      method: 'POST',
      body: JSON.stringify([await roleRep(role)]),
    });
    if (!added.ok) {
      const error = new Error(await errorMessage(added, 'Could not assign the role.'));
      error.status = added.status;
      throw error;
    }
  }

  async function createUser(input) {
    const username = String(input.username || '').trim().toLowerCase();
    const firstName = String(input.firstName || '').trim();
    const lastName = String(input.lastName || '').trim();
    const password = String(input.password || '');
    const email = String(input.email || '').trim();
    const phone = normalizeAustralianPhone(input.phone);
    const role = input.role;

    if (!username || !firstName || !lastName || !password) {
      const error = new Error('Username, first name, last name, and password are required.');
      error.status = 400;
      throw error;
    }
    if (!/^[a-z0-9._-]+$/.test(username)) {
      const error = new Error('Username can use letters, numbers, dots, hyphens, and underscores.');
      error.status = 400;
      throw error;
    }
    const missing = passwordProblems(password);
    if (missing.length) {
      const error = new Error(`Password needs ${missing.join(', ')}.`);
      error.status = 400;
      throw error;
    }
    if (!phone) {
      const error = new Error('Enter an Australian phone number, such as 0412 345 678 or 02 9876 5432.');
      error.status = 400;
      throw error;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const error = new Error('Enter a valid email address.');
      error.status = 400;
      throw error;
    }
    if (!CRM_ROLES.includes(role)) {
      const error = new Error('Choose a valid role.');
      error.status = 400;
      throw error;
    }

    const body = {
      username,
      firstName,
      lastName,
      enabled: true,
      emailVerified: Boolean(email),
      credentials: [{ type: 'password', value: password, temporary: false }],
      attributes: { phone: [phone] },
    };
    if (email) body.email = email;

    const response = await adminFetch('/users', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    if (response.status === 409) {
      const error = new Error('That username or email is already in use.');
      error.status = 409;
      throw error;
    }
    if (!response.ok) {
      const error = new Error(await errorMessage(response, 'Could not create the user.'));
      error.status = response.status;
      throw error;
    }

    const created = await adminFetch(`/users?username=${encodeURIComponent(username)}&exact=true`);
    const matches = created.ok ? await created.json() : [];
    const user = Array.isArray(matches) ? matches.find((item) => item.username === username) : null;
    if (!user?.id) {
      const error = new Error('The user was created, but the role could not be assigned.');
      error.status = 502;
      throw error;
    }
    await setRole(user.id, role);
    const roles = await realmRoles(user.id);
    return toUser({ ...user, email, firstName, lastName, attributes: { phone: [phone] } }, roles);
  }

  async function resetPassword(userId, password) {
    const missing = passwordProblems(password);
    if (missing.length) {
      const error = new Error(`Password needs ${missing.join(', ')}.`);
      error.status = 400;
      throw error;
    }
    const response = await adminFetch(`/users/${encodeURIComponent(userId)}/reset-password`, {
      method: 'PUT',
      body: JSON.stringify({ type: 'password', value: password, temporary: false }),
    });
    if (!response.ok) {
      const error = new Error(await errorMessage(response, 'Could not reset the password.'));
      error.status = response.status;
      throw error;
    }
  }

  async function updateUser(userId, input) {
    const current = await getRawUser(userId);
    const firstName = String(input.firstName || '').trim();
    const lastName = String(input.lastName || '').trim();
    const username = String(input.username || '').trim().toLowerCase();
    const email = String(input.email || '').trim();
    const phoneInput = String(input.phone || '').trim();
    const phone = phoneInput ? normalizeAustralianPhone(phoneInput) : '';

    if (!firstName || !lastName || !username) {
      const error = new Error('First name, last name, and username are required.');
      error.status = 400;
      throw error;
    }
    if (!/^[a-z0-9._-]+$/.test(username)) {
      const error = new Error('Username can use letters, numbers, dots, hyphens, and underscores.');
      error.status = 400;
      throw error;
    }
    if (phoneInput && !phone) {
      const error = new Error('Enter an Australian phone number, such as 0412 345 678 or 02 9876 5432.');
      error.status = 400;
      throw error;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const error = new Error('Enter a valid email address.');
      error.status = 400;
      throw error;
    }
    if (username !== String(current.username || '').toLowerCase()) {
      await ensureUsernameEditable();
    }

    const attributes = { ...(current.attributes || {}) };
    if (phone) attributes.phone = [phone];
    else delete attributes.phone;

    const response = await adminFetch(`/users/${encodeURIComponent(userId)}`, {
      method: 'PUT',
      body: JSON.stringify({
        ...current,
        username,
        firstName,
        lastName,
        email,
        emailVerified: Boolean(email),
        attributes,
      }),
    });
    if (response.status === 409) {
      const error = new Error('That username or email is already in use.');
      error.status = 409;
      throw error;
    }
    if (!response.ok) {
      const error = new Error(await errorMessage(response, 'Could not update the user.'));
      error.status = response.status;
      throw error;
    }

    const fresh = await getRawUser(userId);
    const roles = await realmRoles(userId);
    return toUser(fresh, roles);
  }

  async function assignGeneratedPassword(userId) {
    const password = generatePassword();
    await resetPassword(userId, password);
    return password;
  }

  async function deleteUser(userId) {
    const response = await adminFetch(`/users/${encodeURIComponent(userId)}`, { method: 'DELETE' });
    if (response.status === 404) return;
    if (!response.ok) {
      const error = new Error(await errorMessage(response, 'Could not delete the user.'));
      error.status = response.status;
      throw error;
    }
  }

  return {
    verifyAdministrator,
    listUsers,
    createUser,
    updateUser,
    setRole,
    resetPassword,
    assignGeneratedPassword,
    deleteUser,
  };
}
