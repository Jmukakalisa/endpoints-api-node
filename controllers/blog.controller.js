import cloudinary from '../files/imageUpload.js';
import blogModel from '../models/Blogs.model.js';

const getAllBlogs = async (req, res) => {
  const blogs = await blogModel.find();
  res.json(blogs);
};

const createBlogWithImage = async (req, res) => {
  const blog = new blogModel(req.body);
  await blog.save();
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'portfolio/blogImages',
      public_id: `${blog.title}_image`,
    });
    blog.image = result.url;
    await blog.save();
    res.json(blog);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error: Could not upload image',
    });
    console.log('Error while uploading image: ', error.message);
  }
};

const getBlogId = async (req, res) => {
  try {
    const blog = await blogModel.findOne({ _id: req.params.id });
    if (!blog) {
      res.status(404).json({ error: "Blog doesn't exist" });
      return;
    }
    res.send(blog);
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateBlog = async (req, res) => {
  try {
    const blog = await blogModel.findOne({ _id: req.params.id });

    if (req.body.title) {
      blog.title = req.body.title;
    }
    if (req.body.content) {
      blog.content = req.body.content;
    }
    if (req.file) {
      blog.image = req.file.path;
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'portfolio/blogImages',
        public_id: `${blog.title}_image`,
      });
      blog.image = result.url;
    }
    await blog.save();
    console.log(blog);
    res.send(blog);
  } catch (err) {
    res.status(404);
    res.json({ error: "Blog doesn't exist" });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const result = await blogModel.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      res.status(404).json({ error: "Blog doesn't exist!" });
      return;
    }
    res.status(204).json({ message: 'Blog deleted successfully' });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export { getAllBlogs, updateBlog, getBlogId, deleteBlog, createBlogWithImage };
