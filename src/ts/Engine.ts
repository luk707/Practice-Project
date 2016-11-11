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

        this.gl.deleteShader(shader);
        
        return null;
    }

    DrawObject(object: Drawable, shaderProgram: WebGLProgram) {
        object.Draw(this.gl, shaderProgram);
    }
}

export interface Drawable {
    
    Draw(gl: WebGLRenderingContext, shaderProgram: WebGLProgram): void;
}

export abstract class Screen implements Drawable {
    
    abstract Draw(gl: WebGLRenderingContext, shaderProgram: WebGLProgram): void;
}

export class ScreenManager extends Screen {
    
    activeScreen: Screen = null;
    nextScreen: Screen = null;

    constructor(screen: Screen) {
        super();
        this.activeScreen = screen;
    }

    Draw(gl: WebGLRenderingContext, shaderProgram: WebGLProgram): void {

    }
}

export class Vector {

    constructor(public x: number = 0, public y: number = 0, public z: number = 0) { }

    static Zero: Vector = new Vector();

    static Unit: Vector = new Vector(1, 1, 1);

    static Right: Vector = new Vector(1, 0, 0);
    static Up: Vector = new Vector(0, 1, 0);
    static forward: Vector = new Vector(0, 0, 1);

    static Dot(a: Vector, b: Vector): number {
        return (a.x * b.x) + (a.y * b.y) + (a.z * b.z);
    }

    static Cross(a: Vector, b: Vector): Vector {
        return new Vector(
            a.y * b.z - a.z * b.y,
            a.z * b.x - a.x * b.z,
            a.x * b.y - a.y * b.x);
    }

    Normalised(): Vector {
        let length: number = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2))
        if (length > 0.0001) {
            return new Vector(this.x / length, this.y / length, this.z / length);
        } else {
            return Vector.Zero;
        }
    }

    static Subtract(a: Vector, b: Vector): Vector {
        return new Vector(a.x - b.x, a.y - b.y, a.z - b.z);
    }
}

export class Transform {
    constructor(public position: Vector = Vector.Zero, public scale: Vector = Vector.Unit) { }

    ToMatrix(): Matrix {
        return new Matrix([
            this.scale.x, 0, 0, 0,
            0, this.scale.y, 0, 0,
            0, 0, this.scale.z, 0,
            this.position.x,
            this.position.y,
            this.position.z,
            1
        ]);
    }
}

export class Matrix {

    constructor(public data: Array<number>) { }

