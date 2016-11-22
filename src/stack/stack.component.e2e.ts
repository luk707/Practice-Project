'use strict';

describe('Stack', () => {
    beforeEach(() => {
        browser.get('/');
    });

    it('should have a router outlet', () => {
        let subject = element(by.tagName("router-outlet")).isPresent();
        expect(subject).toEqual(true);
    });
});
