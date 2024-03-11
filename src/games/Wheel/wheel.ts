// src/games/Wheel/wheel.ts
/*
 * Author: BankkRoll
 */
import * as PIXI from "pixi.js";

export const radius = 200;

const glowAnimatedRing = (
  app: PIXI.Application,
  radius: number,
  thickness: number = 5,
  colors: number[] = [0x3366ff, 0x0000ff, 0x272238],
): (() => void) => {
  const ringsContainer = new PIXI.Container();
  ringsContainer.x = app.screen.width / 2;
  ringsContainer.y = app.screen.height / 2;
  app.stage.addChild(ringsContainer as PIXI.DisplayObject);

  const baseRing = new PIXI.Graphics();
  baseRing.lineStyle(thickness, 0xffffff);
  baseRing.drawCircle(0, 0, radius);
  ringsContainer.addChild(baseRing as PIXI.DisplayObject);

  colors.forEach((color, index) => {
    const ring = new PIXI.Graphics();
    ring.lineStyle(thickness, color);
    const ringRadius = radius + thickness * 2 * (index + 1);
    ring.drawCircle(0, 0, ringRadius);
    ringsContainer.addChild(ring as PIXI.DisplayObject);
  });

  return () => {
    app.stage.removeChild(ringsContainer as PIXI.DisplayObject);
    ringsContainer.destroy({
      children: true,
      texture: true,
      baseTexture: true,
    });
  };
};

export const drawTicker = (app: PIXI.Application, radius: number): void => {
  glowAnimatedRing(app, radius);
  const ticker = new PIXI.Graphics();
  ticker.beginFill(0x0000ff);
  ticker.lineStyle(3, 0xffffff);
  ticker.drawPolygon([-25, 0, 25, 0, 0, 40]);
  ticker.endFill();
  app.stage.addChild(ticker as PIXI.DisplayObject);

  ticker.x = app.screen.width / 2;
  ticker.y = app.screen.height / 2 - radius - 18;

  const reflection = new PIXI.Graphics();
  reflection.beginFill(0xffffff);
  reflection.drawPolygon([-30, 0, 30, 0, 0, 50]);
  reflection.endFill();
  reflection.alpha = 0.2;
  reflection.x = ticker.x;
  reflection.y = ticker.y;
  app.stage.addChild(reflection as PIXI.DisplayObject);
};

export const drawWheel = (
  wheel: PIXI.Container,
  segments: string[],
  segmentColors: string[],
): void => {
  wheel.removeChildren();

  const segmentAngle = 360 / segments.length;

  const textStyle = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 32,
    fontWeight: "bold",
    fill: ["#ffffff", "#00ccff"],
    stroke: "#000000",
    strokeThickness: 4,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 2,
    dropShadowDistance: 6,
  });

  segments.forEach((segment, index) => {
    const colorNumber = parseInt(segmentColors[index].replace(/^#/, ""), 16);

    const gradient = new PIXI.Graphics();
    gradient.beginFill(colorNumber);
    gradient.lineStyle(2, 0xffffff, 1);
    gradient
      .moveTo(0, 0)
      .arc(
        0,
        0,
        radius,
        index * segmentAngle * (Math.PI / 180),
        (index + 1) * segmentAngle * (Math.PI / 180),
      )
      .closePath();
    gradient.endFill();
    wheel.addChild(gradient as PIXI.DisplayObject);

    const labelAngle = (index + 0.5) * segmentAngle * (Math.PI / 180);
    const labelText = new PIXI.Text(segment, textStyle);
    labelText.anchor.set(0.5);
    labelText.rotation = labelAngle + Math.PI / 2;
    labelText.position.set(
      radius * 0.88 * Math.cos(labelAngle),
      radius * 0.88 * Math.sin(labelAngle),
    );
    wheel.addChild(labelText as PIXI.DisplayObject);
  });
};