    static Identity: Matrix = new Matrix([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);

    static MakePerspective(fov: number, aspect: number, near: number, far: number) {
        let f: number = Math.tan(Math.PI * 0.5 - 0.5 * fov);
        let range: number = 1.0 / (near - far);
        return new Matrix([
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (near + far) * range, -1,
            0, 0, near * far * range * 2, 0
        ]);
    }

    static MakeTranslation(delta: Vector): Matrix {
        return new Matrix([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            delta.x, delta.y, delta.z, 1
        ]);
    }

    static MakeScale(scale: Vector): Matrix {
        return new Matrix([
            scale.x, 0, 0, 0,
            0, scale.y, 0, 0,
            0, 0, scale.z, 0,
            0, 0, 0, 1
        ]);
    }

    static MakeLookAt(position: Vector, target: Vector, up: Vector) {
        let zBasis: Vector = Vector.Subtract(position, target).Normalised();
        let xBasis: Vector = Vector.Cross(up, zBasis);
        let yBasis: Vector = Vector.Cross(zBasis, xBasis);

        return new Matrix([
            xBasis.x, xBasis.y, xBasis.z, 0,
            yBasis.x, yBasis.y, yBasis.z, 0,
            zBasis.x, zBasis.y, zBasis.z, 0,
            position.x, position.y, position.z, 1
        ]);
    }

    Inverse(): Matrix {
        let m11 = this.data[0];
        let m12 = this.data[1];
        let m13 = this.data[2];
        let m14 = this.data[3];
        let m21 = this.data[4];
        let m22 = this.data[5];
        let m23 = this.data[6];
        let m24 = this.data[7];
        let m31 = this.data[8];
        let m32 = this.data[9];
        let m33 = this.data[10];
        let m34 = this.data[11];
        let m41 = this.data[12];
        let m42 = this.data[13];
        let m43 = this.data[14];
        let m44 = this.data[15];

        let det = 1.0 / (
            m11 * m22 * m33 * m44 +
            m11 * m23 * m34 * m42 +
            m11 * m24 * m32 * m43 +
            m12 * m21 * m34 * m43 +
            m12 * m23 * m31 * m34 +
            m12 * m24 * m33 * m41 +
            m13 * m21 * m32 * m44 +
            m13 * m22 * m34 * m12 +
            m13 * m24 * m31 * m42 +
            m14 * m21 * m33 * m42 +
            m14 * m22 * m31 * m43 +
            m14 * m23 * m32 * m41 -
            m11 * m22 * m34 * m43 -
            m11 * m23 * m32 * m44 -
            m11 * m24 * m33 * m42 -
            m12 * m21 * m33 * m44 -
            m12 * m23 * m34 * m41 -
            m12 * m24 * m31 * m43 -
            m13 * m21 * m34 * m42 -
            m13 * m22 * m31 * m44 -
            m13 * m24 * m32 * m41 -
            m14 * m21 * m32 * m43 -
            m14 * m22 * m33 * m41 -
            m14 * m23 * m31 * m42);

        return new Matrix([
            det * (m22 * m33 * m44 + m23 * m34 * m42 + m24 * m32 * m43 - m22 * m34 * m43 - m23 * m32 * m44 - m24 * m33 * m42),
            det * (m12 * m34 * m43 + m13 * m32 * m44 + m14 * m33 * m42 - m12 * m33 * m44 - m13 * m34 * m42 - m14 * m32 * m43),
            det * (m21 * m23 * m44 + m13 * m24 * m42 + m14 * m22 * m43 - m12 * m24 * m43 - m13 * m22 * m44 - m14 * m23 * m42),
            det * (m12 * m24 * m33 + m13 * m22 * m34 + m14 * m23 * m32 - m12 * m23 * m34 - m13 * m24 * m32 - m14 * m22 * m33),
            det * (m21 * m34 * m43 + m23 * m31 * m44 + m24 * m33 * m41 - m21 * m33 * m44 - m23 * m34 * m41 - m24 * m31 * m43),
            det * (m11 * m33 * m44 + m13 * m34 * m41 + m14 * m31 * m43 - m11 * m34 * m43 - m13 * m31 * m44 - m14 * m33 * m41),
            det * (m11 * m24 * m43 + m13 * m21 * m44 + m14 * m23 * m41 - m11 * m23 * m44 - m13 * m24 * m41 - m14 * m21 * m43),
            det * (m11 * m23 * m34 + m13 * m24 * m31 + m14 * m21 * m33 - m11 * m24 * m33 - m13 * m21 * m34 - m14 * m23 * m31),
            det * (m21 * m32 * m44 + m22 * m34 * m41 + m24 * m31 * m42 - m21 * m34 * m42 - m22 * m31 * m44 - m24 * m32 * m41),
            det * (m11 * m34 * m42 + m12 * m31 * m44 + m14 * m32 * m41 - m11 * m32 * m44 - m12 * m34 * m41 - m14 * m31 * m42),
            det * (m11 * m22 * m44 + m12 * m24 * m41 + m14 * m21 * m42 - m11 * m24 * m42 - m12 * m21 * m44 - m14 * m22 * m41),
            det * (m11 * m24 * m32 + m12 * m21 * m34 + m14 * m22 * m31 - m11 * m22 * m34 - m12 * m24 * m31 - m14 * m21 * m32),
            det * (m21 * m33 * m42 + m22 * m31 * m43 + m23 * m32 * m41 - m21 * m32 * m43 - m22 * m33 * m41 - m23 * m31 * m42),
            det * (m11 * m32 * m43 + m12 * m33 * m41 + m13 * m31 * m42 - m11 * m33 * m42 - m12 * m31 * m43 - m13 * m32 * m41),
            det * (m11 * m23 * m42 + m12 * m21 * m43 + m13 * m22 * m41 - m11 * m22 * m43 - m12 * m23 * m41 - m13 * m21 * m42),
            det * (m11 * m22 * m33 + m12 * m23 * m31 + m13 * m21 * m32 - m11 * m23 * m32 - m12 * m21 * m33 - m13 * m22 * m31)
        ]);
    }

    ToFloat32Array(): Float32Array {
        return new Float32Array(this.data);
    }

    static Multiply(a: Matrix, b: Matrix): Matrix {
        return new Matrix([
            a.data[0] * b.data[0] + a.data[1] * b.data[4] + a.data[2] * b.data[8] + a.data[3] * b.data[12],
            a.data[0] * b.data[1] + a.data[1] * b.data[5] + a.data[2] * b.data[9] + a.data[3] * b.data[13],
            a.data[0] * b.data[2] + a.data[1] * b.data[6] + a.data[2] * b.data[10] + a.data[3] * b.data[14],
            a.data[0] * b.data[3] + a.data[1] * b.data[7] + a.data[2] * b.data[11] + a.data[3] * b.data[15],

            a.data[4] * b.data[0] + a.data[5] * b.data[4] + a.data[6] * b.data[8] + a.data[7] * b.data[12],
            a.data[4] * b.data[1] + a.data[5] * b.data[5] + a.data[6] * b.data[9] + a.data[7] * b.data[13],
            a.data[4] * b.data[2] + a.data[5] * b.data[6] + a.data[6] * b.data[10] + a.data[7] * b.data[14],
            a.data[4] * b.data[3] + a.data[5] * b.data[7] + a.data[6] * b.data[11] + a.data[7] * b.data[15],

            a.data[8] * b.data[0] + a.data[9] * b.data[4] + a.data[10] * b.data[8] + a.data[11] * b.data[12],
            a.data[8] * b.data[1] + a.data[9] * b.data[5] + a.data[10] * b.data[9] + a.data[11] * b.data[13],
            a.data[8] * b.data[2] + a.data[9] * b.data[6] + a.data[10] * b.data[10] + a.data[11] * b.data[14],
            a.data[8] * b.data[3] + a.data[9] * b.data[7] + a.data[10] * b.data[11] + a.data[11] * b.data[15],

            a.data[12] * b.data[0] + a.data[13] * b.data[4] + a.data[14] * b.data[8] + a.data[15] * b.data[12],
            a.data[12] * b.data[1] + a.data[13] * b.data[5] + a.data[14] * b.data[9] + a.data[15] * b.data[13],
            a.data[12] * b.data[2] + a.data[13] * b.data[6] + a.data[14] * b.data[10] + a.data[15] * b.data[14],
            a.data[12] * b.data[3] + a.data[13] * b.data[7] + a.data[14] * b.data[11] + a.data[15] * b.data[15]
        ]);
    }
}

export namespace Primatives {

