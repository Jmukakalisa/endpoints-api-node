import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const schema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);
schema.pre('save', function (next) {
  if (this.isModified('password')) {
    bcrypt.hash(this.password, 10, (err, hash) => {
      if (err) return next(err);

      this.password = hash;
      next();
    });
  }
});

schema.methods.comparePassword = async function (password) {
  if (!password) throw new Error('Password is missing; nothing to compare');
  try {
    const result = await bcrypt.compare(password, this.password);
    return result;
  } catch (error) {
    console.log('Error while comparing the password: ', error.message);
  }
};

schema.statics.isThisEmailInUse = async function (email) {
  if (!email) throw new Error('Invalid Email');
  try {
    const user = await this.findOne({ email });
    if (user) return false;
    return true;
  } catch (error) {
    console.log('error inside isThisEmailInUse method: ', error.message);
    return false;
  }
};

const userModel = mongoose.model('User', schema);
export default userModel;
