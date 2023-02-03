const express = require("express")
const { $where } = require("../models/Blog")
// const blog = require("../models/Blog")
const Blog = require("../models/Blog") // new
const router = express.Router()

// Get all blogs
router.get("/blogs", async (req, res) => {
	const blogs = await Blog.find()
	res.send(blogs)
})

// Create Blogs

router.post("/blogs", async (req, res) => {
	const blog = new Blog({
		title: req.body.title,
		author: req.body.author,
		content: req.body.content,
		file: req.body.image
	})
	await blog.save()
	res.send(blog)
})

//  Get a single blog

router.get("/blogs/:id", async (req, res) => {
	try {
		const blog = await Blog.findOne({ _id: req.params.id })
		res.send(blog)
	} catch {
		res.status(404)
		res.send({ error: "Blog doesn't exist!" })
	}
})

// router.get("/query/:id", async (req, res) => {
// 	try {
// 		const blog = await Blog.findOne({ _id: req.params.id })
// 		res.send(blog)
// 	} catch {
// 		res.status(404)
// 		res.send({ error: "Blog doesn't exist!" })
// 	}
// })

// Update blog

router.patch("/blogs/:id", uploads.single("image"), async (req, res) => {
	try {
		const blog = await Blog.findOne({ _id: req.params.id })

		if (req.body.title) {
			blog.title = req.body.title
		}

		if (req.body.content) {
			blog.content = req.body.content
		}

		if (req.file){
			blog.image = req.file.path
			const result = await cloudinary.uploader.upload(req.file.path, {
				folder: "UI/img",
				public_id: `${blog.lille}_image`
			})
			blog.image =  result.url;
		}

		await blog.save()
		console.log(blog)
		res.send(blog)
	} catch {
		res.status(404)
		res.send({ error: "Blog doesn't exist!" })
	}
})

//  Delete a blog

router.delete("/blogs/:id", async (req, res) => {
	try {
		await Blog.deleteOne({ _id: req.params.id })
		res.status(204).send()
	} catch {
		res.status(404)
		res.send({ error: "Blog doesn't exist!" })
	}
})

module.exports = router