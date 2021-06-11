export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  //세션의 로그인 값을 locals에 생성
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user;
  console.log(req.session);
  //세션의 유저객체를 locals에 생성
  next();
};
