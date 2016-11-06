import { GameView } from "./GameView"

let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("GameView");

let view: GameView = new GameView(canvas);