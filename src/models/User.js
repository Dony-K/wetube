import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  avatarUrl: String,
  socialOnly: { type: Boolean, default: false },
  username: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String, required: true },
  location: String,
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
  //비디오는 여러개니까 배열로 생성
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 5);
  }
}); //this는 create되는 user 가리킴.
//password가 변경 되면 패스워드 해시 -> 비디오 업로드 시 암호 또 해시되는거 방지하기 위함.
//await bcrypt.hash(패스워드 , 해시 횟수); promise라 콜백 인자 필요없음.
//db에 hash password 저장

const User = mongoose.model("User", userSchema);
export default User;
