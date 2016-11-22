import {Drawable} from "../drawable";
import {Transform} from "../transform";
import {Color} from "../color";

export class Box implements Drawable {

    public transform: Transform;
    public color: Color;

    private vertexBuffer: WebGLBuffer;
    private normalBuffer: WebGLBuffer;

    constructor(gl: WebGLRenderingContext) {
        this.transform = new Transform();
        this.color = new Color();

        this.vertexBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

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

        this.normalBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);   

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0
        ]), gl.STATIC_DRAW);  
    }

    Draw(gl: WebGLRenderingContext, shader: WebGLProgram) {

        let shaderProgramNormalAttributeLocation = gl.getAttribLocation(shader, "normal");

        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);

        gl.enableVertexAttribArray(shaderProgramNormalAttributeLocation);

        gl.vertexAttribPointer(
            shaderProgramNormalAttributeLocation,
            3,
            gl.FLOAT,
            true,
            0,
            0);

        let shaderProgramVertexAttributeLocation = gl.getAttribLocation(shader, "position");

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
            gl.getUniformLocation(shader, 'model'),
            false,
            this.transform.ToMatrix().ToFloat32Array());

        gl.uniform4fv(
            gl.getUniformLocation(shader, "color"),
            this.color.ToArray());

        gl.drawArrays(gl.TRIANGLES, 0, 36);
    }
}