import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";

// export const home = async (req, res) => {
//   //생성날짜 내림차순 정렬
//   const videos = await Video.find({})
//     .sort({ createdAt: "desc" })
//     .populate("owner");
//   return res.render("home", { pageTitle: "Home", videos });
// };
// // export const trending = (req, res) => res.render("home", { pageTitle: "Home" });
// // home이 base를 extend하므로 home 에다 pageTitle 전달하면 base 까지 전달.
// export const watch = async (req, res) => {
//   const { id } = req.params;
//   const video = await Video.findById(id).populate("owner");
//   //업로드 할 때 onwer에 유저 id 생김
//   //populate 사용 -> 비디오 스키마의 ref 참고하여 동일한 ObjectId가진 다큐먼트를 User에서 가져옴.
//   //굳이 User의 모든 데이터 필요없으면 populate 안 써도 됨.
//   if (!video) {
//     return res.status(404).render("404", { pageTitle: "Video not found." });
//   }
//   return res.render("videos/watch", { pageTitle: video.title, video, owner });
// };

// export const getEdit = async (req, res) => {
//   const { id } = req.params;
//   const {
//     user: { _id },
//   } = req.session;
//   const video = await Video.findById(id);
//   if (!video) {
//     return res.status(404).render("404", { pageTitle: "Video not found." });
//   }
//   if (String(video.owner) !== String(_id)) {
//     return res.status(403).redirect("/");
//   }
//   //비디오 주인 아니면 에디트 못 하게
//   return res.render("videos/edit", {
//     pageTitle: `Edit: ${video.title}`,
//     video,
//   });
// };

// export const postEdit = async (req, res) => {
//   const { id } = req.params;
//   const {
//     user: { _id },
//   } = req.session;
//   const { title, description, hashtags } = req.body;
//   // DB에 있는 동영상인지 확인만 하면 되니까 exists()
//   const video = await Video.exists({ _id: id });
//   if (!video) {
//     return res.render("404", { pageTitle: "Video not found." });
//   }
//   if (String(video.owner) !== String(_id)) {
//     return res.status(403).redirect("/");
//   }
//   await Video.findByIdAndUpdate(id, {
//     title,
//     description,
//     hashtags: Video.formatHashtags(hashtags),
//   });
//   // findByIdAndUpdate()가 아이디 입력받아서 업데이트 해줌.
//   return res.redirect(`/videos/${id}`);
// };

// export const getUpload = (req, res) => {
//   return res.render("videos/upload", { pageTitle: "Upload Video" });
// };

// export const postUpload = async (req, res) => {
//   const {
//     user: { _id },
//   } = req.session;
//   const { path: fileUrl } = req.file;
//   const { title, description, hashtags } = req.body;
//   try {
//     //고려하지 못한 error 발생 시 무한로딩 안되게 try catch.
//     const newVideo = await Video.create({
//       title,
//       description,
//       fileUrl,
//       owner: _id,
//       hashtags: Video.formatHashtags(hashtags),
//     });
//     const user = await User.findById(_id);
//     user.videos.push(newVideo._id);
//     user.save();
//     return res.redirect("/");
//   } catch (error) {
//     console.log(error);
//     return res.status(400).render("videos/upload", {
//       pageTitle: "Upload Video",
//       errorMessage: error._message,
//     });
//   }
// };

// export const deleteVideo = async (req, res) => {
//   const { id } = req.params;
//   const {
//     user: { _id },
//   } = req.session;
//   const video = await Video.findById(id);
//   if (!video) {
//     return res.status(404).render("404", { pageTitle: "Video not found." });
//   }
//   if (String(video.owner) !== String(_id)) {
//     return res.status(403).redirect("/");
//   }
//   await Video.findByIdAndDelete(id);
//   return res.redirect("/");
// };

// export const search = async (req, res) => {
//   const { keyword } = req.query;
//   let videos = [];
//   if (keyword) {
//     videos = await Video.find({
//       title: {
//         $regex: new RegExp(`${keyword}$`, "i"),
//         //$regex(regular expression)는 mongo에서 제공하는 operator
//         //keyword로 끝나는 영상 검색 `^${keyword}`는 keyword로 시작.
//       },
//     }).populate("owner");
//   }
//   return res.render("videos/search", { pageTitle: "Search", videos });
// };

export const home = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
  return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner").populate("comments");
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  return res.render("videos/watch", { pageTitle: video.title, video });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
  }
  return res.render("videos/edit", {
    pageTitle: `Edit: ${video.title}`,
    video,
  });
};

export const postEdit = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.findById({ _id: id });

  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "You are not the the owner of the video.");
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  req.flash("success", "Changes saved.");
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("videos/upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { video, thumb } = req.files;
  const { title, description, hashtags } = req.body;
  const isHeroku = process.env.NODE_ENV === "production";
  try {
    const newVideo = await Video.create({
      title,
      description,
      fileUrl: isHeroku ? video[0].location : "/" + video[0].path,
      thumbUrl: isHeroku ? thumb[0].location : "/" + thumb[0].path,
      owner: _id,
      hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(400).render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(`${keyword}$`, "i"),
      },
    }).populate("owner");
  }
  return res.render("videos/search", { pageTitle: "Search", videos });
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
    // status코드만 보내고 종료, status는 rendering같이 프론트엔드 코드 와 함께 쓰임
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};

export const createComment = async (req, res) => {
  const {
    session: { user },
    // 프론트엔드에서 백엔드로 보내면 자동으로 쿠키 생성, 쿠키 안에 세션
    body: { text },
    params: { id },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  video.comments.push(comment._id);
  // 코멘트 생성 될 때 비디오 코멘트에 id 전송
  video.save();
  return res.status(201).json({ newCommentId: comment._id });
  // 코멘트 id를 json으로 프론트엔드로 전송
};

export const deleteComment = async (req, res) => {
  const {
    session: { user },
    params: { id },
  } = req;
  const comment = await Comment.findById(id);
  const video = await Video.findById(comment.video);
  if (!comment) {
    return res.status(404).render("404", { pageTitle: "Comment not found." });
  }
  if (String(comment.owner) !== String(user._id)) {
    return res.status(403).redirect("/");
  }
  await Comment.findByIdAndDelete(id);
  video.comments = video.comments.filter((elements) => elements != id);
  video.save();
  return res.sendStatus(200);
};
