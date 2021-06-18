const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
  entry: "./src/client/js/main.js",
  //사용할 파일 경로
  mode: "development",
  watch: true,
  //파일이 바뀌면 저절로 assets 업데이트 해줌.
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
  ],
  output: {
    filename: "js/main.js",
    path: path.resolve(__dirname, "assets"),
    //절대경로로 path 입력해줘야 함
    //resolve(현재파일경로,추가할 경로) -> 현재파일경로/추가할경로로 path 생성
    clean: true,
    //output폴더 빌드하기 전에 clean 해줌.
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        // /\.js$/ = RegExp 정규표현식
        // 정규표현식에선 .가 분류 커맨드이므로 그냥 .을 쓸려면 \.을 해줘야 된다.
        // 따라서 \.js는 .js이다
        use: {
          loader: "babel-loader",
          //사용 전 npm i -D babel-loader
          //바벨로더를 사용해 프론트엔드의 js파일을 모든 브라우저 호환 js로 변환
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        // use에 쓰여진 역순으로 로더 실행됨.
      },
    ],
  },
};
