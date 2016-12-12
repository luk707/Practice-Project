import {Component, ViewChild, AfterViewInit, OnDestroy} from '@angular/core';
import {GameViewComponent} from '../game-view/game-view.component';
import * as Engine from "../../ts/engine/engine";

@Component({
    selector: 'game',
    template: require('./game.component.html')
})

export class GameComponent implements AfterViewInit, OnDestroy {
    
    public score: number = 0;

    // Handle to Engine GameView
    private view: Engine.GameView;
    // Shaders
    private basicProgram: WebGLProgram;
    private lightingProgram: WebGLProgram;
    // Camera
    private camera: Engine.Camera;
    // Time variable
    private time: number = 0;
    // Objects
    private background: Engine.Primatives.Background;
    private axes: Engine.Primatives.Axes;
    private grid: Engine.Primatives.Grid;
    private box: Engine.Primatives.Box;
    private monkey: Engine.Model;

    private Start() {
        // Compile programs we need
        this.basicProgram = this.view.CreateBasicProgram();
        this.lightingProgram = this.view.CreateLightingProgram();
        // Initialise objects
        this.camera = new Engine.Camera();
        // Instantiate objects
        this.background = new Engine.Primatives.Background(this.view);
        this.background.color1 = new Engine.Color(0.55, 0.72, 0.66);
        this.background.color2 = new Engine.Color(0.1, 0.55, 0.62);
        this.axes = new Engine.Primatives.Axes();
        this.grid = new Engine.Primatives.Grid(4);
        this.box = new Engine.Primatives.Box(this.view.gl);
        this.monkey = new Engine.Model(require("../../models/monkey"), this.view.gl);
        // Set position and scale of the box
        this.box.transform.position = new Engine.Vector(1, 0, 0);
        this.box.transform.scale = new Engine.Vector(1, 1, 2);
    }

    private Update() {
        // Set the camera position
        this.camera.position = new Engine.Vector(
            Math.sin(this.time / 500) * 5 ,
            0,
            Math.cos(this.time / 500) * 5);
            //noone loves tan feelsbadman ;-;
    }

    private Render() {
        let viewMatrix = this.camera.View();
        let projectionMatrix = this.camera.Projecttion();
        this.view.gl.clear(this.view.gl.COLOR_BUFFER_BIT | this.view.gl.DEPTH_BUFFER_BIT);
        this.view.DrawObject(this.background, this.basicProgram, viewMatrix, projectionMatrix);
        this.view.gl.clear(this.view.gl.DEPTH_BUFFER_BIT);
        this.view.DrawObject(this.monkey, this.lightingProgram, viewMatrix, projectionMatrix);
        //this.view.DrawObject(this.box, this.lightingProgram, viewMatrix, projectionMatrix);
        //this.view.DrawObject(this.grid, this.basicProgram, viewMatrix, projectionMatrix);
        //this.view.gl.clear(this.view.gl.DEPTH_BUFFER_BIT);
        //this.view.DrawObject(this.axes, this.basicProgram, viewMatrix, projectionMatrix);
    }

    // Get GameViewComponent from DOM
    @ViewChild(GameViewComponent) gameViewComponent: GameViewComponent;

    ngAfterViewInit() {
        // Wait for GameViewComponent to initialise
        this.gameViewComponent.OnInit((view: Engine.GameView) => {
            // Store handle to view
            this.view = view;
            // Start the game
            this.Start();
            // Init the view and then run the game
            this.InitView();
            this.Run();
        });
    }

    private running: boolean = false;

    ngOnDestroy() {
        // Prevent next update loop from calling next frame
        this.running = false;
    }

    private InitView() {
        this.view.gl.clear(this.view.gl.COLOR_BUFFER_BIT | this.view.gl.DEPTH_BUFFER_BIT);
    }

    private HandleResize() {
        // Get width and height from the DOM
        let width: number = this.view.canvas.clientWidth * window.devicePixelRatio;
        let height: number = this.view.canvas.clientHeight * window.devicePixelRatio;
        // Set width and height of viewport and elemtn
        this.view.gl.viewport(0, 0, width, height);
        this.view.canvas.width = width;
        this.view.canvas.height = height;
        // Set the camera aspect ratio
        this.camera.aspect = width / height;
    }

    private fps: number = 60;
    get FPS(): number {
        return 1000 / this.fps;
    }

    private Run() {
        this.running = true;
        let refreshIntervalId = setInterval(() => {
            this.time += this.FPS;
            this.HandleResize();
            this.Update();
            this.Render();
            if (!this.running) {
                clearInterval(refreshIntervalId);
            }
        }, this.FPS);
    }
}
