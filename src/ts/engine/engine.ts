import {Vector} from "./vector";
import {Drawable} from "./drawable";
import {Transform} from "./transform";
import {Matrix} from "./matrix";
import {Color} from "./color";
import {Camera} from "./camera";
import * as Primatives from "./primatives/primatives";

export {
    Vector,
    Drawable,
    Transform,
    Matrix,
    Primatives,
    Color,
    Camera
};


export class GameView {
    
    gl: WebGLRenderingContext = null;
    
    constructor(public canvas: HTMLCanvasElement) {

        this.gl =
            canvas.getContext("webgl") ||
            canvas.getContext("experimental-webgl");

        if (this.gl) {
            this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.depthFunc(this.gl.LEQUAL);
            this.gl.enable(this.gl.CULL_FACE);
		    this.gl.cullFace(this.gl.FRONT);
        } else {
            alert("Unable to initialise WebGL Context");
        }
    }

    CreateProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
        
        let program: WebGLProgram = this.gl.createProgram();

        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);

        this.gl.linkProgram(program);

        if (this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            return program;
        }

        return null;
    }

    /**
     * Creates a WebGL shader
     * @param {string} source The GLSL source for the shader
     * @param {number} type The type of shader
     */
    CreateShader(source: string, type: number): WebGLShader {
        
        let shader: WebGLShader = this.gl.createShader(type);

        this.gl.shaderSource(shader, source);

        this.gl.compileShader(shader);

        if (this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            return shader;
        }

        console.log("Error compiling shader of type: " + (type == 35632 ? "fragmentShader": "vertexShader"));

        throw this.gl.getShaderInfoLog(shader);
    }

    CreateLightingProgram(): WebGLProgram {
        let vertexShaderSource: string = [
            "attribute vec3 position;",
            "attribute vec3 normal;",
            "uniform mat4 model;",
            "uniform mat4 view;",
            "uniform mat4 projection;",
            "uniform vec3 light1d;",
            "uniform vec3 light2d;",
            "varying highp float vLight1;",
            "varying highp float vLight2;",
            "void main() {",
            "   vLight1 =",
            "       max(dot(normal, normalize(light1d) ), 0.0);",
            "   vLight2 =",
            "       max(dot(normal, normalize(light2d) ), 0.0);",
            "   gl_Position = (projection * view * model) * vec4(position, 1);",
            "}"
        ].join("\n");

        let vertexShader: WebGLShader = this.CreateShader(
            vertexShaderSource,
            this.gl.VERTEX_SHADER);

        let fragmentShaderSource: string = [
            "precision highp float;",
            "uniform vec4 color;",
            "uniform vec4 ambient;",
            "varying highp float vLight1;",
            "varying highp float vLight2;",
            "uniform vec4 light1c;",
            "uniform vec4 light2c;",
            "void main() {",
            "   gl_FragColor = (ambient + color) * (",
            "       vec4(light1c.rgb * vLight1, 1.0) +",
            "       vec4(light2c.rgb * vLight2, 1.0));",
            "}"
        ].join("\n");

        let fragmentShader: WebGLShader = this.CreateShader(
            fragmentShaderSource,
            this.gl.FRAGMENT_SHADER);


        let lightingProgram: WebGLProgram = this.CreateProgram(vertexShader, fragmentShader);

        this.gl.useProgram(lightingProgram);
        this.gl.uniform3fv(
            this.gl.getUniformLocation(lightingProgram, "light1d"),
            new Vector(3, 2, 1).ToArray());
        this.gl.uniform3fv(
            this.gl.getUniformLocation(lightingProgram, "light2d"),
            new Vector(-1, -3, -2).ToArray());
        this.gl.uniform4fv(
            this.gl.getUniformLocation(lightingProgram, "ambient"),
            [0.1, 0.1, 0.1, 1.0]);
        this.gl.uniform4fv(
            this.gl.getUniformLocation(lightingProgram, "light1c"),
            [0.85, 0.85, 0.85, 1.0]);
        this.gl.uniform4fv(
            this.gl.getUniformLocation(lightingProgram, "light2c"),
            [0.25, 0.25, 0.25, 1.0]);

        return lightingProgram;
    }
    
    CreateBasicProgram(): WebGLProgram {
        let vertexShaderSource: string = [
            "attribute vec3 position;",
            "uniform mat4 model;",
            "uniform mat4 view;",
            "uniform mat4 projection;",
            "void main() {",
            "   gl_Position = (projection * view * model) * vec4(position, 1);",
            "}"
        ].join("\n");

        let vertexShader: WebGLShader = this.CreateShader(
            vertexShaderSource,
            this.gl.VERTEX_SHADER);

        let fragmentShaderSource: string = [
            "precision highp float;",
            "uniform vec4 color;",
            "void main() {",
            "   gl_FragColor = color;",
            "}"
        ].join("\n");

        let fragmentShader: WebGLShader = this.CreateShader(
            fragmentShaderSource,
            this.gl.FRAGMENT_SHADER);

        return this.CreateProgram(vertexShader, fragmentShader);
    }

    DrawObject(object: Drawable, program: WebGLProgram, view: Matrix, projection: Matrix) {
        this.gl.useProgram(program);
        this.gl.uniformMatrix4fv(
            this.gl.getUniformLocation(program, 'view'),
            false,
            view.ToFloat32Array());
        this.gl.uniformMatrix4fv(
            this.gl.getUniformLocation(program, 'projection'),
            false,
            projection.ToFloat32Array());
        object.Draw(this.gl, program);
    }
}

