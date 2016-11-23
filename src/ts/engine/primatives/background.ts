import {GameView} from "../engine";
import {Drawable} from "../drawable";
import {Transform} from "../transform";
import {Color} from "../color";
import {Matrix} from "../matrix";

export class Background implements Drawable {
    public color1: Color;
    public color2: Color;

    private shader: WebGLProgram;

    private vertexBuffer: WebGLBuffer;
    private colorBuffer: WebGLBuffer;

    constructor(view: GameView) {
        let vertexShaderSource: string = [
            "attribute vec3 position;",
            "attribute vec4 color;",
            "uniform mat4 transform;",
            "varying vec4 vColor;",
            "void main() {",
            "   vColor = color;",
            "   gl_Position = transform * vec4(position, 1);",
            "}"
        ].join("\n");

        let vertexShader: WebGLShader = view.CreateShader(
            vertexShaderSource,
            view.gl.VERTEX_SHADER);

        let fragmentShaderSource: string = [
            "precision highp float;",
            "varying vec4 vColor;",
            "void main() {",
            "   gl_FragColor = vColor;",
            "}"
        ].join("\n");

        let fragmentShader: WebGLShader = view.CreateShader(
            fragmentShaderSource,
            view.gl.FRAGMENT_SHADER);

        this.shader = view.CreateProgram(vertexShader, fragmentShader);

        this.color1 = new Color(1, 1, 1);
        this.color2 = new Color(0, 0, 0);
        
        this.vertexBuffer = view.gl.createBuffer();

        view.gl.bindBuffer(view.gl.ARRAY_BUFFER, this.vertexBuffer);

        view.gl.bufferData(view.gl.ARRAY_BUFFER, new Float32Array([
            -1, -1, 0,
            1, 1, 0,
            1, -1, 0,
            1, 1, 0,
            -1, -1, 0,
            -1, 1, 0
        ]), view.gl.STATIC_DRAW);

        this.colorBuffer = view.gl.createBuffer();
    }

    Draw(gl: WebGLRenderingContext, shader: WebGLProgram) {
        gl.useProgram(this.shader);
        
        let shaderProgramNormalAttributeLocation = gl.getAttribLocation(this.shader, "color");

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);   

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            this.color1.r, this.color1.g, this.color1.b, 1,
            this.color2.r, this.color2.g, this.color2.b, 1,
            this.color1.r, this.color1.g, this.color1.b, 1,
            this.color2.r, this.color2.g, this.color2.b, 1,
            this.color1.r, this.color1.g, this.color1.b, 1,
            this.color2.r, this.color2.g, this.color2.b, 1
        ]), gl.STATIC_DRAW);  

        gl.enableVertexAttribArray(shaderProgramNormalAttributeLocation);

        gl.vertexAttribPointer(
            shaderProgramNormalAttributeLocation,
            4,
            gl.FLOAT,
            true,
            0,
            0);

    let shaderProgramVertexAttributeLocation = gl.getAttribLocation(this.shader, "position");

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

        gl.enableVertexAttribArray(shaderProgramVertexAttributeLocation);

        gl.vertexAttribPointer(
            shaderProgramVertexAttributeLocation,
            3,
            gl.FLOAT,
            false,
            0,
            0);

        gl.uniformMatrix4fv(
            gl.getUniformLocation(this.shader, 'transform'),
            false,
            Matrix.Identity.ToFloat32Array());

        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
}