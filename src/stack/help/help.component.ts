import {Component, ViewChild, AfterViewInit} from '@angular/core';
import {GameViewComponent} from '../game-view/game-view.component';
import * as Engine from "../../ts/engine/engine";
import {BackgroundComponent} from '../background/background.component';

@Component({
    selector: 'help',
    template: require('./help.component.html')
})

export class HelpComponent extends BackgroundComponent implements AfterViewInit {
    ngAfterViewInit(){
        this.gameViewComponent.OnInit((view: Engine.GameView)=>{
            this.view = view;
            this.Start();
            this.Render();
        });
    }
}
