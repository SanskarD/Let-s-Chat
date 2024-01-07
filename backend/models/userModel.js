const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require('bcrypt')

const userSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique:true
    },
    password: {
      type: String,
      require: true,
    },
    pic: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    }
  },
  { timestamps: true }
);

userSchema.methods.verifyPassword = async function(enteredPass) {
    return await bcrypt.compare(enteredPass,this.password)
}

userSchema.pre('save',async function(next){
  if(!this.isModified){
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password =  await bcrypt.hash(this.password,salt)
})


const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