    export class Axes implements Drawable {

        transform: Transform = new Transform();

        Draw(gl: WebGLRenderingContext, shaderProgram: WebGLProgram) {
            
            let vertexBuffer: WebGLBuffer = gl.createBuffer();
            let shaderProgramVertexAttributeLocation: number = gl.getAttribLocation(shaderProgram, 'position');

            gl.uniformMatrix4fv(
                gl.getUniformLocation(shaderProgram, 'model'),
                false,
                this.transform.ToMatrix().ToFloat32Array());

            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

            gl.enableVertexAttribArray(shaderProgramVertexAttributeLocation);
            gl.vertexAttribPointer(
                shaderProgramVertexAttributeLocation,
                3,
                gl.FLOAT,
                false,
                0,
                0);

            gl.uniform4fv(
                gl.getUniformLocation(shaderProgram, "color"),
                [1.0, 0.0, 0.0, 1.0]);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([ 0, 0, 0, 1, 0, 0 ]), gl.STATIC_DRAW);
            gl.drawArrays(gl.LINES, 0, 2);

            gl.uniform4fv(
                gl.getUniformLocation(shaderProgram, "color"),
                [0.0, 1.0, 0.0, 1.0]);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([ 0, 0, 0, 0, 1, 0 ]), gl.STATIC_DRAW);
            gl.drawArrays(gl.LINES, 0, 2);

