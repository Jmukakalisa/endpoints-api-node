import blogRouter from './routes/blogRoutes.js'
import {
    createBlogWithImage,
    deleteBlog,
    getAllBlogs,
    getBlogId,
    getComments,
    addComment,
    like,
    likesCounter,
    updateBlog} from './controllers/blogsController.js'

describe('getAllBlogs', () => {
    test('Get all blogs', () => {
        const result = blogRouter.get('/blogs')
        expected(result).toBe(getAllBlogs)
    })
})