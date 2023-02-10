import { Router } from 'express';
import {
  addComment,
  createBlogWithImage,
  deleteBlog,
  getAllBlogs,
  getBlogId,
  getComments,
  like,
  likesCounter,
  updateBlog,
} from '../controllers/blog.controller.js';
import multer from 'multer';
import validate from '../middleware/validation/validation.middleware.js';
import {
  blogCreationSchema,
  commentsSchema,
} from '../middleware/validation/validation.js';
import {
  isLoggedIn,
  isAdmin,
} from '../middleware/authentication/auth.middleware.js';

const blogRouter = Router();
const storage = multer.diskStorage({});
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb('Invalid image file', false);
  }
};
const uploads = multer({ storage, fileFilter });

blogRouter.get('/blogs', getAllBlogs);
blogRouter.post(
  '/blogs',
  [isLoggedIn, isAdmin, uploads.single('image'), validate(blogCreationSchema)],
  createBlogWithImage,
);
blogRouter.get('/blogs/:id', getBlogId);
blogRouter.patch(
  '/blogs/:id',
  [isLoggedIn, isAdmin, uploads.single('image')],
  updateBlog,
);
blogRouter.delete('/blogs/:id', [isLoggedIn, isAdmin], deleteBlog);
blogRouter.post(
  '/blogs/:id/comments',
  [isLoggedIn, validate(commentsSchema)],
  addComment,
);
blogRouter.get('/blogs/:id/comments', getComments);
blogRouter.post('/blogs/:id/likes', isLoggedIn, like);
blogRouter.get('/blogs/:id/likes', likesCounter);

export default blogRouter;
