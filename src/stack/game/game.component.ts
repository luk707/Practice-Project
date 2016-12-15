import {Component, ViewChild, AfterViewInit, OnDestroy} from '@angular/core';
import {GameViewComponent} from '../game-view/game-view.component';
import * as Engine from "../../ts/engine/engine";

@Component({
    selector: 'game',
    template: require('./game.component.html'),
    host: { '(window:keydown)': 'onKeyPress($event)' }
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
    private boxes: Array<Engine.Primatives.Box>;
    private colorFreq: number = 1;
    private travelX: boolean = false;
    private offset: number = 0.02;

    private Start() {
        // Compile programs we need
        this.basicProgram = this.view.CreateBasicProgram();
        this.lightingProgram = this.view.CreateLightingProgram();
        // Initialise objects
        this.camera = new Engine.Camera();
        this.camera.position = new Engine.Vector(3.5, 2.5, 3.5);
        this.camera.target = new Engine.Vector(0, 1.5, 0);
        // Instantiate objects
        this.background = new Engine.Primatives.Background(this.view);
        this.background.color1 = new Engine.Color(0.55, 0.72, 0.66);
        this.background.color2 = new Engine.Color(0.1, 0.55, 0.62);
        this.boxes = new Array<Engine.Primatives.Box>();

        this.boxes[0] = this.CreateBoxInstance(new Engine.Vector(0,-.5,0), new Engine.Vector(1,1.5,1));
        this.boxes[1] = this.CreateBoxInstance(new Engine.Vector(0,1.1,0), new Engine.Vector(1,0.1,1));
    }

    
    private Update() {
        let tempBox = this.boxes[this.boxes.length - 1];
        if(this.travelX)
        {
            if(tempBox.transform.position.x < -2 || tempBox.transform.position.x > 2) this.offset = -this.offset;
            tempBox.transform.position.x += this.offset;
        } 
        else
        {
            if(tempBox.transform.position.z < -2 || tempBox.transform.position.z > 2) this.offset = -this.offset;
            tempBox.transform.position.z += this.offset;
        }
    }

    private Render() {
        let viewMatrix = this.camera.View();
        let projectionMatrix = this.camera.Projecttion();
        this.view.gl.clear(this.view.gl.COLOR_BUFFER_BIT | this.view.gl.DEPTH_BUFFER_BIT);
        this.view.DrawObject(this.background, this.basicProgram, viewMatrix, projectionMatrix);
        this.view.gl.clear(this.view.gl.DEPTH_BUFFER_BIT);
        this.boxes.forEach(box => {
            this.view.DrawObject(box, this.lightingProgram, viewMatrix, projectionMatrix);
        });
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

    private onKeyPress(event: any) {
        if(event.keyCode == 32)
        {
            let previousBox: Engine.Primatives.Box = this.boxes[this.boxes.length - 2];
            let currentBox: Engine.Primatives.Box = this.boxes[this.boxes.length - 1];
            let xOffset = currentBox.transform.position.x - previousBox.transform.position.x;
            let zOffset = currentBox.transform.position.z - previousBox.transform.position.z;

            let newScale = this.travelX ? currentBox.transform.scale.x - (Math.abs(xOffset) / 2) : currentBox.transform.scale.z - (Math.abs(zOffset) / 2);

            if(newScale > 0)
            {
                currentBox.transform.scale = this.travelX ? new Engine.Vector(newScale,0.1,currentBox.transform.scale.z) : new Engine.Vector(currentBox.transform.scale.x, 0.1, newScale);

                if(this.travelX)
                    currentBox.transform.position = new Engine.Vector(currentBox.transform.position.x + (-xOffset / 2), currentBox.transform.position.y ,currentBox.transform.position.z);
                else
                    currentBox.transform.position = new Engine.Vector(currentBox.transform.position.x, currentBox.transform.position.y, currentBox.transform.position.z + (-zOffset / 2));

                this.boxes[this.boxes.length] = this.CreateBoxInstance(
                    new Engine.Vector(currentBox.transform.position.x,currentBox.transform.position.y + 0.2, currentBox.transform.position.z), currentBox.transform.scale);
                this.camera.position.y += 0.2;
                this.camera.target.y += 0.2;
            }
            else
            {
                //lose condition
            }
        }
    }

    private CreateBoxInstance(pos: Engine.Vector, scale: Engine.Vector): Engine.Primatives.Box
    {
        let tempBox : Engine.Primatives.Box = new Engine.Primatives.Box(this.view.gl);

        tempBox.transform.position = pos;
        tempBox.transform.scale = scale;

        let red = (Math.sin(.1 * this.colorFreq + 0) * 230 + 55) / 255;
        let green = (Math.sin(.2 * this.colorFreq + 2) * 230 + 55) / 255;
        let blue = (Math.sin(.3 * this.colorFreq + 4) * 230 + 55) / 255;

        tempBox.color = new Engine.Color(red, green, blue);
        this.colorFreq+=0.25;
        this.travelX = !this.travelX;
        return tempBox;
    }
}
