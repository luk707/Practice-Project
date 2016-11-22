import {AfterViewInit, Component, ViewChild, ElementRef} from '@angular/core';
import {GameView} from '../../ts/engine/engine'

@Component({
    selector: 'game-view',
    template: `
        <canvas #gameView></canvas>
    `,
})

export class GameViewComponent implements AfterViewInit {

    // Public handle to instance of the game view
    public view: GameView = null;
    private callback: (view: GameView)=>void = null;

    @ViewChild("gameView") canvas: ElementRef; 

    ngAfterViewInit() {
        // Grab the canvas element of the component to initialise the view
        this.view = new GameView(<HTMLCanvasElement>this.canvas.nativeElement);
        if (this.callback != null)
            this.callback(this.view);
    }

    public OnInit(callback: (view: GameView)=>void) {
        if (this.view != null)
            callback(this.view);
        else
            this.callback = callback;
    }
}
