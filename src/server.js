import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import { localsMiddleware } from "./middlewares";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views"); //views 폴더 설정
app.use(logger);
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.COOKIE_SECRET, //우리 백엔드가 준 쿠키라고 보여주기 위함
    resave: false,
    saveUninitialized: false,
    // cookie: {
    //   maxAge : 20000
    // }
    // 세션 만료시간을 20초로 설정.
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
    //세션을 mongo에 연결
  })
);

app.use(localsMiddleware);
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;

// session 미들웨어를 통해 서버가 브라우저에 쿠키를 보냄
// 쿠키엔 어떤 정보든 넣을 수 있음 ex)세션id
// 쿠키는 정보를 주고받는 방법
// 백엔드에서 모든 세션 id 관리(세션store에 저장)
// http는 stateless라 지속적으로 커넥트 하려면 세션id 필요
// 세션은 기본적으로 램 메모리에 저장
// connect-mongo 설치 후 몽고에 저장하면 서버 재시작 해도 세션 기억
//use wetube -> show collections -> db.sessions.find({}) 로 db에 저장 된 세션 검색

//로그인 하지 않은 모든 사용자의 세션을 저장하는 건 비효율적
//saveUninitialized: false 하면 초기화되지 않은 (usercontroller에서 로그인 시 session에 데이터 할당하는것을 초기화.)

//쿠키
//domain : 쿠키가 어디서 오고 어디로 갈 지. (우리서버에서 유튜브의 쿠키를 보낼 수 없음)
//expires : 기본값은 session cookie로, 종료하지 않으면 소멸되지 않음
//max-age : 세션이 만료되는 시간

// 세션 secret이나 dburl은 외부로 공개되면 안 됨
//.env 파일 생성, gitignore에 등록, env에 변수 생성, process.env.NAME 으로 사용

//dotenv : env 파일에 있는 변수를 process.env에 등록
// npm i dotenv 초기파일(init.js)에 import

// 소셜 로그인 하려면 oauth 사용해야 함.
//https://github.com/settings/developers 가서 생성.
// scope : 유저에게 얻을 정보 종류
//1. 깃헙에 유저 보냄
//2. 유저가 깃헙에서 승인
//3. 깃헙에서 코드(JSON)를 받아 액세스토큰 획득
//4. 액세스토큰으로 깃헙API사용해 유저 정보 가져옴
