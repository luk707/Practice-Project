(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GameView = (function () {
    function GameView(canvas) {
        this.canvas = canvas;
        this.gl = null;
        this.gl =
            canvas.getContext("webgl") ||
                canvas.getContext("experimental-webgl");
        if (this.gl) {
            this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.depthFunc(this.gl.LEQUAL);
            this.gl.enable(this.gl.CULL_FACE);
            this.gl.cullFace(this.gl.FRONT);
        }
        else {
            alert("Unable to initialise WebGL Context");
        }
    }
    GameView.prototype.CreateProgram = function (vertexShader, fragmentShader) {
        var program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);
        if (this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            return program;
        }
        return null;
    };
    GameView.prototype.CreateShader = function (source, type) {
        var shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        if (this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            return shader;
        }
        this.gl.deleteShader(shader);
        return null;
    };
    GameView.prototype.DrawObject = function (object, shaderProgram) {
        object.Draw(this.gl, shaderProgram);
    };
    return GameView;
}());
exports.GameView = GameView;
var Screen = (function () {
    function Screen() {
    }
    return Screen;
}());
exports.Screen = Screen;
var ScreenManager = (function (_super) {
    __extends(ScreenManager, _super);
    function ScreenManager(screen) {
        _super.call(this);
        this.activeScreen = null;
        this.nextScreen = null;
        this.activeScreen = screen;
    }
    ScreenManager.prototype.Draw = function (gl, shaderProgram) {
    };
    return ScreenManager;
}(Screen));
exports.ScreenManager = ScreenManager;
var Vector = (function () {
    function Vector(x, y, z) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (z === void 0) { z = 0; }
        this.x = x;
        this.y = y;
        this.z = z;
    }
    Vector.Dot = function (a, b) {
        return (a.x * b.x) + (a.y * b.y) + (a.z * b.z);
    };
    Vector.Cross = function (a, b) {
        return new Vector(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
    };
    Vector.prototype.Normalised = function () {
        var length = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
        if (length > 0.0001) {
            return new Vector(this.x / length, this.y / length, this.z / length);
        }
        else {
            return Vector.Zero;
        }
    };
    Vector.Subtract = function (a, b) {
        return new Vector(a.x - b.x, a.y - b.y, a.z - b.z);
    };
    Vector.Zero = new Vector();
    Vector.Unit = new Vector(1, 1, 1);
    Vector.Right = new Vector(1, 0, 0);
    Vector.Up = new Vector(0, 1, 0);
    Vector.forward = new Vector(0, 0, 1);
    return Vector;
}());
exports.Vector = Vector;
var Transform = (function () {
    function Transform(position, scale) {
        if (position === void 0) { position = Vector.Zero; }
        if (scale === void 0) { scale = Vector.Unit; }
        this.position = position;
        this.scale = scale;
    }
    Transform.prototype.ToMatrix = function () {
        return new Matrix([
            this.scale.x, 0, 0, 0,
            0, this.scale.y, 0, 0,
            0, 0, this.scale.z, 0,
            this.position.x,
            this.position.y,
            this.position.z,
            1
        ]);
    };
    return Transform;
}());
exports.Transform = Transform;
var Matrix = (function () {
    function Matrix(data) {
        this.data = data;
    }
    Matrix.MakePerspective = function (fov, aspect, near, far) {
        var f = Math.tan(Math.PI * 0.5 - 0.5 * fov);
        var range = 1.0 / (near - far);
        return new Matrix([
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (near + far) * range, -1,
            0, 0, near * far * range * 2, 0
        ]);
    };
    Matrix.MakeTranslation = function (delta) {
        return new Matrix([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            delta.x, delta.y, delta.z, 1
        ]);
    };
    Matrix.MakeScale = function (scale) {
        return new Matrix([
            scale.x, 0, 0, 0,
            0, scale.y, 0, 0,
            0, 0, scale.z, 0,
            0, 0, 0, 1
        ]);
    };
    Matrix.MakeLookAt = function (position, target, up) {
        var zBasis = Vector.Subtract(position, target).Normalised();
        var xBasis = Vector.Cross(up, zBasis);
        var yBasis = Vector.Cross(zBasis, xBasis);
        return new Matrix([
            xBasis.x, xBasis.y, xBasis.z, 0,
            yBasis.x, yBasis.y, yBasis.z, 0,
            zBasis.x, zBasis.y, zBasis.z, 0,
            position.x, position.y, position.z, 1
        ]);
    };
    Matrix.prototype.Inverse = function () {
        var m00 = this.data[0 * 4 + 0];
        var m01 = this.data[0 * 4 + 1];
        var m02 = this.data[0 * 4 + 2];
        var m03 = this.data[0 * 4 + 3];
        var m10 = this.data[1 * 4 + 0];
        var m11 = this.data[1 * 4 + 1];
        var m12 = this.data[1 * 4 + 2];
        var m13 = this.data[1 * 4 + 3];
        var m20 = this.data[2 * 4 + 0];
        var m21 = this.data[2 * 4 + 1];
        var m22 = this.data[2 * 4 + 2];
        var m23 = this.data[2 * 4 + 3];
        var m30 = this.data[3 * 4 + 0];
        var m31 = this.data[3 * 4 + 1];
        var m32 = this.data[3 * 4 + 2];
        var m33 = this.data[3 * 4 + 3];
        var tmp_0 = m22 * m33;
        var tmp_1 = m32 * m23;
        var tmp_2 = m12 * m33;
        var tmp_3 = m32 * m13;
        var tmp_4 = m12 * m23;
        var tmp_5 = m22 * m13;
        var tmp_6 = m02 * m33;
        var tmp_7 = m32 * m03;
        var tmp_8 = m02 * m23;
        var tmp_9 = m22 * m03;
        var tmp_10 = m02 * m13;
        var tmp_11 = m12 * m03;
        var tmp_12 = m20 * m31;
        var tmp_13 = m30 * m21;
        var tmp_14 = m10 * m31;
        var tmp_15 = m30 * m11;
        var tmp_16 = m10 * m21;
        var tmp_17 = m20 * m11;
        var tmp_18 = m00 * m31;
        var tmp_19 = m30 * m01;
        var tmp_20 = m00 * m21;
        var tmp_21 = m20 * m01;
        var tmp_22 = m00 * m11;
        var tmp_23 = m10 * m01;
        var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) - (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
        var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) - (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
        var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) - (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
        var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) - (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);
        var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);
        return new Matrix([
            d * t0,
            d * t1,
            d * t2,
            d * t3,
            d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) - (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
            d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) - (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
            d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) - (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
            d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) - (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
            d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) - (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
            d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) - (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
            d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) - (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
            d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) - (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
            d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) - (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
            d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) - (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
            d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) - (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
            d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) - (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
        ]);
    };
    Matrix.prototype.ToFloat32Array = function () {
        return new Float32Array(this.data);
    };
    Matrix.Multiply = function (a, b) {
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
    };
    Matrix.Identity = new Matrix([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);
    return Matrix;
}());
exports.Matrix = Matrix;
var Primatives;
(function (Primatives) {
    var Axes = (function () {
        function Axes() {
            this.transform = new Transform();
        }
        Axes.prototype.Draw = function (gl, shaderProgram) {
            var vertexBuffer = gl.createBuffer();
            var shaderProgramVertexAttributeLocation = gl.getAttribLocation(shaderProgram, 'position');
            gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, 'model'), false, this.transform.ToMatrix().ToFloat32Array());
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.enableVertexAttribArray(shaderProgramVertexAttributeLocation);
            gl.vertexAttribPointer(shaderProgramVertexAttributeLocation, 3, gl.FLOAT, false, 0, 0);
            gl.uniform4fv(gl.getUniformLocation(shaderProgram, "color"), [1.0, 0.0, 0.0, 1.0]);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 0, 1, 0, 0]), gl.STATIC_DRAW);
            gl.drawArrays(gl.LINES, 0, 2);
            gl.uniform4fv(gl.getUniformLocation(shaderProgram, "color"), [0.0, 1.0, 0.0, 1.0]);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 0, 0, 1, 0]), gl.STATIC_DRAW);
            gl.drawArrays(gl.LINES, 0, 2);
            gl.uniform4fv(gl.getUniformLocation(shaderProgram, "color"), [0.0, 0.0, 1.0, 1.0]);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 0, 0, 0, 1]), gl.STATIC_DRAW);
            gl.drawArrays(gl.LINES, 0, 2);
        };
        return Axes;
    }());
    Primatives.Axes = Axes;
    var Grid = (function () {
        function Grid(size) {
            this.size = size;
            this.transform = new Transform();
        }
        Grid.prototype.Draw = function (gl, shaderProgram) {
            var vertexBuffer = gl.createBuffer();
            var shaderProgramVertexAttributeLocation = gl.getAttribLocation(shaderProgram, 'position');
            gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, 'model'), false, Matrix.Identity.ToFloat32Array());
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.enableVertexAttribArray(shaderProgramVertexAttributeLocation);
            gl.vertexAttribPointer(shaderProgramVertexAttributeLocation, 3, gl.FLOAT, false, 0, 0);
            gl.uniform4fv(gl.getUniformLocation(shaderProgram, "color"), [0.5, 0.5, 0.5, 1.0]);
            for (var i = -this.size; i <= this.size; i++) {
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-this.size, 0, i, this.size, 0, i]), gl.STATIC_DRAW);
                gl.drawArrays(gl.LINES, 0, 2);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([i, 0, -this.size, i, 0, this.size]), gl.STATIC_DRAW);
                gl.drawArrays(gl.LINES, 0, 2);
            }
        };
        return Grid;
    }());
    Primatives.Grid = Grid;
    var Box = (function () {
        function Box() {
            this.transform = new Transform();
        }
        Box.prototype.GenerateModel = function () {
            var model = Matrix.Identity;
            model = Matrix.Multiply(model, Matrix.MakeTranslation(this.transform.position));
            model = Matrix.Multiply(model, Matrix.MakeScale(this.transform.scale));
            return model;
        };
        Box.prototype.Draw = function (gl, shaderProgram) {
            var vertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                -1, -1, 1,
                1, 1, 1,
                1, -1, 1,
                1, 1, 1,
                -1, -1, 1,
                -1, 1, 1,
                -1, -1, -1,
                -1, 1, 1,
                -1, -1, 1,
                -1, -1, -1,
                -1, 1, -1,
                -1, 1, 1,
                -1, -1, -1,
                1, -1, -1,
                1, 1, -1,
                -1, -1, -1,
                1, 1, -1,
                -1, 1, -1,
                1, 1, 1,
                1, -1, -1,
                1, -1, 1,
                1, 1, -1,
                1, -1, -1,
                1, 1, 1,
                1, 1, 1,
                -1, 1, 1,
                1, 1, -1,
                -1, 1, -1,
                1, 1, -1,
                -1, 1, 1,
                -1, -1, 1,
                1, -1, 1,
                1, -1, -1,
                1, -1, -1,
                -1, -1, -1,
                -1, -1, 1
            ]), gl.STATIC_DRAW);
            var shaderProgramVertexAttributeLocation = gl.getAttribLocation(shaderProgram, "position");
            gl.enableVertexAttribArray(shaderProgramVertexAttributeLocation);
            gl.vertexAttribPointer(shaderProgramVertexAttributeLocation, 3, gl.FLOAT, false, 0, 0);
            gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, 'model'), false, this.GenerateModel().ToFloat32Array());
            gl.uniform4fv(gl.getUniformLocation(shaderProgram, "color"), [1.0, 1.0, 0.0, 1.0]);
            gl.drawArrays(gl.TRIANGLES, 0, 36);
        };
        return Box;
    }());
    Primatives.Box = Box;
})(Primatives = exports.Primatives || (exports.Primatives = {}));

},{}],2:[function(require,module,exports){
"use strict";
var Engine_1 = require("./Engine");
var canvas = document.getElementById("GameView");
var view = new Engine_1.GameView(canvas);
view.gl.clear(view.gl.COLOR_BUFFER_BIT | view.gl.DEPTH_BUFFER_BIT);
var vertexShaderSource = [
    "attribute vec3 position;",
    "uniform mat4 model;",
    "uniform mat4 view;",
    "uniform mat4 projection;",
    "void main() {",
    "   gl_Position = (projection * view * model) * vec4(position, 1);",
    "}"
].join("\n");
var vertexShader = view.CreateShader(vertexShaderSource, view.gl.VERTEX_SHADER);
var fragmentShaderSource = [
    "precision highp float;",
    "uniform vec4 color;",
    "void main() {",
    "   gl_FragColor = color;",
    "}"
].join("\n");
var fragmentShader = view.CreateShader(fragmentShaderSource, view.gl.FRAGMENT_SHADER);
var shaderProgram = view.CreateProgram(vertexShader, fragmentShader);
view.gl.useProgram(shaderProgram);
var projectionMatrix = Engine_1.Matrix.MakePerspective((60 / 180) * Math.PI, view.canvas.width / view.canvas.height, 0.1, 1000);
view.gl.uniformMatrix4fv(view.gl.getUniformLocation(shaderProgram, 'projection'), false, projectionMatrix.ToFloat32Array());
var time = 0;
var axes = new Engine_1.Primatives.Axes();
var grid = new Engine_1.Primatives.Grid(4);
var box = new Engine_1.Primatives.Box();
box.transform.position = new Engine_1.Vector(1, 0, 0);
box.transform.scale = new Engine_1.Vector(1, 1, 2);
setInterval(function () {
    view.gl.clear(view.gl.COLOR_BUFFER_BIT | view.gl.DEPTH_BUFFER_BIT);
    time += 1000 / 30;
    var viewMatrix = Engine_1.Matrix.MakeLookAt(new Engine_1.Vector(Math.sin(time / 500) * 5, 2, Math.cos(time / 500) * 5), new Engine_1.Vector(0, 0, 0), Engine_1.Vector.Up).Inverse();
    view.gl.uniformMatrix4fv(view.gl.getUniformLocation(shaderProgram, 'view'), false, viewMatrix.ToFloat32Array());
    view.DrawObject(box, shaderProgram);
    view.DrawObject(grid, shaderProgram);
    view.gl.clear(view.gl.DEPTH_BUFFER_BIT);
    view.DrawObject(axes, shaderProgram);
}, 1000 / 30);

},{"./Engine":1}]},{},[2]);
