import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

const generateId = () => crypto.randomBytes(12).toString('hex');

// Pre-seeded demo user and applications
const getSeedData = () => {
  const demoUserId = generateId();
  const demoUser = {
    _id: demoUserId,
    name: 'Alex Rivera',
    email: 'student@example.com',
    passwordHash: bcrypt.hashSync('demo1234', 10),
    createdAt: new Date('2026-01-10T10:00:00Z').toISOString(),
    updatedAt: new Date('2026-01-10T10:00:00Z').toISOString()
  };

  const app1Id = generateId();
  const app2Id = generateId();
  const app3Id = generateId();
  const app4Id = generateId();

  const applications = [
    {
      _id: app1Id,
      userId: demoUserId,
      companyName: 'Google',
      role: 'Software Engineering Intern (Summer 2026)',
      applicationDate: new Date('2026-01-15T09:00:00Z').toISOString(),
      stage: 'Interview',
      notes: 'Passed initial resume screen. Technical interview scheduled for next week.',
      followUpDate: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days in future
      createdAt: new Date('2026-01-15T09:00:00Z').toISOString(),
      updatedAt: new Date('2026-01-20T14:30:00Z').toISOString()
    },
    {
      _id: app2Id,
      userId: demoUserId,
      companyName: 'Stripe',
      role: 'Frontend Engineering Intern',
      applicationDate: new Date('2026-01-18T11:00:00Z').toISOString(),
      stage: 'Offer',
      notes: 'Received official offer letter! Reviewing compensation package.',
      followUpDate: null,
      createdAt: new Date('2026-01-18T11:00:00Z').toISOString(),
      updatedAt: new Date('2026-02-01T16:00:00Z').toISOString()
    },
    {
      _id: app3Id,
      userId: demoUserId,
      companyName: 'Microsoft',
      role: 'Product Management Intern',
      applicationDate: new Date('2026-01-22T14:00:00Z').toISOString(),
      stage: 'Applied',
      notes: 'Submitted application through career portal.',
      followUpDate: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day overdue
      createdAt: new Date('2026-01-22T14:00:00Z').toISOString(),
      updatedAt: new Date('2026-01-22T14:00:00Z').toISOString()
    },
    {
      _id: app4Id,
      userId: demoUserId,
      companyName: 'Meta',
      role: 'Data Science Intern',
      applicationDate: new Date('2026-01-05T08:30:00Z').toISOString(),
      stage: 'Rejected',
      notes: 'Position closed for the summer cycle.',
      followUpDate: null,
      createdAt: new Date('2026-01-05T08:30:00Z').toISOString(),
      updatedAt: new Date('2026-01-28T10:00:00Z').toISOString()
    }
  ];

  const activities = [
    {
      _id: generateId(),
      applicationId: app1Id,
      userId: demoUserId,
      type: 'CREATED',
      content: 'Application logged for Software Engineering Intern (Summer 2026) at Google',
      previousStage: null,
      newStage: null,
      createdAt: new Date('2026-01-15T09:00:00Z').toISOString()
    },
    {
      _id: generateId(),
      applicationId: app1Id,
      userId: demoUserId,
      type: 'STAGE_CHANGED',
      content: 'Stage changed from Applied to Interview',
      previousStage: 'Applied',
      newStage: 'Interview',
      createdAt: new Date('2026-01-20T14:30:00Z').toISOString()
    },
    {
      _id: generateId(),
      applicationId: app2Id,
      userId: demoUserId,
      type: 'CREATED',
      content: 'Application logged for Frontend Engineering Intern at Stripe',
      previousStage: null,
      newStage: null,
      createdAt: new Date('2026-01-18T11:00:00Z').toISOString()
    },
    {
      _id: generateId(),
      applicationId: app2Id,
      userId: demoUserId,
      type: 'STAGE_CHANGED',
      content: 'Stage changed from Interview to Offer',
      previousStage: 'Interview',
      newStage: 'Offer',
      createdAt: new Date('2026-02-01T16:00:00Z').toISOString()
    }
  ];

  return { users: [demoUser], applications, activities };
};

class FileStore {
  constructor() {
    this.data = { users: [], applications: [], activities: [] };
    this.init();
  }

  init() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DATA_FILE)) {
      this.data = getSeedData();
      this.save();
    } else {
      try {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        if (!this.data.users) this.data.users = [];
        if (!this.data.applications) this.data.applications = [];
        if (!this.data.activities) this.data.activities = [];
      } catch (err) {
        console.error('[FileStore] Failed to read db.json, initializing fresh seed data', err);
        this.data = getSeedData();
        this.save();
      }
    }
  }

  save() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[FileStore] Error saving to db.json:', err);
    }
  }
}

export const store = new FileStore();
export { generateId };
