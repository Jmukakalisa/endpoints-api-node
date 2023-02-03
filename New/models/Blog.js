const mongoose = require("mongoose")

const schema = mongoose.Schema({
	title: String,
	author: String,
	content: String,
	File: String,
})

module.exports = mongoose.model("Blog", schema)