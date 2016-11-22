import {Vector} from "./vector";

export class Matrix {

    constructor(public data: Array<number>) { }

    static Identity: Matrix = new Matrix([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);

    static MakePerspective(fov: number, aspect: number, near: number, far: number) {
        let f: number = Math.tan(Math.PI * 0.5 - 0.5 * fov);
        let range: number = 1.0 / (near - far);
        return new Matrix([
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (near + far) * range, -1,
            0, 0, near * far * range * 2, 0
        ]);
    }

    static MakeTranslation(delta: Vector): Matrix {
        return new Matrix([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            delta.x, delta.y, delta.z, 1
        ]);
    }

    static MakeScale(scale: Vector): Matrix {
        return new Matrix([
            scale.x, 0, 0, 0,
            0, scale.y, 0, 0,
            0, 0, scale.z, 0,
            0, 0, 0, 1
        ]);
    }

    static MakeLookAt(position: Vector, target: Vector, up: Vector) {
        let zBasis: Vector = Vector.Subtract(position, target).Normalised();
        let xBasis: Vector = Vector.Cross(up, zBasis);
        let yBasis: Vector = Vector.Cross(zBasis, xBasis);

        return new Matrix([
            xBasis.x, xBasis.y, xBasis.z, 0,
            yBasis.x, yBasis.y, yBasis.z, 0,
            zBasis.x, zBasis.y, zBasis.z, 0,
            position.x, position.y, position.z, 1
        ]);
    }

    Inverse(): Matrix {
        let m11 = this.data[0];
        let m12 = this.data[1];
        let m13 = this.data[2];
        let m14 = this.data[3];
        let m21 = this.data[4];
        let m22 = this.data[5];
        let m23 = this.data[6];
        let m24 = this.data[7];
        let m31 = this.data[8];
        let m32 = this.data[9];
        let m33 = this.data[10];
        let m34 = this.data[11];
        let m41 = this.data[12];
        let m42 = this.data[13];
        let m43 = this.data[14];
        let m44 = this.data[15];

        let det = 1.0 / (
            m11 * m22 * m33 * m44 +
            m11 * m23 * m34 * m42 +
            m11 * m24 * m32 * m43 +
            m12 * m21 * m34 * m43 +
            m12 * m23 * m31 * m34 +
            m12 * m24 * m33 * m41 +
            m13 * m21 * m32 * m44 +
            m13 * m22 * m34 * m12 +
            m13 * m24 * m31 * m42 +
            m14 * m21 * m33 * m42 +
            m14 * m22 * m31 * m43 +
            m14 * m23 * m32 * m41 -
            m11 * m22 * m34 * m43 -
            m11 * m23 * m32 * m44 -
            m11 * m24 * m33 * m42 -
            m12 * m21 * m33 * m44 -
            m12 * m23 * m34 * m41 -
            m12 * m24 * m31 * m43 -
            m13 * m21 * m34 * m42 -
            m13 * m22 * m31 * m44 -
            m13 * m24 * m32 * m41 -
            m14 * m21 * m32 * m43 -
            m14 * m22 * m33 * m41 -
            m14 * m23 * m31 * m42);

        return new Matrix([
            det * (m22 * m33 * m44 + m23 * m34 * m42 + m24 * m32 * m43 - m22 * m34 * m43 - m23 * m32 * m44 - m24 * m33 * m42),
            det * (m12 * m34 * m43 + m13 * m32 * m44 + m14 * m33 * m42 - m12 * m33 * m44 - m13 * m34 * m42 - m14 * m32 * m43),
            det * (m21 * m23 * m44 + m13 * m24 * m42 + m14 * m22 * m43 - m12 * m24 * m43 - m13 * m22 * m44 - m14 * m23 * m42),
            det * (m12 * m24 * m33 + m13 * m22 * m34 + m14 * m23 * m32 - m12 * m23 * m34 - m13 * m24 * m32 - m14 * m22 * m33),
            det * (m21 * m34 * m43 + m23 * m31 * m44 + m24 * m33 * m41 - m21 * m33 * m44 - m23 * m34 * m41 - m24 * m31 * m43),
            det * (m11 * m33 * m44 + m13 * m34 * m41 + m14 * m31 * m43 - m11 * m34 * m43 - m13 * m31 * m44 - m14 * m33 * m41),
            det * (m11 * m24 * m43 + m13 * m21 * m44 + m14 * m23 * m41 - m11 * m23 * m44 - m13 * m24 * m41 - m14 * m21 * m43),
            det * (m11 * m23 * m34 + m13 * m24 * m31 + m14 * m21 * m33 - m11 * m24 * m33 - m13 * m21 * m34 - m14 * m23 * m31),
            det * (m21 * m32 * m44 + m22 * m34 * m41 + m24 * m31 * m42 - m21 * m34 * m42 - m22 * m31 * m44 - m24 * m32 * m41),
            det * (m11 * m34 * m42 + m12 * m31 * m44 + m14 * m32 * m41 - m11 * m32 * m44 - m12 * m34 * m41 - m14 * m31 * m42),
            det * (m11 * m22 * m44 + m12 * m24 * m41 + m14 * m21 * m42 - m11 * m24 * m42 - m12 * m21 * m44 - m14 * m22 * m41),
            det * (m11 * m24 * m32 + m12 * m21 * m34 + m14 * m22 * m31 - m11 * m22 * m34 - m12 * m24 * m31 - m14 * m21 * m32),
            det * (m21 * m33 * m42 + m22 * m31 * m43 + m23 * m32 * m41 - m21 * m32 * m43 - m22 * m33 * m41 - m23 * m31 * m42),
            det * (m11 * m32 * m43 + m12 * m33 * m41 + m13 * m31 * m42 - m11 * m33 * m42 - m12 * m31 * m43 - m13 * m32 * m41),
            det * (m11 * m23 * m42 + m12 * m21 * m43 + m13 * m22 * m41 - m11 * m22 * m43 - m12 * m23 * m41 - m13 * m21 * m42),
            det * (m11 * m22 * m33 + m12 * m23 * m31 + m13 * m21 * m32 - m11 * m23 * m32 - m12 * m21 * m33 - m13 * m22 * m31)
        ]);
    }

    ToFloat32Array(): Float32Array {
        return new Float32Array(this.data);
    }

    static Multiply(a: Matrix, b: Matrix): Matrix {
        return new Matrix([
            a.data[0] * b.data[0] + a.data[1] * b.data[4] + a.data[2] * b.data[8] + a.data[3] * b.data[12],
            a.data[0] * b.data[1] + a.data[1] * b.data[5] + a.data[2] * b.data[9] + a.data[3] * b.data[13],
            a.data[0] * b.data[2] + a.data[1] * b.data[6] + a.data[2] * b.data[10] + a.data[3] * b.data[14],
            a.data[0] * b.data[3] + a.data[1] * b.data[7] + a.data[2] * b.data[11] + a.data[3] * b.data[15],

            a.data[4] * b.data[0] + a.data[5] * b.data[4] + a.data[6] * b.data[8] + a.data[7] * b.data[12],
            a.data[4] * b.data[1] + a.data[5] * b.data[5] + a.data[6] * b.data[9] + a.data[7] * b.data[13],
            a.data[4] * b.data[2] + a.data[5] * b.data[6] + a.data[6] * b.data[10] + a.data[7] * b.data[14],
            a.data[4] * b.data[3] + a.data[5] * b.data[7] + a.data[6] * b.data[11] + a.data[7] * b.data[15],

            a.data[8] * b.data[0] + a.data[9] * b.data[4] + a.data[10] * b.data[8] + a.data[11] * b.data[12],
            a.data[8] * b.data[1] + a.data[9] * b.data[5] + a.data[10] * b.data[9] + a.data[11] * b.data[13],
            a.data[8] * b.data[2] + a.data[9] * b.data[6] + a.data[10] * b.data[10] + a.data[11] * b.data[14],
            a.data[8] * b.data[3] + a.data[9] * b.data[7] + a.data[10] * b.data[11] + a.data[11] * b.data[15],

            a.data[12] * b.data[0] + a.data[13] * b.data[4] + a.data[14] * b.data[8] + a.data[15] * b.data[12],
            a.data[12] * b.data[1] + a.data[13] * b.data[5] + a.data[14] * b.data[9] + a.data[15] * b.data[13],
            a.data[12] * b.data[2] + a.data[13] * b.data[6] + a.data[14] * b.data[10] + a.data[15] * b.data[14],
            a.data[12] * b.data[3] + a.data[13] * b.data[7] + a.data[14] * b.data[11] + a.data[15] * b.data[15]
        ]);
    }
}