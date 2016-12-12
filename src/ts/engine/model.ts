import {Drawable} from "./drawable";
import {Transform} from "./transform";
import {Color} from "./color";
import {Vector} from "./vector";
import {ModelData, ModelMetaData} from "./modelData";

export class Model implements Drawable {
    public transform: Transform;
    public color: Color;

    private vertexData: number[];
    private normalData: number[];

    private vertexBuffer: WebGLBuffer;
    private normalBuffer: WebGLBuffer;

    private triangleCount: number;
    
    constructor(model: any, gl: WebGLRenderingContext) {
        model = <ModelData>model;
        
        this.transform = new Transform();
        this.color = new Color();

        this.vertexData = [];
        this.normalData = [];

        this.triangleCount = 0;

        let index: number = 0;

        while (index < model.faces.length) {
            switch (model.faces[index]) {
                case 33:
                    this.vertexData.push(
                        model.vertices[(model.faces[index + 1] * 3) + 0],
                        model.vertices[(model.faces[index + 1] * 3) + 1],
                        model.vertices[(model.faces[index + 1] * 3) + 2],
                        model.vertices[(model.faces[index + 3] * 3) + 0],
                        model.vertices[(model.faces[index + 3] * 3) + 1],
                        model.vertices[(model.faces[index + 3] * 3) + 2],
                        model.vertices[(model.faces[index + 2] * 3) + 0],
                        model.vertices[(model.faces[index + 2] * 3) + 1],
                        model.vertices[(model.faces[index + 2] * 3) + 2],
                        model.vertices[(model.faces[index + 3] * 3) + 0],
                        model.vertices[(model.faces[index + 3] * 3) + 1],
                        model.vertices[(model.faces[index + 3] * 3) + 2],
                        model.vertices[(model.faces[index + 1] * 3) + 0],
                        model.vertices[(model.faces[index + 1] * 3) + 1],
                        model.vertices[(model.faces[index + 1] * 3) + 2],
                        model.vertices[(model.faces[index + 4] * 3) + 0],
                        model.vertices[(model.faces[index + 4] * 3) + 1],
                        model.vertices[(model.faces[index + 4] * 3) + 2]
                        );
                    this.normalData.push(
                        model.normals[(model.faces[index + 5] * 3) + 0],
                        model.normals[(model.faces[index + 5] * 3) + 1],
                        model.normals[(model.faces[index + 5] * 3) + 2],
                        model.normals[(model.faces[index + 7] * 3) + 0],
                        model.normals[(model.faces[index + 7] * 3) + 1],
                        model.normals[(model.faces[index + 7] * 3) + 2],
                        model.normals[(model.faces[index + 6] * 3) + 0],
                        model.normals[(model.faces[index + 6] * 3) + 1],
                        model.normals[(model.faces[index + 6] * 3) + 2],
                        model.normals[(model.faces[index + 7] * 3) + 0],
                        model.normals[(model.faces[index + 7] * 3) + 1],
                        model.normals[(model.faces[index + 7] * 3) + 2],
                        model.normals[(model.faces[index + 5] * 3) + 0],
                        model.normals[(model.faces[index + 5] * 3) + 1],
                        model.normals[(model.faces[index + 5] * 3) + 2],
                        model.normals[(model.faces[index + 8] * 3) + 0],
                        model.normals[(model.faces[index + 8] * 3) + 1],
                        model.normals[(model.faces[index + 8] * 3) + 2]
                        );
                    index += 9;
                    this.triangleCount += 2;
                    break;
                case 32:
                    this.vertexData.push(
                        model.vertices[(model.faces[index + 1] * 3) + 0],
                        model.vertices[(model.faces[index + 1] * 3) + 1],
                        model.vertices[(model.faces[index + 1] * 3) + 2],
                        model.vertices[(model.faces[index + 3] * 3) + 0],
                        model.vertices[(model.faces[index + 3] * 3) + 1],
                        model.vertices[(model.faces[index + 3] * 3) + 2],
                        model.vertices[(model.faces[index + 2] * 3) + 0],
                        model.vertices[(model.faces[index + 2] * 3) + 1],
                        model.vertices[(model.faces[index + 2] * 3) + 2]
                        );
                    this.normalData.push(
                        model.normals[(model.faces[index + 4] * 3) + 0],
                        model.normals[(model.faces[index + 4] * 3) + 1],
                        model.normals[(model.faces[index + 4] * 3) + 2],
                        model.normals[(model.faces[index + 6] * 3) + 0],
                        model.normals[(model.faces[index + 6] * 3) + 1],
                        model.normals[(model.faces[index + 6] * 3) + 2],
                        model.normals[(model.faces[index + 5] * 3) + 0],
                        model.normals[(model.faces[index + 5] * 3) + 1],
                        model.normals[(model.faces[index + 5] * 3) + 2]
                        );
                    index += 7;
                    this.triangleCount += 1;
                    break;
                default:
                    index++;
                    break;
            }
        }

        this.vertexBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(this.vertexData),
            gl.STATIC_DRAW);

        this.normalBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);

        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(this.normalData),
            gl.STATIC_DRAW);
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

        gl.drawArrays(gl.TRIANGLES, 0, this.triangleCount * 3);
    }
}