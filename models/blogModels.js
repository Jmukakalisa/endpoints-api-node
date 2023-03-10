import mongoose from 'mongoose';
import { commentSchema } from './commentModels.js';
import { likeSchema } from './likeModels.js';

const schema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    comments: [commentSchema],
    likes: [likeSchema],
  },
  {
    timestamps: true,
  },
);

const blogModel = mongoose.model('Blog', schema);
export default blogModel;
