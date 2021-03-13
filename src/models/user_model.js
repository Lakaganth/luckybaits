const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    min: 6,
    validate(val) {
      if (val.toLowerCase() === "password") {
        throw new Error("Can't use this as password, create a new one");
      }
      if (!validator.isLength(val, { min: 6 })) {
        throw new Error("Min length 6 characters");
      }
    },
  },
  token: {
    type: String,
    // required: true,
  },
});

UserSchema.methods.generateAuthToken = async function () {
  const user = this;

  console.log(user);
  //   const token = jwt.sign({ _id: user._id.toString() }, "luckystriketeam");
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  user.token = token;
  await user.save();
  return token;
};

//Method hashes password before saving to database
UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

UserSchema.statics.findByCredentials = async (name, password) => {
  const user = await User.findOne({ name });

  if (!user) {
    throw new Error("Unable to Login! Please try again");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to Login! Please try again");
  }

  return user;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
