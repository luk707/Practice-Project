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
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        } else {
            alert("Unable to initialise WebGL Context");
        }
    }
}