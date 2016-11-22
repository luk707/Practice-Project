import {Drawable} from "../drawable";
import {Transform} from "../transform";
import {Matrix} from "../matrix";

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