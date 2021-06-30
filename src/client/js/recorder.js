import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;
let stopTimer;

const files = {
  input: "recording.webm",
  output: "output.mp4",
  thumb: "thumbnail.jpg",
};

const downloadFile = (fileUrl, fileName) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName;
  // a링크를 클릭하면 다운로드 하게 해줌
  document.body.appendChild(a);
  // 바디 태그에 있는 링크만 클릭 가능.
  a.click();
};

const handleDownload = async () => {
  actionBtn.removeEventListener("click", handleDownload);

  actionBtn.innerText = "Transcoding...";

  actionBtn.disabled = true;

  const ffmpeg = createFFmpeg({ log: true });
  // 콘솔에서 확인하기 위해 log:true
  await ffmpeg.load();
  // 유저가 소프트웨어 사용하기 위해 await

  ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));
  // 가상 컴퓨터(Fs=file system의 메모리)에 파일 생성

  await ffmpeg.run("-i", files.input, "-r", "60", files.output);
  // i(input) r 60:초당 60프레임으로 인코딩, 브라우저 메모리에 mp4저장

  await ffmpeg.run(
    "-i",
    files.input,
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    files.thumb
  );
  // ss 00:00:01 재생시간 1초로 감, frames : 이동한 시간의 스크린샷
  const mp4File = ffmpeg.FS("readFile", files.output);
  const thumbFile = ffmpeg.FS("readFile", files.thumb);

  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });
  // 버퍼 사용해야 blob에 2진데이터 입력 가능.

  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbUrl = URL.createObjectURL(thumbBlob);

  downloadFile(mp4Url, "MyRecording.mp4");
  downloadFile(thumbUrl, "MyThumbnail.jpg");

  ffmpeg.FS("unlink", files.input);
  ffmpeg.FS("unlink", files.output);
  ffmpeg.FS("unlink", files.thumb);

  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumbUrl);
  URL.revokeObjectURL(videoFile);
  // 작업 끝나고 속도 빠르게 하기 위해 언링크와 url제거

  actionBtn.disabled = false;
  actionBtn.innerText = "Record Again";
  actionBtn.addEventListener("click", handleStart);
};

const handleStop = () => {
  if (stopTimer) {
    clearTimeout(stopTimer);
    stopTimer = null;
  }
  actionBtn.innerText = "Download Recording";
  actionBtn.removeEventListener("click", handleStop);
  actionBtn.addEventListener("click", handleDownload);
  recorder.stop();
};

const handleStart = () => {
  actionBtn.innerText = "Stop Recording";
  actionBtn.removeEventListener("click", handleStart);
  actionBtn.addEventListener("click", handleStop);
  //   하나의 버튼으로 배타적인 두 개의 콜백 실행해야 하므로 remove 후 add
  recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
  recorder.ondataavailable = (event) => {
    // 녹화가 끝나면 이벤트가 발생해서 실행되는 이벤트 리스너.
    //  handlestop으로 넘어가도 이벤트 듣고있음.
    videoFile = URL.createObjectURL(event.data);
    // 브라우저 메모리에 저장된 동영상(실제 url이 아님)
    video.srcObject = null;
    video.src = videoFile;
    // 비디오 재생화면을 녹화된 파일로 대체
    video.loop = true;
    video.play();
  };
  recorder.start();
  const stopTimer = setTimeout(handleStop, 5000);
  //   녹화 끝나면 dataavailable 생성됨.
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: {
      width: 1024,
      height: 576,
    },
  });
  //   카메라와 마이크 사용권한 묻고 허용하면 사용가능하게
  video.srcObject = stream;
  // srcObject는 비디오가 가지는 데이터
  video.play();
};

init();

actionBtn.addEventListener("click", handleStart);
