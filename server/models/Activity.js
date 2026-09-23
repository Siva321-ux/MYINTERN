import { store, generateId } from '../config/store.js';

class ActivityDocument {
  constructor(data) {
    this._id = String(data._id);
    this.applicationId = String(data.applicationId);
    this.userId = String(data.userId);
    this.type = data.type;
    this.content = data.content;
    this.previousStage = data.previousStage || null;
    this.newStage = data.newStage || null;
    this.createdAt = data.createdAt || new Date().toISOString();
  }
}

class ActivityQueryChain {
  constructor(list) {
    this.list = list.map((a) => new ActivityDocument(a));
  }

  sort(sortOptions) {
    if (sortOptions.createdAt !== undefined) {
      this.list.sort((a, b) => {
        const da = new Date(a.createdAt).getTime();
        const db = new Date(b.createdAt).getTime();
        return sortOptions.createdAt === -1 ? db - da : da - db;
      });
    }
    return this;
  }

  then(resolve, reject) {
    return Promise.resolve(this.list).then(resolve, reject);
  }
}

export default {
  find(query = {}) {
    const filtered = store.data.activities.filter((act) => {
      if (query.applicationId && String(act.applicationId) !== String(query.applicationId)) {
        return false;
      }
      if (query.userId && String(act.userId) !== String(query.userId)) {
        return false;
      }
      return true;
    });
    return new ActivityQueryChain(filtered);
  },

  async create(data) {
    const newActivity = {
      _id: generateId(),
      applicationId: String(data.applicationId),
      userId: String(data.userId),
      type: data.type,
      content: data.content,
      previousStage: data.previousStage || null,
      newStage: data.newStage || null,
      createdAt: new Date().toISOString()
    };

    store.data.activities.push(newActivity);
    store.save();
    return new ActivityDocument(newActivity);
  },

  async deleteMany(query = {}) {
    if (query.applicationId) {
      store.data.activities = store.data.activities.filter(
        (act) => String(act.applicationId) !== String(query.applicationId)
      );
      store.save();
    }
    return { acknowledged: true };
  }
};
