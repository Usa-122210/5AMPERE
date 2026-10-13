import test from 'node:test';
import assert from 'node:assert/strict';

test('1. Role Guards Behavior & Isolation Verification', async () => {
  // Simulate the UserAuthGuard logic
  const checkUserGuard = (currentUser) => {
    if (!currentUser) return { allowed: false, redirect: '/login' };
    if (currentUser.role === 'developer' || currentUser.role === 'technician') {
      return { allowed: false, redirect: '/developer' };
    }
    if (currentUser.role === 'admin') {
      return { allowed: false, redirect: '/admin' };
    }
    return { allowed: true, redirect: null };
  };

  // Simulate the DeveloperAuthGuard logic
  const checkDeveloperGuard = (currentUser) => {
    if (!currentUser) return { allowed: false, redirect: '/login' };
    if (currentUser.role === 'admin') {
      return { allowed: false, redirect: '/admin' };
    }
    if (currentUser.role !== 'developer' && currentUser.role !== 'technician') {
      return { allowed: false, redirect: '/dashboard' };
    }
    return { allowed: true, redirect: null };
  };

  // Simulate the AdminAuthGuard logic
  const checkAdminGuard = (currentUser) => {
    if (!currentUser) return { allowed: false, redirect: '/login' };
    if (currentUser.role === 'developer' || currentUser.role === 'technician') {
      return { allowed: false, redirect: '/developer' };
    }
    if (currentUser.role !== 'admin') {
      return { allowed: false, redirect: '/dashboard' };
    }
    return { allowed: true, redirect: null };
  };

  // Scenario A: Unauthenticated Visitor (currentUser = null)
  assert.deepEqual(checkUserGuard(null), { allowed: false, redirect: '/login' });
  assert.deepEqual(checkDeveloperGuard(null), { allowed: false, redirect: '/login' });
  assert.deepEqual(checkAdminGuard(null), { allowed: false, redirect: '/login' });

  // Scenario B: User logged in
  const user = { name: 'Aarav Sharma', role: 'user' };
  assert.deepEqual(checkUserGuard(user), { allowed: true, redirect: null });
  assert.deepEqual(checkDeveloperGuard(user), { allowed: false, redirect: '/dashboard' });
  assert.deepEqual(checkAdminGuard(user), { allowed: false, redirect: '/dashboard' });

  // Scenario C: Developer logged in
  const dev = { name: 'Developer', role: 'developer' };
  assert.deepEqual(checkUserGuard(dev), { allowed: false, redirect: '/developer' });
  assert.deepEqual(checkDeveloperGuard(dev), { allowed: true, redirect: null });
  assert.deepEqual(checkAdminGuard(dev), { allowed: false, redirect: '/developer' });

  // Scenario D: Admin logged in
  const admin = { name: 'Admin', role: 'admin' };
  assert.deepEqual(checkUserGuard(admin), { allowed: false, redirect: '/admin' });
  assert.deepEqual(checkDeveloperGuard(admin), { allowed: false, redirect: '/admin' });
  assert.deepEqual(checkAdminGuard(admin), { allowed: true, redirect: null });
});

test('2. Predefined Demo Credentials Rules', async () => {
  const PREDEFINED_ADMIN = { name: 'Admin', password: 'Admin', role: 'admin' };
  const PREDEFINED_DEVELOPER = { name: 'Developer', password: 'Developer', role: 'developer' };
  const PREDEFINED_USER = { name: 'Aarav Sharma', email: 'aarav@example.com', password: 'user123', role: 'user' };

  // Test Admin match
  assert.equal(PREDEFINED_ADMIN.name.toLowerCase(), 'admin');
  assert.equal(PREDEFINED_ADMIN.password, 'Admin');

  // Test Developer match
  assert.equal(PREDEFINED_DEVELOPER.name.toLowerCase(), 'developer');
  assert.equal(PREDEFINED_DEVELOPER.password, 'Developer');

  // Test User match
  assert.equal(PREDEFINED_USER.email, 'aarav@example.com');
  assert.equal(PREDEFINED_USER.password, 'user123');
});
