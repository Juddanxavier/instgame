import { model, models, Schema } from 'mongoose';

const testSchema = new Schema({
  name: String,
});

const Test = models.Test || model('Test', testSchema);

export default Test;
