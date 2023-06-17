import { connect } from 'mongoose';

const DB =
  (process.env.DB_STATUS === 'live' ? process.env.DB : process.env.LOCALDB) ||
  'mongodb://127.0.0.1:27017/test';

export const connectToDatabase = () => {
  connect(DB)
    .then(() => console.log('connected to DB'))
    .catch((error) => console.log(error));
};
