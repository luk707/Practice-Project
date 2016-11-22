import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';

import {StackComponent} from './stack.component';

describe('StackComponent', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [StackComponent]
    }));

    it('should instantiate the StackComponent', () => {
        let fixture = TestBed.createComponent(StackComponent);
        expect(fixture.componentInstance instanceof StackComponent).toBe(true, 'should create StackComponent');
    });
});
