import { useEffect, useRef } from "react";
import "./App.css";
import { Application, Assets, Container, Graphics, HTMLText, Sprite, Texture, VideoSource } from "pixi.js";
import { FancyButton } from "@pixi/ui";

function App() {
  const canvasContainer = useRef<HTMLDivElement>(document.querySelector("#canvasContainer"));
  let flag = false;
  useEffect(() => {
    if (flag) {
      return;
    }
    flag = true;
    console.count();

    const app = new Application();
    const { width, height } = window.screen;
    const sourceList = [
      //   "https://github.com/li-yongyu/pixi-demo/blob/master/src/assets/img.jpg?raw=true",
      //   "https://github.com/li-yongyu/pixi-demo/raw/master/src/assets/video.mp4",
      //   "https://www.w3schools.com/html/movie.mp4",
      "https://proxy-github-img.yongyu0629.workers.dev/li-yongyu/pixi-demo/blob/master/src/assets/img.jpg?raw=true",
      "https://proxy-github-img.yongyu0629.workers.dev/li-yongyu/pixi-demo/blob/master/src/assets/video.mp4?raw=true",
    ];
    app
      .init({
        width: width,
        height: height,
        background: "#101010",
        // resolution: Math.max(globalThis.devicePixelRatio || 1, 1),
        resolution: 1,
        antialias: true,
        eventMode: "passive",
        // resizeTo: window
      })
      .then(() => {
        // PIXI devtool
        if (!(globalThis as any).__PIXI_APP__) {
          (globalThis as any).__PIXI_APP__ = app;
        }
        app.stage.position.set(width / 2, height / 2);
        canvasContainer?.current?.appendChild(app.canvas);
        app.stage.eventMode = "static";
        // loading button
        const button = new FancyButton({
          defaultView: new Graphics().roundRect(0, 0, 300, 150, 30).fill({ color: "#42B3D5", alpha: 0.5 }),
          hoverView: new Graphics().roundRect(0, 0, 300, 150, 30).fill({ color: "#1890ff", alpha: 0.5 }),
          pressedView: new Graphics().roundRect(0, 0, 300, 150, 30).fill({ color: "#3073AE", alpha: 0.5 }),
          text: new HTMLText({
            text: "Load",
            alpha: 1,
            style: {
              fill: "#fff",
              fontFamily: "Arial",
              fontSize: 24,
              letterSpacing: 0,
              trim: true,
            },
          }),
          anchor: 0.5,
        });
        app.stage.addChild(button);
        button.once("pointerdown", (e) => {
          Assets.load(sourceList, (progress) => {
            button.text = `Load...${progress * 100}%`;
            if (progress == 1) {
              app.stage.removeChild();
              button.destroy();
              Assets.load(
                "https://proxy-github-img.yongyu0629.workers.dev/li-yongyu/pixi-demo/blob/master/src/assets/img.jpg?raw=true"
              ).then((texture) => {
                console.log("img");
                const sprite = new Sprite(texture);
                sprite.width = width;
                sprite.height = height;
                sprite.anchor.set(0.5, 0.5);
                app.stage.addChild(sprite);
              });
              Assets.load(
                "https://proxy-github-img.yongyu0629.workers.dev/li-yongyu/pixi-demo/blob/master/src/assets/video.mp4"
              ).then((texture: Texture) => {
                console.log("video");
                const videoSource = (texture._source as VideoSource).resource;
                videoSource.autoplay = false;
                videoSource.loop = true;
                videoSource.muted = false;
                videoSource.currentTime = 0;
                videoSource.volume = 1;
                videoSource.play();

                const sprite = new Sprite(texture);
                sprite.width = videoSource.videoWidth;
                sprite.height = videoSource.videoHeight;
                sprite.anchor.set(0.5, 0.5);
                app.stage.addChild(sprite);

                // HTML element
                document.querySelector("#canvasContainer")?.appendChild(videoSource);
              });
            }
          });
        });
      });
  });

  return <div ref={canvasContainer} className="App" id="canvasContainer"></div>;
}

export default App;
