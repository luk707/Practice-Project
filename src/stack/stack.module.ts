import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule, JsonpModule} from '@angular/http';

import {StackComponent} from './stack.component';
import {routing, appRoutingProviders} from './stack.routing';
import {HomeComponent} from './home/home.component';
import {GameViewComponent} from './game-view/game-view.component';
import {GameComponent} from './game/game.component';

@NgModule({
    declarations: [
        StackComponent,
        HomeComponent,
        GameComponent,
        GameViewComponent
    ],
    imports: [
        BrowserModule,
        HttpModule,
        JsonpModule,
        routing
    ],
    providers: [appRoutingProviders],
    bootstrap: [StackComponent]
})

export class StackModule {
}
