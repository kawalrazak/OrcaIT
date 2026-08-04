import { LAYER3_ADMINISTRATOR } from '../utils/permissions';

export const DEFAULT_ADMIN = {
  id: 'admin-1',
  username: 'admin',
  password: 'admin123',
  name: 'Administrator',
  email: 'admin@careit.com',
  phone: '',
  role: 'administrator' as const,
  permissions: LAYER3_ADMINISTRATOR,
  createdAt: new Date().toISOString(),
};

export {
  LAYER1_SUPPORT_ASSOCIATE,
  LAYER2_SERVICE_COORDINATOR,
  LAYER3_ADMINISTRATOR,
  TECHNICIAN_DEFAULT_PERMISSIONS,
  ADMIN_PERMISSIONS,
  DEFAULT_PERMISSIONS,
  PERMISSIONS_BY_ROLE,
  ROLE_LABELS,
} from '../utils/permissions';
