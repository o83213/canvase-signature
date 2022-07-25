const canvas = document.querySelector("canvas");
const form = document.querySelector(".signature-pad-form");
const clearButton = document.querySelector(".clear-button");
const ctx = canvas.getContext("2d");
let writingMode = false;
const checkIsMobile = () => {
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    // true for mobile device
    alert("On Mobile Device");
    return true;
  } else {
    // false for not mobile device
    alert("On PC");
    return false;
  }
};
let iSMobile = checkIsMobile();
// create imageBlock
const image = document.querySelector(".signature-result");
form.appendChild(image);
// submit Handler
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const imageURL = canvas.toDataURL();
  image.src = imageURL;
  clearPad();
});
// clearPad
const clearPad = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};
// clearButton
clearButton.addEventListener(
  "click",
  (e) => {
    clearPad();
  },
  { passive: true }
);
// getTargetPosition
const getTargetPosition = (event) => {
  let positionX = 0;
  let positionY = 0;
  if (iSMobile) {
    const touch = event.touches[0];
    positionX = touch.clientX - event.target.getBoundingClientRect().x;
    positionY = touch.clientY - event.target.getBoundingClientRect().y;
  } else {
    positionX = event.clientX - event.target.getBoundingClientRect().x;
    positionY = event.clientY - event.target.getBoundingClientRect().y;
  }
  return [positionX, positionY];
};
// handlePointerMove
const handlePointerMove = (event) => {
  if (!writingMode) return;
  const [positionX, positionY] = getTargetPosition(event);
  ctx.lineTo(positionX, positionY);
  ctx.stroke();
};
// handlePointerUp
const handlePointerUp = () => {
  writingMode = false;
};

// handlePointerDown
const handlePointerDown = (event) => {
  writingMode = true;
  ctx.beginPath();
  const [positionX, positionY] = getTargetPosition(event);
  ctx.moveTo(positionX, positionY);
};

ctx.lineWidth = 3;
ctx.lineJoin = ctx.lineCap = "round";
// switch between Pc and mobile
if (iSMobile) {
  canvas.addEventListener("touchstart", handlePointerDown, { passive: true });
  canvas.addEventListener("touchend", handlePointerUp, { passive: true });
  canvas.addEventListener("touchmove", handlePointerMove, { passive: true });
} else {
  canvas.addEventListener("pointerdown", handlePointerDown, { passive: true });
  canvas.addEventListener("pointerup", handlePointerUp, { passive: true });
  canvas.addEventListener("pointermove", handlePointerMove, { passive: true });
}
