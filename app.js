const canvas = document.querySelector("canvas");
const form = document.querySelector(".signature-pad-form");
const clearButton = document.querySelector(".clear-button");
const downloadButton = document.getElementById("downloadBtn");
const submitButton = document.getElementById("submitBtn");
const footer = document.querySelector(".footer");
//
const blank = document.createElement("canvas");
blank.width = canvas.width;
blank.height = canvas.height;
const ctx = canvas.getContext("2d");
let writingMode = false;
const checkIsMobile = () => {
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    // true for mobile device
    console.log("On Mobile Device");
    return true;
  } else {
    // false for not mobile device
    console.log("On PC");
    return false;
  }
};
let iSMobile = checkIsMobile();

//
const isCanvasEmpty = (canvas) => {
  return canvas.toDataURL() === blank.toDataURL();
};
// submit Handler
submitButton.addEventListener("click", (event) => {
  event.preventDefault();
  if (isCanvasEmpty(canvas)) {
    alert("還沒簽名喔🤣");
    return;
  }
  downloadButton.classList.remove("hidden");
  const imageURL = canvas.toDataURL();
  let image = footer.querySelector("img");
  if (image) image.src = imageURL;
  else {
    image = document.createElement("img");
    image.src = imageURL;
    footer.insertAdjacentElement("afterbegin", image);
  }
  // clearPad();
});
// clearPad
const clearPad = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const image = footer.querySelector("img");
  if (image) {
    image.remove();
  }
};
// clearButton
clearButton.addEventListener("click", (event) => {
  event.preventDefault();
  clearPad();
  downloadButton.classList.add("hidden");
});

// downloadBtn
downloadButton.addEventListener("click", async (event) => {
  event.preventDefault();
  const image = footer.querySelector("img");
  const imageURL = image.src;
  // create download link
  const link = document.createElement("a");
  link.href = imageURL;
  link.download = "signature";
  link.click();
});

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
  canvas.addEventListener("touchstart", handlePointerDown);
  canvas.addEventListener("touchend", handlePointerUp);
  canvas.addEventListener("touchmove", handlePointerMove);
} else {
  canvas.addEventListener("pointerdown", handlePointerDown);
  canvas.addEventListener("pointerup", handlePointerUp);
  canvas.addEventListener("pointermove", handlePointerMove);
}
