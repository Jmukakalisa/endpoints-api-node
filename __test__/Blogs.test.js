import request from 'supertest';
import app from '../index.js';
import mongoose from 'mongoose';
import blogModel from '../models/Blogs.model.js';
import userModel from '../models/users.model.js';

describe('BLOGS UNIT', () => {
  beforeEach(async () => {
    try {
      mongoose.set('strictQuery', false);
      await mongoose.connect(process.env.MONGO_URI_TEST);
      await blogModel.create({
        title: 'title',
        content: 'content',
        image:
          'http://res.cloudinary.com/dsvjwhgtk/image/upload/v1675778580/portfolio/blogImages/Title%203_image.jpg',
        comments: [],
        likes: [],
      });
      await userModel.create({
        username: 'username',
        email: 'email@gmail.com',
        password: 'password',
        isAdmin: 'true',
      });
    } catch (error) {
      console.log(error.message);
    }
  });

  afterEach(async () => {
    await blogModel.deleteMany({});
    await userModel.deleteMany({});
    await mongoose.disconnect();
    await mongoose.connection.close();
  });
  //get all blogs
  describe('GET /api/blogs', () => {
    it('get any specified route', async () => {
      const res = await request(app).get('/');
      expect(res.status).toEqual(200);
    });
    // get all blogs
    it('get all blogs', async () => {
      const res = await request(app).get('/api/blogs');
      expect(res.status).toEqual(200);
      const blog = res.body.data;
      expect(Array.isArray(blog)).toBe(true);
      expect(blog[0]).toHaveProperty(
        'title',
        'content',
        'image',
        'likes',
        'comments',
        '_id',
      );
    });
  });
  // get a single blog
  describe('GET /api/blogs/:id', () => {
    it("return a 400 status if '_id' is invalid", async () => {
      const res = await request(app).get('/api/blogs/23333');
      expect(res.status).toEqual(400);
      const message = res.body.message;
      expect(message).toEqual("Blog doesn't exist");
    });
    it('return one blog', async () => {
      const allBlogs = await request(app).get('/api/blogs');
      const currentBlog = allBlogs.body.data[0];
      const id = currentBlog._id;
      const res = await request(app).get(`/api/blogs/${id}`);
      expect(res.status).toEqual(200);
    });
  });
  //post blog
  describe('POST /api/blogs', () => {
    it('return a 401 status if user is not logged in', async () => {
      const res = await request(app).post('/api/blogs/').send({});
      expect(res.status).toEqual(401);
    });
    it('return a 201 status if user is admin', async () => {
      const user = {
        email: 'email@gmail.com',
        password: 'password',
      };
      const blog = {
        title: 'blog title',
        content: 'blog content',
      };
      const login = await request(app).post('/api/login').send(user);
      const token = login.body.token;
      const createdBlog = await request(app)
        .post('/api/blogs/')
        .send(blog)
        .set('Authorization', 'Bearer ' + token);
      expect(createdBlog.status).toEqual(201);
      expect(createdBlog.body.data).toHaveProperty(
        'title',
        'content',
        'likes',
        'comments',
        '_id',
      );
    });
  });
  //update blog
  describe('PATCH /api/blogs/:id', () => {
    it('return a 401 status if user is not logged in', async () => {
      const res = await request(app).post('/api/blogs/').send({});
      expect(res.status).toEqual(401);
    });
    it('return a 201 status if user is admin', async () => {
      const user = {
        email: 'email@gmail.com',
        password: 'password',
      };
      const blog = {
        title: 'blog title',
        content: 'blog content',
      };
      const login = await request(app).post('/api/login').send(user);
      const token = login.body.token;
      const allBlogs = await request(app).get('/api/blogs');
      const currentBlog = allBlogs.body.data[0];
      const id = currentBlog._id;
      const updatedBlog = await request(app)
        .patch(`/api/blogs/${id}`)
        .send(blog)
        .set('Authorization', 'Bearer ' + token);
      expect(updatedBlog.status).toEqual(201);
      expect(updatedBlog.body.data).toHaveProperty(
        'title',
        'content',
        'likes',
        'comments',
        '_id',
      );
    });
  });
  //delete blog
  describe('DELETE /api/blogs/:id', () => {
    it('return a 401 status if user is not logged in', async () => {
      const res = await request(app).post('/api/blogs/').send({});
      expect(res.status).toEqual(401);
    });
    it('return a 201 status if user is admin', async () => {
      const user = {
        email: 'email@gmail.com',
        password: 'password',
      };
      const login = await request(app).post('/api/login').send(user);
      const token = login.body.token;
      const allBlogs = await request(app).get('/api/blogs');
      const currentBlog = allBlogs.body.data[0];
      const id = currentBlog._id;
      const deletedBlog = await request(app)
        .delete(`/api/blogs/${id}`)
        .set('Authorization', 'Bearer ' + token);
      expect(deletedBlog.status).toEqual(201);
      const message = deletedBlog.body.message;
      expect(message).toEqual('Blog deleted successfully');
    });
    it("return 400 if blog doesn't exist", async () => {
      const user = {
        email: 'email@gmail.com',
        password: 'password',
      };
      const login = await request(app).post('/api/login').send(user);
      const token = login.body.token;
      const id = '123';
      const deletedBlog = await request(app)
        .delete(`/api/blogs/${id}`)
        .set('Authorization', 'Bearer ' + token);
      expect(deletedBlog.status).toEqual(400);
      const message = deletedBlog.body.message;
      expect(message).toEqual("Blog doesn't exist!");
    });
  });
  //add comment
  describe('POST /blogs/:id/comments', () => {
    it('return a 401 status if user is not logged in', async () => {
      const res = await request(app).post('/api/blogs/').send({});
      expect(res.status).toEqual(401);
    });
    it("return a 400 status if blog doesn't exist", async () => {
      const user = {
        email: 'email@gmail.com',
        password: 'password',
      };
      const comment = {
        comment: 'comment',
      };
      const login = await request(app).post('/api/login').send(user);
      const token = login.body.token;
      const allBlogs = await request(app).get('/api/blogs');
      const currentBlog = allBlogs.body.data[0];
      const id = currentBlog._id;
      const updatedBlog = await request(app)
        .post(`/api/blogs/${id + 1}/comments`)
        .send(comment)
        .set('Authorization', 'Bearer ' + token);
      expect(updatedBlog.status).toEqual(400);
      const message = updatedBlog.body.message;
      expect(message).toEqual("Blog doesn't exist");
    });
    it('return a 201 status if user is logged in', async () => {
      const user = {
        email: 'email@gmail.com',
        password: 'password',
      };
      const comment = {
        comment: 'comment',
      };
      const login = await request(app).post('/api/login').send(user);
      const token = login.body.token;
      const allBlogs = await request(app).get('/api/blogs');
      const currentBlog = allBlogs.body.data[0];
      const id = currentBlog._id;
      const updatedBlog = await request(app)
        .post(`/api/blogs/${id}/comments`)
        .send(comment)
        .set('Authorization', 'Bearer ' + token);
      expect(updatedBlog.status).toEqual(201);
      expect(updatedBlog.body.message).toEqual('Comment added');
    });
  });
  // get all comments
  describe('GET /blogs/:id/comments', () => {
    it("return a 400 status if '_id' is invalid", async () => {
      const res = await request(app).get('/api/blogs/23333/comments');
      expect(res.status).toEqual(400);
      const message = res.body.message;
      expect(message).toEqual("Blog doesn't exist");
    });
    it('return one blog', async () => {
      const allBlogs = await request(app).get('/api/blogs');
      const currentBlog = allBlogs.body.data[0];
      const id = currentBlog._id;
      const res = await request(app).get(`/api/blogs/${id}/comments`);
      expect(res.status).toEqual(200);
    });
  });
  //add or remove like
  describe('POST /blogs/:id/likes', () => {
    it('return a 401 status if user is not logged in', async () => {
      const res = await request(app).post('/api/blogs/').send({});
      expect(res.status).toEqual(401);
    });
    it("return a 400 status if blog doesn't exist", async () => {
      const user = {
        email: 'email@gmail.com',
        password: 'password',
      };

      const login = await request(app).post('/api/login').send(user);
      const token = login.body.token;
      const allBlogs = await request(app).get('/api/blogs');
      const currentBlog = allBlogs.body.data[0];
      const id = currentBlog._id;
      const updatedBlog = await request(app)
        .post(`/api/blogs/${id + 1}/likes`)
        .set('Authorization', 'Bearer ' + token);
      expect(updatedBlog.status).toEqual(400);
      const message = updatedBlog.body.message;
      expect(message).toEqual("Blog doesn't exist!");
    });
    it('return a 201 status if user is logged in', async () => {
      const user = {
        email: 'email@gmail.com',
        password: 'password',
      };

      const login = await request(app).post('/api/login').send(user);
      const token = login.body.token;
      const allBlogs = await request(app).get('/api/blogs');
      const currentBlog = allBlogs.body.data[0];
      const id = currentBlog._id;
      const updatedBlog = await request(app)
        .post(`/api/blogs/${id}/likes`)

        .set('Authorization', 'Bearer ' + token);
      expect(updatedBlog.status).toEqual(201);
      expect(updatedBlog.body.data[0].message).toEqual('Done');
    });
  });
  // get number of likes
  describe('GET /api/blogs/:id/likes', () => {
    it("return a 400 status if '_id' is invalid", async () => {
      const res = await request(app).get('/api/blogs/23333/likes');
      expect(res.status).toEqual(400);
      const message = res.body.message;
      expect(message).toEqual("Blog doesn't exist");
    });
    it('return one blog', async () => {
      const allBlogs = await request(app).get('/api/blogs');
      const currentBlog = allBlogs.body.data[0];
      const id = currentBlog._id;
      const res = await request(app).get(`/api/blogs/${id}/likes`);
      expect(res.status).toEqual(200);
    });
  });
});
