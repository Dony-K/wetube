import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  //세션의 로그인 값을 locals에 생성
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user || {};
  //로그인 안 하고 접속 시 에러페이지 안 뜨게 설정.
  //세션의 유저객체를 locals에 생성
  next();
};

export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/");
  }
};

export const avatarUpload = multer({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 3000000,
  },
});
// dest: 저장경로, limits : bytes로 나타낸 사이즈

export const videoUpload = multer({
  dest: "uploads/videos/",
  limits: {
    fileSize: 10000000,
  },
});
