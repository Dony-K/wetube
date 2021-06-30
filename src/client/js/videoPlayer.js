// const video = document.querySelector("video");
// const playBtn = document.getElementById("play");
// const playBtnIcon = playBtn.querySelector("i");
// const muteBtn = document.getElementById("mute");
// const muteBtnIcon = muteBtn.querySelector("i");
// const volumeRange = document.getElementById("volume");
// const currenTime = document.getElementById("currenTime");
// const totalTime = document.getElementById("totalTime");
// const timeline = document.getElementById("timeline");
// const fullScreenBtn = document.getElementById("fullScreen");
// const fullScreenIcon = fullScreenBtn.querySelector("i");
// const videoContainer = document.getElementById("videoContainer");
// const videoControls = document.getElementById("videoControls");

// let controlsTimeout = null;
// // 비디오에서 마우스 떠난 후 컨트롤 사라지게 타임아웃
// let controlsMovementTimeout = null;
// // 비디오에서 마우스 움직이다가 멈춘 후 컨트롤바 사라지게 타임아웃.
// let volumeValue = 0.5;
// video.volume = volumeValue;

// const handlePlayClick = (e) => {
//   if (video.paused) {
//     video.play();
//   } else {
//     video.pause();
//   }
//   playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
// };

// const handleMuteClick = (e) => {
//   if (video.muted) {
//     video.muted = false;
//   } else {
//     video.muted = true;
//   }
//   muteBtnIcon.classList = video.muted
//     ? "fas fa-volume-mute"
//     : "fas fa-volume-up";
//   volumeRange.value = video.muted ? 0 : volumeValue;
// };

// const handleVolumeChange = (event) => {
//   const {
//     target: { value },
//   } = event;
//   if (video.muted) {
//     video.muted = false;
//     muteBtn.innerText = "Mute";
//   }
//   volumeValue = value;
//   video.volume = value;
// };

// const formatTime = (seconds) =>
//   new Date(seconds * 1000).toISOString().substr(14, 5);
// //new Date는 1970년 1월 1일 09:00
// //new Date(1000)= 09:01 ->미리세크 단위
// //toISOString()은 한국시간 09:00을 00:00으로 초기화
// //substr(시작 위치, 시작위치로 부터 자를 단어의 갯수)

// const handleLoadedMetadata = () => {
//   totalTime.innerText = formatTime(Math.floor(video.duration));
//   timeline.max = Math.floor(video.duration);
// };

// const handleTimeUpdate = () => {
//   currenTime.innerText = formatTime(Math.floor(video.currentTime));
//   timeline.value = Math.floor(video.currentTime);
// };

// const handleTimelineChange = (event) => {
//   const {
//     target: { value },
//   } = event;
//   video.currentTime = value;
// };

// const handleFullscreen = () => {
//   const fullscreen = document.fullscreenElement;
//   //전체화면 요소 리턴해줌.
//   if (fullscreen) {
//     document.exitFullscreen();
//     fullScreenIcon.classList = "fas fa-expand";
//   } else {
//     videoContainer.requestFullscreen();
//     fullScreenIcon.classList = "fas fa-compress";
//   }
// };

// const hideControls = () => videoControls.classList.remove("showing");

// const handleMouseMove = () => {
//   if (controlsTimeout) {
//     clearTimeout(controlsTimeout);
//     controlsTimeout = null;
//   }
//   if (controlsMovementTimeout) {
//     clearTimeout(controlsMovementTimeout);
//     controlsMovementTimeout = null;
//   }
//   videoControls.classList.add("showing");
//   controlsMovementTimeout = setTimeout(hideControls, 3000);
//   // 타임아웃은 특정 id를 반환
// };

// const handleMouseLeave = () => {
//   controlsTimeout = setTimeout(hideControls, 3000);
// };

// playBtn.addEventListener("click", handlePlayClick);
// muteBtn.addEventListener("click", handleMuteClick);
// volumeRange.addEventListener("input", handleVolumeChange);
// video.addEventListener("loadeddata", handleLoadedMetadata);
// // 메타데이터는 비디오를 제외한 비디오와 관련된 모든 데이터를 지칭
// video.addEventListener("timeupdate", handleTimeUpdate);
// videoContainer.addEventListener("mousemove", handleMouseMove);
// videoContainer.addEventListener("mouseleave", handleMouseLeave);
// timeline.addEventListener("input", handleTimelineChange);
// fullScreenBtn.addEventListener("click", handleFullscreen);

const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayClick = (e) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleMuteClick = (e) => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtnIcon.classList = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
  volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    video.muted = false;
    muteBtn.innerText = "Mute";
  }
  volumeValue = value;
  video.volume = value;
};

const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substr(14, 5);

const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};

const handleTimelineChange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const handleFullscreen = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
    fullScreenIcon.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullScreenIcon.classList = "fas fa-compress";
  }
};

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  videoControls.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls, 3000);
  // 비디오에서 마우스 움직이고 3초 후 컨트롤 사라지게
};

const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 3000);
  // 비디오에서 마우스 떠나면 컨트롤 사라지게
};

const handleEnded = () => {
  const { id } = videoContainer.dataset;
  // html에 있는 data를 가져옴.
  fetch(`/api/videos/${id}/view`, {
    method: "POST",
  });
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleEnded);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullscreen);
