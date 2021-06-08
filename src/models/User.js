import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  location: String,
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 5);
}); //this는 create되는 user 가리킴.
//await bcrypt.hash(패스워드 , 해시 횟수); promise라 콜백 인자 필요없음.
//db에 hash password 저장

const User = mongoose.model("User", userSchema);
export default User;
