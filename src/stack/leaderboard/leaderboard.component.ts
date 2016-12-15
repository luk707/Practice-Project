import {Component} from '@angular/core';

@Component({
    selector: 'leaderboard',
    template: require('./leaderboard.component.html')
})

export class LeaderboardComponent {
    public leaderboard: Score[] = [
            {name: "Bob", score: 17},
            {name: "Bill", score: 12},
            {name: "Ben", score: 8},
            {name: "Bobby", score: 3},
            {name: "Barbara", score: 4}
        ];
}

class Score {
    public name: string;
    public score: number;
}