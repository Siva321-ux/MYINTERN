import { store } from './store.js';

export const connectDB = async () => {
  console.log(`[JSON FileStore] Data store initialized and ready at server/data/db.json`);
  return store;
};
