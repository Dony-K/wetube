const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const delBtns = document.querySelectorAll(".commentDel");
const comments = document.querySelectorAll(".video__comment");

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  console.log(id);
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const button = document.createElement("button");
  button.classList.add("commentDel");
  button.innerText = "❌";
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(button);
  videoComments.prepend(newComment);
  newComment.addEventListener("click", handleDelete);
};
// JS로 HTML코드를 만들어 실시간 업데이트처럼 보이게 만듦.

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  //   비디오의 id 받아오기 위해
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    //   json을 보낸다고 알려줘서 백엔드가 express.json처리하게.
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    // 비디오컨트롤러에서 보내는 json 변수와 이름 같아야 함.
    addComment(text, newCommentId);
  }
};

const handleDelete = async (event) => {
  const comment = event.target.parentElement;
  const commentId = comment.dataset.id;
  const response = await fetch(`/api/comments/${commentId}/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  comment.remove();
};

if (form) {
  form.addEventListener("submit", handleSubmit);
  // btn.addEventListener("click")은 폼을 제출하므로 submit으로
  for (const delBtn of delBtns) {
    delBtn.addEventListener("click", handleDelete);
  }
}
// 로그인 안 하면 form이 없음. 그러면 getElement 에러남.
