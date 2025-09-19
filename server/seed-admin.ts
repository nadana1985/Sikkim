#!/usr/bin/env node
/**
 * Script to create the initial admin user
 * Run with: npm run seed-admin
 */

import { storage } from './storage';

async function seedAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@monastery360.com';
    const adminUser = {
      id: 'initial-admin',
      email: adminEmail,
      firstName: 'System',
      lastName: 'Administrator',
      isAdmin: true,
      profileImageUrl: null,
    };
    
    const user = await storage.upsertUser(adminUser);
    console.log('✅ Admin user created/updated:', user.email);
    console.log('🔑 Admin ID:', user.id);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to seed admin user:', error);
    process.exit(1);
  }
}

seedAdmin();