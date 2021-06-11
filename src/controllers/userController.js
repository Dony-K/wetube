import User from "../models/User";
import fetch from "node-fetch";
//node에는 fetch 기능 없어서 npm i node-fetch
import bcrypt from "bcrypt";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });

export const postJoin = async (req, res) => {
  const { name, username, email, password, password2, location } = req.body;
  const pageTitle = "Join";
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Password confirmation does not match.",
    });
  }
  const exists = await User.exists({ $or: [{ username }, { email }] });
  //username이나 email 같으면 true 리턴, username : username
  if (exists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This username/email is already taken.",
    });
  }
  try {
    await User.create({
      name,
      username,
      email,
      password,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  const user = await User.findOne({ username, socialOnly: false });
  //사용자가 입력한 username과 일치하는 유저정보를 db에서 가져 옴.
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "An account with this username does not exists.",
    });
  }
  const ok = await bcrypt.compare(password, user.password);
  //유저가 입력한 패스워드와 db에 저장된 패스워드 비교
  //해시횟수는 bcrypt가 해시암호보고 인식.
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong password",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  //로그인 성공하면 session에 데이터 추가.
  return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
    //스코프 종류 공백으로 구분
  };
  const params = new URLSearchParams(config).toString();
  //객체를 url 파라미터 형식으로 만들어 줌.
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};
//유저를 깃헙 페이지로 보냄

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  //깃헙에서 액세스토큰 담긴 JSON받음
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    // 토큰을 써서 API fetch 해서 유저 정보 획득.
    console.log(userData);
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    //email을 받아옴
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    //email 객체에서 primary와 verified된 이메일 찾음.
    if (!emailObj) {
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });
    // db에 깃헙의 이메일과 동일한 유저 있는지 확인
    if (!user) {
      user = await User.create({
        avatarUrl: userData.avatar_url,
        name: userData.name,
        username: userData.login,
        email: emailObj.email,
        password: "",
        socialOnly: true,
        location: userData.location,
      });
      //유저 없으면 계정 생성
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
    //있으면 로그인.
  } else {
    return res.redirect("/login");
    //토큰 없으면 다시 로그인페이지로.
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  //세션 파괴시켜서 로그아웃
  return res.redirect("/");
};

export const edit = (req, res) => res.send("Edit User");
export const see = (req, res) => res.send("See User");
