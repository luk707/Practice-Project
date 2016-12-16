import {ViewChild} from '@angular/core';
import {GameViewComponent} from '../game-view/game-view.component';
import * as Engine from "../../ts/engine/engine";

export class BackgroundComponent {
    protected view: Engine.GameView;
    private basicProgram: WebGLProgram;
    private camera: Engine.Camera;
    private background: Engine.Primatives.Background;
    protected Start(){
        this.basicProgram = this.view.CreateBasicProgram();
        this.camera = new Engine.Camera();
        this.background = new Engine.Primatives.Background(this.view);
        this.background.color1 = new Engine.Color(0.55, 0.72, 0.66);
        this.background.color2 = new Engine.Color(0.1, 0.55, 0.62);
    }
    protected Render() {
        let viewMatrix = this.camera.View();
        let projectionMatrix = this.camera.Projecttion();
        this.view.gl.clear(this.view.gl.COLOR_BUFFER_BIT | this.view.gl.DEPTH_BUFFER_BIT);
        this.view.DrawObject(this.background, this.basicProgram, viewMatrix, projectionMatrix);
    }
    @ViewChild(GameViewComponent) gameViewComponent: GameViewComponent;
}