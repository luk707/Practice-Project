import {TestBed} from '@angular/core/testing';

import {GameViewComponent} from './game-view.component';

describe('GameViewComponent', () => {
    beforeEach(() => TestBed.configureTestingModule({ declarations: [GameViewComponent] }));

    it('should instantiate the GameViewComponent', () => {
        let fixture = TestBed.createComponent(GameViewComponent);
        expect(fixture.componentInstance instanceof GameViewComponent).toBe(true, 'should create GameViewComponent');
    });
});
