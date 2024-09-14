const mongoose = require("mongoose")
const { createHmac, randomBytes } = require("node:crypto");
const { createTokenForUser } = require("../services/authentication");

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageUrl: {
        type: String,
        default: '/images/profile2.png'
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    },
},
    {
        timestamps: true,
    });

userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified("password")) return next();

    const salt = randomBytes(16).toString('hex')
    const hashedPassword = createHmac("sha256", salt)
        .update(user.password)
        .digest("hex")

    this.salt = salt
    this.password = hashedPassword

    next()
})

userSchema.static('matchPasswordAndGenerateToken', async function (email, password) {
    const user = await this.findOne({ email })
    if (!user) throw new Error('User not found!');

    const salt = user.salt
    const hashedPassword = user.password

    const userProvidedPassword = createHmac("sha256", salt)
        .update(password)
        .digest("hex")

    if (userProvidedPassword !== hashedPassword)
        throw new Error('Incorrect Password');

    // return { ...user.toObject(), password: undefined, salt: undefined }
    const token = createTokenForUser(user)
    return token;
})

const User = mongoose.model('user', userSchema)

module.exports = User;