import {ModuleWithProviders}  from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {HomeComponent} from './home/home.component';
import {GameComponent} from './game/game.component';
import {LeaderboardComponent} from './leaderboard/leaderboard.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'play', component: GameComponent },
    { path: 'leaderboard', component: LeaderboardComponent }
];

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
