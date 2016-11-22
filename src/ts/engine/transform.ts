import {Vector} from "./vector";
import {Matrix} from "./matrix";

export class Transform {
    constructor(public position: Vector = Vector.Zero, public scale: Vector = Vector.Unit) { }

    ToMatrix(): Matrix {
        return new Matrix([
            this.scale.x, 0, 0, 0,
            0, this.scale.y, 0, 0,
            0, 0, this.scale.z, 0,
            this.position.x,
            this.position.y,
            this.position.z,
            1
        ]);
    }
}