import { GameView, Vector, Matrix, Drawable, Primatives } from "./Engine"

let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("GameView");

let view: GameView = new GameView(canvas);

view.gl.clear(view.gl.COLOR_BUFFER_BIT | view.gl.DEPTH_BUFFER_BIT);

let vertexShaderSource: string = [
    "attribute vec3 position;",
    "uniform mat4 model;",
    "uniform mat4 view;",
    "uniform mat4 projection;",
    "void main() {",
    "   gl_Position = (projection * view * model) * vec4(position, 1);",
    "}"
].join("\n");

let vertexShader: WebGLShader = view.CreateShader(
    vertexShaderSource,
    view.gl.VERTEX_SHADER);

let fragmentShaderSource: string = [
    "precision highp float;",
    "uniform vec4 color;",
    "void main() {",
    "   gl_FragColor = color;",
    "}"
].join("\n");

let fragmentShader: WebGLShader = view.CreateShader(
    fragmentShaderSource,
    view.gl.FRAGMENT_SHADER);

let shaderProgram = view.CreateProgram(vertexShader, fragmentShader);

view.gl.useProgram(shaderProgram);

let projectionMatrix: Matrix = Matrix.MakePerspective((60 / 180) * Math.PI, view.canvas.width / view.canvas.height, 0.1, 1000);

view.gl.uniformMatrix4fv(
    view.gl.getUniformLocation(shaderProgram, 'projection'),
    false,
    projectionMatrix.ToFloat32Array());

let time: number = 0;

let grid: Primatives.Axes = new Primatives.Axes();

setInterval(() => {
    view.gl.clear(view.gl.COLOR_BUFFER_BIT | view.gl.DEPTH_BUFFER_BIT);
    time += 1000 / 30;

    let viewMatrix: Matrix = Matrix.MakeLookAt(new Vector(Math.sin(time / 500) * 5 , 2, Math.cos(time / 500) * 5), new Vector(0, 0, 0), Vector.Up).Inverse();

    view.gl.uniformMatrix4fv(
        view.gl.getUniformLocation(shaderProgram, 'view'),
        false,
        viewMatrix.ToFloat32Array());

    view.DrawObject(grid, shaderProgram);
}, 1000 / 30);