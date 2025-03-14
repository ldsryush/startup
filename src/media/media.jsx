import React from 'react';

export function Media(props) {
  React.useEffect(() => {
    const ctx = document.getElementById('canvasDemo').getContext('2d');
    ctx.beginPath();
    ctx.arc(150, 100, 50, 0, 2 * Math.PI);
    ctx.fillStyle = 'blue';
    ctx.strokeStyle = 'blue';
    ctx.fill();
    ctx.stroke();
  }, []);

  return (
    <div className="container">
      <h2>My Images!</h2>
      <img
        alt="Arches"
        src="https://media.cntraveler.com/photos/53da3b426dec627b149dd963/16:9/w_1920,c_limit/sundance-resort-sundance-sundance-utah-104849-1.jpg"
        width="300"
        height="300"
      />
      <h2>Audio</h2>
      <audio controls src="https://github.com/webprogramming260/.github/blob/main/profile/html/media/htmlAudio.mp3?raw=true"></audio>
      <h2>Video</h2>
      <video controls width="300">
        <source src="https://www.redbull.com/ca-en/best-snowboard-videos" type="video/mp4" />
      </video>
      <h2>Canvas</h2>
      <canvas id="canvasDemo" width="300" height="200" style={{ border: '1px solid #000000' }}></canvas>
      <h2>SVG</h2>
      <svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" stroke="red" fill="red" style={{ border: '1px solid #000000' }} width="300" height="300">
        <circle cx="150" cy="100" r="50" />
      </svg>
    </div>
  );
}
