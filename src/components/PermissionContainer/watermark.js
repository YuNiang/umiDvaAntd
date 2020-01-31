function canvasWM ({
  root = 'ant-layout-content',
  container = document.getElementsByClassName(root)[0],
  width = '200px',
  height = '150px',
  textAlign = 'center',
  textBaseline = 'middle',
  font = "12px monospace",
  fillStyle = 'rgba(144, 131, 131, 0.09)',
  content = '马云（I0001）',
  rotate = '-20',
  zIndex = 1000
} = {}) {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('width', width);
  canvas.setAttribute('height', height);
  const ctx = canvas.getContext("2d");
  ctx.textAlign = textAlign;
  ctx.textBaseline = textBaseline;
  ctx.font = font;
  ctx.fillStyle = fillStyle;
  ctx.rotate(Math.PI / 180 * rotate);
  ctx.fillText(content, parseFloat(width) / 4, parseFloat(height) / 2);
  const base64Url = canvas.toDataURL();
  const watermarkDiv = document.createElement("div");
  if (container) {
    const newContainer = container;
    newContainer.style.position = 'relative';
  }
  watermarkDiv.setAttribute('style', `
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: ${zIndex};
    pointer-events: none;
    background-repeat: repeat;
    background-image: url('${base64Url}')`);
  
  container.insertBefore(watermarkDiv, container.fistChild);
}

const watermark = (root, workUser) => {
  canvasWM({ 
    root,
    content: workUser 
  })
}

export default watermark;
