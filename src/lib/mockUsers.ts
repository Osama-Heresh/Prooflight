
import type { AppUser } from './types';

export const mockUsers: AppUser[] = [
  {
    id: 'user001',
    name: 'Alice Wonderland',
    email: 'alice@example.com',
    role: 'site_admin',
    status: 'active',
    createdAt: new Date('2023-01-15T10:00:00Z').toISOString(),
    lastLogin: new Date('2024-05-20T10:00:00Z').toISOString(),
  },
  {
    id: 'user002',
    name: 'Bob The Builder',
    email: 'bob@example.com',
    role: 'proof_issuer',
    status: 'active',
    createdAt: new Date('2023-02-20T11:30:00Z').toISOString(),
    lastLogin: new Date('2024-05-19T11:30:00Z').toISOString(),
  },
  {
    id: 'user003',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    role: 'proof_owner',
    status: 'pending_verification',
    createdAt: new Date('2023-03-10T09:15:00Z').toISOString(),
  },
  {
    id: 'user004',
    name: 'Diana Prince',
    email: 'diana@example.com',
    role: 'proof_issuer',
    status: 'suspended',
    createdAt: new Date('2023-04-05T14:00:00Z').toISOString(),
    lastLogin: new Date('2024-03-01T14:00:00Z').toISOString(),
  },
  {
    id: 'user005',
    name: 'Edward Nygma',
    email: 'test@example.com', // Matches one of the login test accounts
    role: 'proof_owner',
    status: 'active',
    createdAt: new Date('2023-05-01T16:20:00Z').toISOString(),
    lastLogin: new Date('2024-05-18T16:20:00Z').toISOString(),
  },
  {
    id: 'user006',
    name: 'Admin Test',
    email: 'admin@example.com',
    role: 'site_admin',
    status: 'active',
    createdAt: new Date('2023-01-01T00:00:00Z').toISOString(),
    lastLogin: new Date().toISOString(),
  },
  {
    id: 'user007',
    name: 'Issuer Test',
    email: 'issuer@example.com',
    role: 'proof_issuer',
    status: 'active',
    createdAt: new Date('2023-01-02T00:00:00Z').toISOString(),
    lastLogin: new Date().toISOString(),
  },
];
