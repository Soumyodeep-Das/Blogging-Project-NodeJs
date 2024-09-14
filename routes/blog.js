const express = require("express")
const multer = require("multer")
const path = require('path')
const fs = require('fs')
const Blog = require("../models/blog")
const User = require("../models/user")
const Comment = require("../models/comments")

const router = express.Router()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // const filePath = `../public/uploads/${req.user._id}`;
    // fs.mkdir(filePath);
    cb(null, path.resolve('./public/uploads'))
  },
  filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const fileName = `${Date.now()}-${file.originalname}`
    cb(null, fileName)
  }
})

const upload = multer({ storage: storage })

router.get('/add', (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  })
})

router.post('/', upload.single("coverImage"), async (req, res) => {
  console.log(req.body)
  console.log(req.file)
  const { body, title } = req.body
  const blog = await Blog.create({
    body,
    title,
    createdBy: req.user._id,
    coverImageURL: `/uploads/${req.file.filename}`
  })
  return res.redirect(`/blog/${blog._id}`)
})

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy")
  const comment = await Comment.find({blogId: blog._id}).populate("createdBy")
  // const user = await User.findOne({_id: blog.createdBy})
  // console.log(comment)
  return res.render("blogPage", {
    blog: blog,
    user: req.user,
    comment: comment,
  })
})

router.post('/comment/:blogId', async (req, res) => {
  try {
    await Comment.create({
      content: req.body.content,
      blogId: req.params.blogId,
      createdBy: req.user._id,
    })
  } catch (error) {
    await Comment.create({
      content: req.body.content,
      blogId: req.params.blogId,
      createdBy: null,
      createdByFullName: req.body.createdByFullName,
      createdByEmail: req.body.createdByEmail,
    })
  }
  return res.redirect(`/blog/${req.params.blogId}`)
})

module.exports = router