export class GameView {
    
    gl: WebGLRenderingContext = null;
    
    constructor(public canvas: HTMLCanvasElement) {

        this.gl =
            canvas.getContext("webgl") ||
            canvas.getContext("experimental-webgl");

        if (this.gl) {
            this.gl.clearColor(1.0, 0.0, 1.0, 1.0);
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
        let m00 = this.data[0 * 4 + 0];
        let m01 = this.data[0 * 4 + 1];
        let m02 = this.data[0 * 4 + 2];
        let m03 = this.data[0 * 4 + 3];
        let m10 = this.data[1 * 4 + 0];
        let m11 = this.data[1 * 4 + 1];
        let m12 = this.data[1 * 4 + 2];
        let m13 = this.data[1 * 4 + 3];
        let m20 = this.data[2 * 4 + 0];
        let m21 = this.data[2 * 4 + 1];
        let m22 = this.data[2 * 4 + 2];
        let m23 = this.data[2 * 4 + 3];
        let m30 = this.data[3 * 4 + 0];
        let m31 = this.data[3 * 4 + 1];
        let m32 = this.data[3 * 4 + 2];
        let m33 = this.data[3 * 4 + 3];

        let tmp_0 = m22 * m33;
		let tmp_1 = m32 * m23;
		let tmp_2 = m12 * m33;
		let tmp_3 = m32 * m13;
		let tmp_4 = m12 * m23;
		let tmp_5 = m22 * m13;
		let tmp_6 = m02 * m33;
		let tmp_7 = m32 * m03;
		let tmp_8 = m02 * m23;
		let tmp_9 = m22 * m03;
		let tmp_10 = m02 * m13;
		let tmp_11 = m12 * m03;
		let tmp_12 = m20 * m31;
		let tmp_13 = m30 * m21;
		let tmp_14 = m10 * m31;
		let tmp_15 = m30 * m11;
		let tmp_16 = m10 * m21;
		let tmp_17 = m20 * m11;
		let tmp_18 = m00 * m31;
		let tmp_19 = m30 * m01;
		let tmp_20 = m00 * m21;
		let tmp_21 = m20 * m01;
		let tmp_22 = m00 * m11;
		let tmp_23 = m10 * m01;

        let t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) - (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
		let t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) - (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
		let t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) - (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
		let t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) - (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);
		let d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

        return new Matrix([
            d * t0,
			d * t1,
			d * t2,
			d * t3,
			d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) - (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
			d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) - (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
			d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) - (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
			d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) - (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
			d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) - (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
			d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) - (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
			d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) - (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
			d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) - (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
			d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) - (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
			d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) - (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
			d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) - (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
			d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) - (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
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

            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([ 0, 0, 0, 1, 0, 0 ]), gl.STATIC_DRAW);
            gl.uniform4fv(
                gl.getUniformLocation(shaderProgram, "color"),
                [1.0, 0.0, 0.0, 1.0]);
            gl.drawArrays(gl.LINES, 0, 2);

            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([ 0, 0, 0, 0, 1, 0 ]), gl.STATIC_DRAW);
            gl.uniform4fv(
                gl.getUniformLocation(shaderProgram, "color"),
                [0.0, 1.0, 0.0, 1.0]);
            gl.drawArrays(gl.LINES, 0, 2);

            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([ 0, 0, 0, 0, 0, 1 ]), gl.STATIC_DRAW);
            gl.uniform4fv(
                gl.getUniformLocation(shaderProgram, "color"),
                [0.0, 0.0, 1.0, 1.0]);
            gl.drawArrays(gl.LINES, 0, 2);
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

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
    }
}