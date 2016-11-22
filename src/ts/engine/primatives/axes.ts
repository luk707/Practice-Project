import {Drawable} from "../drawable";
import {Transform} from "../transform";

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