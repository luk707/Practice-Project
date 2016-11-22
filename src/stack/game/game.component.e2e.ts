'use strict';

describe('Game', () => {
    beforeEach(() => {
        browser.get('/game');
    });

    it('should have a game view', () => {
        let subject = element(by.tagName('game-view')).isPresent();
        expect(subject).toEqual(true);
    });
});
