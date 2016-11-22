import {TestBed} from '@angular/core/testing';

import {GameComponent} from './game.component';

describe('GameComponent', () => {
    beforeEach(() => TestBed.configureTestingModule({ declarations: [GameComponent] }));

    it('should instantiate the GameComponent', () => {
        let fixture = TestBed.createComponent(GameComponent);
        expect(fixture.componentInstance instanceof GameComponent).toBe(true, 'should create GameComponent');
    });
});
