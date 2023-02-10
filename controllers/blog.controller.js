import cloudinary from '../helpers/imageUpload.js';
import blogModel from '../models/Blogs.model.js';

const getAllBlogs = async (req, res) => {
  const blogs = await blogModel.find();
  res.status(200).json({ status: 200, success: true, data: blogs });
};

const createBlogWithImage = async (req, res) => {
  try {
    const blog = new blogModel(req.body);
    await blog.save();
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'portfolio/blogImages',
        public_id: `${blog.title}_image`,
      });
      blog.image = result.url;
      await blog.save();
    }

    res.status(201).json({
      status: 201,
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Server Error: Could not create blog',
    });
    console.log('Error while uploading image: ', error.message);
  }
};

const getBlogId = async (req, res) => {
  try {
    const blog = await blogModel.findOne({ _id: req.params.id });

    res.json(blog);
  } catch {
    res
      .status(400)
      .json({ status: 400, success: false, message: "Blog doesn't exist" });
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
    res.status(201).json({
      status: 201,
      success: true,
      message: 'Blog updated',
      data: blog,
    });
  } catch (err) {
    res
      .status(400)
      .json({ status: 400, success: false, message: "Blog doesn't exist" });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const result = await blogModel.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 1) {
      res.status(201).json({
        status: 201,
        success: true,
        message: 'Blog deleted successfully',
      });
    } else {
      res
        .status(400)
        .json({ status: 400, success: false, message: "Blog doesn't exist!" });
    }
  } catch (error) {
    res
      .status(400)
      .json({ status: 400, success: false, message: "Blog doesn't exist!" });

    // console.log(error.message);
  }
};

const addComment = async (req, res) => {
  try {
    const blog = await blogModel.findOne({ _id: req.params.id });
    // if (!blog) {
    //   res
    //     .status(404)
    //     .json({ status: 404, success: false, message: "Blog doesn't exist" });
    //   return;
    // } if(){
    blog.comments = [
      ...blog.comments,
      { comment: req.body.comment, user: req.user, blog: blog },
    ];
    blog.save();
    res.status(201).json({
      status: 201,
      success: true,
      message: `Comment added`,
    });
    // }
  } catch (error) {
    res.status(400).json({
      status: 400,
      success: false,
      message: `Blog doesn't exist`,
    });
    // console.log(`Error while adding comment ${error.message}`);
  }
};
const getComments = async (req, res) => {
  try {
    const blog = await blogModel
      .findOne({ _id: req.params.id })
      .populate({
        path: 'comments.user',
        model: 'User',
        select: 'username',
      })
      .populate({ path: 'comments.blog', model: 'Blog', select: 'title' });

    res.status(200).json({ status: 200, success: true, data: blog.comments });
  } catch {
    res
      .status(400)
      .json({ status: 400, success: false, message: "Blog doesn't exist" });
  }
};
const like = async (req, res) => {
  try {
    const blog = await blogModel.findById(req.params.id);

    //check if the blog is already liked
    const alreadyLiked = blog.likes.find(
      (like) => like.user.toString() === req.user._id.toString(),
    );
    //unlike the blog
    if (alreadyLiked) {
      blog.likes = blog.likes.filter(
        (like) => like.user.toString() !== req.user._id.toString(),
      );
    } else {
      blog.likes.push({
        user: req.user._id,
        blog: req.params.blogId,
      });
    }
    await blog.save();
    res.status(201).json({
      statusCode: 201,
      success: true,
      data: [{ message: 'Done', body: blog }],
    });
  } catch (error) {
    res
      .status(400)
      .json({ status: 400, success: false, message: "Blog doesn't exist!" });
  }
};
const likesCounter = async (req, res) => {
  try {
    const blog = await blogModel.findOne({ _id: req.params.id });

    res.status(200).json({
      status: 200,
      success: true,
      message: `Number of likes: ${blog.likes.length}`,
    });
  } catch (error) {
    res
      .status(400)
      .json({ status: 400, success: false, message: "Blog doesn't exist" });
  }
};

export {
  getAllBlogs,
  updateBlog,
  getBlogId,
  deleteBlog,
  createBlogWithImage,
  addComment,
  getComments,
  like,
  likesCounter,
};
