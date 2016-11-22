'use strict';

describe('Home Page', () => {
    beforeEach(() => {
        browser.get('/');
    });

    it('should have a link to the play route', () => {
        let subject = element(by.tagName('a')).isPresent();
        expect(subject).toEqual(true);
    });
});
