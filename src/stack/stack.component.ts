import {Component, ViewContainerRef} from '@angular/core';

import 'bootstrap/dist/css/bootstrap.css';
import '../css/main.css';

@Component({
    selector: 'stack',
    template: require('./stack.component.html')
})

export class StackComponent {
    private viewContainerRef: ViewContainerRef;

    public constructor(viewContainerRef:ViewContainerRef) {
        // You need this small hack in order to catch application root view container ref
        this.viewContainerRef = viewContainerRef;
    }
}
