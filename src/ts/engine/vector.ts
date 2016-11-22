export class Vector {

    constructor(public x: number = 0, public y: number = 0, public z: number = 0) { }

    static Zero: Vector = new Vector();

    static Unit: Vector = new Vector(1, 1, 1);

    static Right: Vector = new Vector(1, 0, 0);
    static Up: Vector = new Vector(0, 1, 0);
    static Forward: Vector = new Vector(0, 0, 1);
    static Left: Vector = new Vector(-1, 0, 0);
    static Down: Vector = new Vector(0, -1, 0);
    static Backward: Vector = new Vector(0, 0, -1);

    static Dot(a: Vector, b: Vector): number {
        return (a.x * b.x) + (a.y * b.y) + (a.z * b.z);
    }

    static Cross(a: Vector, b: Vector): Vector {
        return new Vector(
            a.y * b.z - a.z * b.y,
            a.z * b.x - a.x * b.z,
            a.x * b.y - a.y * b.x);
    }

    Normalised(): Vector {
        let length: number = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2))
        if (length > 0.0001) {
            return new Vector(this.x / length, this.y / length, this.z / length);
        } else {
            return Vector.Zero;
        }
    }

    ToArray(): Float32Array {
        return new Float32Array([
            this.x,
            this.y,
            this.z
        ]);
    }

    static Subtract(a: Vector, b: Vector): Vector {
        return new Vector(a.x - b.x, a.y - b.y, a.z - b.z);
    }
}