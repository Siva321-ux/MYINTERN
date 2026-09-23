import { store, generateId } from '../config/store.js';

const STAGES = ['Applied', 'Interview', 'Offer', 'Rejected'];

class ApplicationDocument {
  constructor(data) {
    this._id = String(data._id);
    this.userId = String(data.userId);
    this.companyName = data.companyName;
    this.role = data.role;
    this.applicationDate = data.applicationDate;
    this.stage = data.stage || 'Applied';
    this.notes = data.notes || '';
    this.followUpDate = data.followUpDate || null;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  toObject() {
    return {
      _id: this._id,
      userId: this.userId,
      companyName: this.companyName,
      role: this.role,
      applicationDate: this.applicationDate,
      stage: this.stage,
      notes: this.notes,
      followUpDate: this.followUpDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  async save() {
    this.updatedAt = new Date().toISOString();
    const idx = store.data.applications.findIndex((a) => a._id === this._id);
    const obj = this.toObject();
    if (idx !== -1) {
      store.data.applications[idx] = obj;
    } else {
      store.data.applications.push(obj);
    }
    store.save();
    return this;
  }
}

function matchQuery(app, query) {
  if (query.userId && String(app.userId) !== String(query.userId)) {
    return false;
  }
  if (query._id && String(app._id) !== String(query._id)) {
    return false;
  }
  if (query.stage) {
    if (typeof query.stage === 'object' && query.stage.$ne) {
      if (app.stage === query.stage.$ne) return false;
    } else if (app.stage !== query.stage) {
      return false;
    }
  }

  // Handle followUpDate conditions
  if (query.followUpDate) {
    const fu = app.followUpDate ? new Date(app.followUpDate).getTime() : null;
    const q = query.followUpDate;

    if (q.$ne !== undefined) {
      if (q.$ne === null && fu === null) return false;
    }
    if (q.$gt !== undefined) {
      const gtVal = new Date(q.$gt).getTime();
      if (!fu || fu <= gtVal) return false;
    }
    if (q.$gte !== undefined) {
      const gteVal = new Date(q.$gte).getTime();
      if (!fu || fu < gteVal) return false;
    }
    if (q.$lte !== undefined) {
      const lteVal = new Date(q.$lte).getTime();
      if (!fu || fu > lteVal) return false;
    }
    if (q.$lt !== undefined) {
      const ltVal = new Date(q.$lt).getTime();
      if (!fu || fu >= ltVal) return false;
    }
  }

  // Handle $or (e.g. search regex for companyName or role)
  if (query.$or && Array.isArray(query.$or)) {
    const matchesOr = query.$or.some((condition) => {
      if (condition.companyName) {
        const regex = condition.companyName;
        if (regex instanceof RegExp) {
          if (regex.test(app.companyName)) return true;
        }
      }
      if (condition.role) {
        const regex = condition.role;
        if (regex instanceof RegExp) {
          if (regex.test(app.role)) return true;
        }
      }
      return false;
    });
    if (!matchesOr) return false;
  }

  return true;
}

class QueryChain {
  constructor(list) {
    this.list = list.map((a) => new ApplicationDocument(a));
  }

  sort(sortOptions) {
    this.list.sort((a, b) => {
      if (sortOptions.applicationDate !== undefined) {
        const da = new Date(a.applicationDate).getTime();
        const db = new Date(b.applicationDate).getTime();
        return sortOptions.applicationDate === -1 ? db - da : da - db;
      }
      if (sortOptions.companyName !== undefined) {
        const ca = (a.companyName || '').toLowerCase();
        const cb = (b.companyName || '').toLowerCase();
        return sortOptions.companyName === -1 ? cb.localeCompare(ca) : ca.localeCompare(cb);
      }
      if (sortOptions.followUpDate !== undefined) {
        const fa = a.followUpDate ? new Date(a.followUpDate).getTime() : Infinity;
        const fb = b.followUpDate ? new Date(b.followUpDate).getTime() : Infinity;
        return sortOptions.followUpDate === -1 ? fb - fa : fa - fb;
      }
      return 0;
    });
    return this;
  }

  then(resolve, reject) {
    return Promise.resolve(this.list).then(resolve, reject);
  }
}

export default {
  find(query = {}) {
    const filtered = store.data.applications.filter((app) => matchQuery(app, query));
    return new QueryChain(filtered);
  },

  async findOne(query = {}) {
    const found = store.data.applications.find((app) => matchQuery(app, query));
    return found ? new ApplicationDocument(found) : null;
  },

  async create(data) {
    const newApp = {
      _id: generateId(),
      userId: String(data.userId),
      companyName: data.companyName,
      role: data.role,
      applicationDate: data.applicationDate ? new Date(data.applicationDate).toISOString() : new Date().toISOString(),
      stage: data.stage || 'Applied',
      notes: data.notes || '',
      followUpDate: data.followUpDate ? new Date(data.followUpDate).toISOString() : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    store.data.applications.push(newApp);
    store.save();
    return new ApplicationDocument(newApp);
  },

  async findOneAndDelete(query = {}) {
    const idx = store.data.applications.findIndex((app) => matchQuery(app, query));
    if (idx === -1) return null;
    const [deleted] = store.data.applications.splice(idx, 1);
    store.save();
    return new ApplicationDocument(deleted);
  },

  async countDocuments(query = {}) {
    const count = store.data.applications.filter((app) => matchQuery(app, query)).length;
    return count;
  }
};

export { STAGES };
