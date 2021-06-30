import express from "express";
import morgan from "morgan";
import session from "express-session";
import flash from "express-flash";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import apiRouter from "./routers/apiRouter";
import { localsMiddleware } from "./middlewares";

//d
const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views"); //views 폴더 설정
// cwd는 package.json이 있는 폴더
app.use(logger);
app.use(express.urlencoded({ extended: true }));
// 서버가 form으로부터 오는 data 이해하도록
app.use(express.json());

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
    //세션을 mongo에 연결, default로는 메모리에 저장되어 휘발성 가짐.
  })
);

app.use(flash());
app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));
// static file : 폴더전체를 브라우저에게 노출시킴.
//static("폴더명")
app.use("/static", express.static("assets"));
// /static : 서버에게 assets라는 이름의 폴더를 static으로 사용할거라고 알려줌.
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter);

export default app;
