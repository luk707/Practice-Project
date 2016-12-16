import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule, JsonpModule} from '@angular/http';

import {StackComponent} from './stack.component';
import {routing, appRoutingProviders} from './stack.routing';
import {HomeComponent} from './home/home.component';
import {GameViewComponent} from './game-view/game-view.component';
import {GameComponent} from './game/game.component';
import {LeaderboardComponent} from './leaderboard/leaderboard.component';

import {Ng2BootstrapModule} from "ng2-bootstrap";

@NgModule({
    declarations: [
        StackComponent,
        HomeComponent,
        GameComponent,
        GameViewComponent,
        LeaderboardComponent
    ],
    imports: [
        BrowserModule,
        HttpModule,
        JsonpModule,
        routing,
        Ng2BootstrapModule
    ],
    providers: [appRoutingProviders],
    bootstrap: [StackComponent]
})

export class StackModule {
}
