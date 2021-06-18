import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLength: 80 },
  fileUrl: { type: String, required: true },
  description: { type: String, required: true, trim: true, minLength: 20 },
  createdAt: { type: Date, required: true, default: Date.now },
  //Date.now()하면 이 파일 저장시간이 default로 들어감.
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, required: true },
  },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  // tpye: 몽구스의 ObjectId로 타입 생성, ref : 어떤 모델의 objectId인지 몽구스에 알려줌
});

videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
  //,기준으로 나눠서 배열로 만들어주고 # 붙여줌.
});

const Video = mongoose.model("Video", videoSchema);
export default Video;
