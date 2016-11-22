export class Color {

    constructor(
        public r: number = 1,
        public g: number = 1,
        public b: number = 1,
        public a: number = 1) { }

    ToArray(): Float32Array {
        return new Float32Array([
            this.r,
            this.g,
            this.b,
            this.a
        ]);
    }
}