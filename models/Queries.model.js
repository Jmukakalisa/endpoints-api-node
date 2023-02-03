import mongoose from 'mongoose';

const schema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      require: true,
    },
    message: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  },
);

const queryModel = mongoose.model('Query', schema);
export default queryModel;