            gl.uniform4fv(
                gl.getUniformLocation(shaderProgram, "color"),
                [0.0, 0.0, 1.0, 1.0]);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([ 0, 0, 0, 0, 0, 1 ]), gl.STATIC_DRAW);
            gl.drawArrays(gl.LINES, 0, 2);
        }
    }

    export class Grid implements Drawable {

        transform: Transform = new Transform();

        constructor (public size: number) {

        }

        Draw(gl: WebGLRenderingContext, shaderProgram: WebGLProgram) {
            
            let vertexBuffer: WebGLBuffer = gl.createBuffer();
            let shaderProgramVertexAttributeLocation: number = gl.getAttribLocation(shaderProgram, 'position');

            gl.uniformMatrix4fv(
                gl.getUniformLocation(shaderProgram, 'model'),
                false,
                Matrix.Identity.ToFloat32Array());

            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

            gl.enableVertexAttribArray(shaderProgramVertexAttributeLocation);
            gl.vertexAttribPointer(
                shaderProgramVertexAttributeLocation,
                3,
                gl.FLOAT,
                false,
                0,
                0);

            gl.uniform4fv(
                gl.getUniformLocation(shaderProgram, "color"),
                [0.5, 0.5, 0.5, 1.0]);

            for (let i: number = -this.size; i <= this.size; i++) {
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([ -this.size, 0, i, this.size, 0, i ]), gl.STATIC_DRAW);
                gl.drawArrays(gl.LINES, 0, 2);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([ i, 0, -this.size, i, 0, this.size ]), gl.STATIC_DRAW);
                gl.drawArrays(gl.LINES, 0, 2);
            }
        }
    }

    export class Box implements Drawable {

        public transform: Transform;

        constructor() {

            this.transform = new Transform();            
        }

        private GenerateModel(): Matrix {
            let model: Matrix = Matrix.Identity;

            model = Matrix.Multiply(
                model,
                Matrix.MakeTranslation(this.transform.position));

            model = Matrix.Multiply(
                model,
                Matrix.MakeScale(this.transform.scale));
            
            return model;
        }

        Draw(gl: WebGLRenderingContext, shaderProgram: WebGLProgram) {

            let vertexBuffer: WebGLBuffer = gl.createBuffer();

            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                -1, -1, 1,
                1, 1, 1,
                1, -1, 1,

                1, 1, 1,
                -1, -1, 1,
                -1, 1, 1,

                -1, -1, -1,
                -1, 1, 1,
                -1, -1, 1,

                -1, -1, -1,
                -1, 1, -1,
                -1, 1, 1,

                -1, -1, -1,
                1, -1, -1,
                1, 1, -1,

                -1, -1, -1,
                1, 1, -1,
                -1, 1, -1,

                1, 1, 1,
                1, -1, -1,
                1, -1, 1,

                1, 1, -1,
                1, -1, -1,
                1, 1, 1,

                1, 1, 1,
                -1, 1, 1,
                1, 1, -1,

                -1, 1, -1,
                1, 1, -1,
                -1, 1, 1,

                -1, -1, 1,
                1, -1, 1,
                1, -1, -1,

                1, -1, -1,
                -1, -1, -1,
                -1, -1, 1
            ]), gl.STATIC_DRAW);

            let shaderProgramVertexAttributeLocation = gl.getAttribLocation(shaderProgram, "position");

            gl.enableVertexAttribArray(shaderProgramVertexAttributeLocation);

            gl.vertexAttribPointer(
                shaderProgramVertexAttributeLocation,
                3,
                gl.FLOAT,
                false,
                0,
                0);

            gl.uniformMatrix4fv(
                gl.getUniformLocation(shaderProgram, 'model'),
                false,
                this.GenerateModel().ToFloat32Array());

            gl.uniform4fv(
                gl.getUniformLocation(shaderProgram, "color"),
                [1.0, 1.0, 0.0, 1.0]);

            gl.drawArrays(gl.TRIANGLES, 0, 36);
        }
    }
}