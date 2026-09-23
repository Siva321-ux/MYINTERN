import { store, generateId } from '../config/store.js';

class UserDocument {
  constructor(data) {
    this._id = data._id;
    this.name = data.name;
    this.email = data.email;
    this.passwordHash = data.passwordHash;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  select(fieldsStr) {
    // Mimic Mongoose query select chaining
    if (fieldsStr === '-passwordHash') {
      const copy = { ...this };
      delete copy.passwordHash;
      return copy;
    }
    return this;
  }
}

export default {
  async findOne(query) {
    const users = store.data.users;
    let found = null;

    if (query.email) {
      const emailLower = String(query.email).toLowerCase();
      found = users.find((u) => u.email.toLowerCase() === emailLower);
    } else if (query._id) {
      found = users.find((u) => u._id === String(query._id));
    }

    return found ? new UserDocument(found) : null;
  },

  async findById(id) {
    const users = store.data.users;
    const found = users.find((u) => u._id === String(id));
    return found ? new UserDocument(found) : null;
  },

  async create({ name, email, passwordHash }) {
    const newUser = {
      _id: generateId(),
      name,
      email: String(email).toLowerCase(),
      passwordHash,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    store.data.users.push(newUser);
    store.save();
    return new UserDocument(newUser);
  }
};
