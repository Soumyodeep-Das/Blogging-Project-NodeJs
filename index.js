const express = require("express")
const path = require("path")
const mongoose = require("mongoose")

const userRoutes = require('./routes/user')

const app = express()
const PORT = 8000

mongoose.connect('mongodb://127.0.0.1:27017/blogify').then(() => console.log("MongoDB Connected"))

app.use(express.urlencoded({ extended: false }))

app.set('view engine', 'ejs')
app.set('views', path.resolve("./views"))

app.get("/", (req,res) => {
    res.render("home")
})

app.use('/user', userRoutes)
app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`))