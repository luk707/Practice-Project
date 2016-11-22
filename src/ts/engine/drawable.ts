export interface Drawable {
    
    Draw(gl: WebGLRenderingContext, shaderProgram: WebGLProgram): void;
}