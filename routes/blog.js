const express = require("express")
const multer = require("multer")
const path = require('path')
const fs = require('fs')
const Blog = require("../models/blog")

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
    const {body, title} = req.body
    const blog = await Blog.create({
        body,
        title,
        createdBy: req.user._id,
        coverImageURL: `/uploads/${req.file.filename}`
    })
    return res.redirect(`/blog/${blog._id}`)
})

module.exports = router