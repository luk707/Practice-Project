import * as Engine from "./engine";

export class Camera {
    constructor(
        public position: Engine.Vector = Engine.Vector.Backward,
        public target: Engine.Vector = Engine.Vector.Zero,
        public up: Engine.Vector = Engine.Vector.Up,
        public fov: number = 60,
        public aspect: number = 1,
        public size: number = 3,
        public orphographic: boolean = false,
        public near: number = 0.1,
        public far: number = 1000) { }
    
    View(): Engine.Matrix {
        return Engine.Matrix.MakeLookAt(
            this.position,
            this.target,
            Engine.Vector.Up
        ).Inverse();
    }

    Projecttion(): Engine.Matrix {
        return (this.orphographic ? new Engine.Matrix([
            1 / (this.aspect * this.size), 0, 0, 0,
            0, 1 / this.size, 0, 0,
            0, 0, -0.1, 0,
            0, 0, 0, 1
        ]) : Engine.Matrix.MakePerspective(
            (this.fov / 180) * Math.PI,
            this.aspect,
            this.near,
            this.far
        ));
    }
}