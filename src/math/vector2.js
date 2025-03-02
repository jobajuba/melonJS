import {clamp} from "./math.js";
import pool from "./../system/pooling.js";

/**
 * @classdesc
 * a generic 2D Vector Object
 * @class Vector2d
 * @memberOf me
 * @constructor
 * @param {Number} [x=0] x value of the vector
 * @param {Number} [y=0] y value of the vector
 */
class Vector2d {

    constructor(x, y) {
        this.onResetEvent(x, y);
    }

    /**
     * @ignore
     */
    onResetEvent(x = 0, y = 0) {
        // this is to enable proper object pooling
        this.x = x;
        this.y = y;
        return this;
    }

    /**
     * @ignore */
    _set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    /**
     * set the Vector x and y properties to the given values<br>
     * @name set
     * @memberOf me.Vector2d
     * @function
     * @param {Number} x
     * @param {Number} y
     * @return {me.Vector2d} Reference to this object for method chaining
     */
    set(x, y) {
        if (x !== +x || y !== +y) {
            throw new Error(
                "invalid x,y parameters (not a number)"
            );
        }

        /**
         * x value of the vector
         * @public
         * @type Number
         * @name x
         * @memberOf me.Vector2d
         */
        //this.x = x;

        /**
         * y value of the vector
         * @public
         * @type Number
         * @name y
         * @memberOf me.Vector2d
         */
        //this.y = y;

        return this._set(x, y);
    }

    /**
     * set the Vector x and y properties to 0
     * @name setZero
     * @memberOf me.Vector2d
     * @function
     * @return {me.Vector2d} Reference to this object for method chaining
     */
    setZero() {
        return this.set(0, 0);
    }

    /**
     * set the Vector x and y properties using the passed vector
     * @name setV
     * @memberOf me.Vector2d
     * @function
     * @param {me.Vector2d} v
     * @return {me.Vector2d} Reference to this object for method chaining
     */
    setV(v) {
        return this._set(v.x, v.y);
    }

    /**
     * Add the passed vector to this vector
     * @name add
     * @memberOf me.Vector2d
     * @function
     * @param {me.Vector2d} v
     * @return {me.Vector2d} Reference to this object for method chaining
     */
    add(v) {
        return this._set(this.x + v.x, this.y + v.y);
    }

    /**
     * Substract the passed vector to this vector
     * @name sub
     * @memberOf me.Vector2d
     * @function
     * @param {me.Vector2d} v
     * @return {me.Vector2d} Reference to this object for method chaining
     */
    sub(v) {
        return this._set(this.x - v.x, this.y - v.y);
    }

    /**
     * Multiply this vector values by the given scalar
     * @name scale
     * @memberOf me.Vector2d
     * @function
     * @param {Number} x
     * @param {Number} [y=x]
     * @return {me.Vector2d} Reference to this object for method chaining
     */
    scale(x, y) {
        return this._set(this.x * x, this.y * (typeof (y) !== "undefined" ? y : x));
    }

    /**
     * Convert this vector into isometric coordinate space
     * @name toIso
     * @memberOf me.Vector2d
     * @function
     * @return {me.Vector2d} Reference to this object for method chaining
     */
    toIso() {
        return this._set(this.x - this.y, (this.x + this.y) * 0.5);
    }

    /**
     * Convert this vector into 2d coordinate space
     * @name to2d
     * @memberOf me.Vector2d
     * @function
     * @return {me.Vector2d} Reference to this object for method chaining
     */
    to2d() {
        return this._set(this.y + this.x / 2, this.y - this.x / 2);
    }

    /**
     * Multiply this vector values by the passed vector
     * @name scaleV
     * @memberOf me.Vector2d
     * @function
     * @param {me.Vector2d} v
     * @return {me.Vector2d} Reference to this object for method chaining
     */
    scaleV(v) {
        return this._set(this.x * v.x, this.y * v.y);
    }

    /**
     * Divide this vector values by the passed value
     * @name div
     * @memberOf me.Vector2d
     * @function
     * @param {Number} value
     * @return {me.Vector2d} Reference to this object for method chaining
     */
    div(n) {
        return this._set(this.x / n, this.y / n);
    }

    /**
     * Update this vector values to absolute values
     * @name abs
     * @memberOf me.Vector2d
     * @function
     * @return {me.Vector2d} Reference to this object for method chaining
     */
    abs() {
        return this._set((this.x < 0) ? -this.x : this.x, (this.y < 0) ? -this.y : this.y);
    }

    /**
     * Clamp the vector value within the specified value range
     * @name clamp
     * @memberOf me.Vector2d
     * @function
     * @param {Number} low
     * @param {Number} high
     * @return {me.Vector2d} new me.Vector2d
     */
    clamp(low, high) {
        return new Vector2d(clamp(this.x, low, high), clamp(this.y, low, high));
    }

    /**
     * Clamp this vector value within the specified value range
     * @name clampSelf
     * @memberOf me.Vector2d
     * @function
     * @param {Number} low
     * @param {Number} high
     * @return {me.Vector2d} Reference to this object for method chaining
     */
    clampSelf(low, high) {
        return this._set(clamp(this.x, low, high), clamp(this.y, low, high));
    }

    /**
     * Update this vector with the minimum value between this and the passed vector
     * @name minV
     * @memberOf me.Vector2d
     * @function
     * @param {me.Vector2d} v
     * @return {me.Vector2d} Reference to this object for method chaining
     */
    minV(v) {
        return this._set((this.x < v.x) ? this.x : v.x, (this.y < v.y) ? this.y : v.y);
    }

    /**
     * Update this vector with the maximum value between this and the passed vector
     * @name maxV
     * @memberOf me.Vector2d
     * @function
     * @param {me.Vector2d} v
     * @return {me.Vector2d} Reference to this object for method chaining
     */
    maxV(v) {
        return this._set((this.x > v.x) ? this.x : v.x, (this.y > v.y) ? this.y : v.y);
    }

    /**
     * Floor the vector values
     * @name floor
     * @memberOf me.Vector2d
     * @function
     * @return {me.Vector2d} new me.Vector2d
     */
    floor() {
        return new Vector2d(Math.floor(this.x), Math.floor(this.y));
    }

    /**
     * Floor this vector values
     * @name floorSelf
     * @memberOf me.Vector2d
     * @function
     * @return {me.Vector2d} Reference to this object for method chaining
     */
    floorSelf() {
        return this._set(Math.floor(this.x), Math.floor(this.y));
    }

    /**
     * Ceil the vector values
     * @name ceil
     * @memberOf me.Vector2d
     * @function
     * @return {me.Vector2d} new me.Vector2d
     */
    ceil() {
        return new Vector2d(Math.ceil(this.x), Math.ceil(this.y));
    }

    /**
     * Ceil this vector values
     * @name ceilSelf
     * @memberOf me.Vector2d
     * @function
     * @return {me.Vector2d} Reference to this object for method chaining
     */
    ceilSelf() {
        return this._set(Math.ceil(this.x), Math.ceil(this.y));
    }

    /**
     * Negate the vector values
     * @name negate
     * @memberOf me.Vector2d
     * @function
     * @return {me.Vector2d} new me.Vector2d
     */
    negate() {
        return new Vector2d(-this.x, -this.y);
    }

    /**
     * Negate this vector values
     * @name negateSelf
     * @memberOf me.Vector2d
     * @function
     * @return {me.Vector2d} Reference to this object for method chaining
     */
    negateSelf() {
        return this._set(-this.x, -this.y);
    }

    /**
     * Copy the x,y values of the passed vector to this one
     * @name copy
     * @memberOf me.Vector2d
     * @function
     * @param {me.Vector2d} v
     * @return {me.Vector2d} Reference to this object for method chaining
     */
    copy(v) {
        return this._set(v.x, v.y);
    }

    /**
     * return true if the two vectors are the same
     * @name equals
     * @memberOf me.Vector2d
     * @function
     * @param {me.Vector2d} v
     * @return {Boolean}
     */
    /**
     * return true if this vector is equal to the given values
     * @name equals
     * @memberOf me.Vector2d
     * @function
     * @param {Number} x
     * @param {Number} y
     * @return {Boolean}
     */
    equals() {
        var _x, _y;
        if (arguments.length === 2) {
            // x, y
            _x = arguments[0];
            _y = arguments[1];
        } else {
            // vector
            _x = arguments[0].x;
            _y = arguments[0].y;
        }
        return ((this.x === _x) && (this.y === _y));
    }

    /**
     * normalize this vector (scale the vector so that its magnitude is 1)
     * @name normalize
     * @memberOf me.Vector2d
     * @function
     * @return {me.Vector2d} Reference to this object for method chaining
     */
    normalize() {
        return this.div(this.length() || 1);
    }

    /**
     * change this vector to be perpendicular to what it was before.<br>
     * (Effectively rotates it 90 degrees in a clockwise direction)
     * @name perp
     * @memberOf me.Vector2d
     * @function
     * @return {me.Vector2d} Reference to this object for method chaining
     */
    perp() {
        return this._set(this.y, -this.x);
    }

    /**
     * Rotate this vector (counter-clockwise) by the specified angle (in radians).
     * @name rotate
     * @memberOf me.Vector2d
     * @function
     * @param {number} angle The angle to rotate (in radians)
     * @param {me.Vector2d|me.ObservableVector2d} [v] an optional point to rotate around
     * @return {me.Vector2d} Reference to this object for method chaining
     */
    rotate(angle, v) {
        var cx = 0;
        var cy = 0;

        if (typeof v === "object") {
            cx = v.x;
            cy = v.y;
        }

        var x = this.x - cx;
        var y = this.y - cy;

        var c = Math.cos(angle);
        var s = Math.sin(angle);

        return this._set(x * c - y * s + cx, x * s + y * c + cy);
    }

    /**
     * return the dot product of this vector and the passed one
     * @name dotProduct
     * @memberOf me.Vector2d
     * @function
     * @param {me.Vector2d} v
     * @return {Number} The dot product.
     */
    dotProduct(v) {
        return this.x * v.x + this.y * v.y;
    }

   /**
     * return the square length of this vector
     * @name length2
     * @memberOf me.Vector2d
     * @function
     * @return {Number} The length^2 of this vector.
     */
    length2() {
        return this.dotProduct(this);
    }

    /**
     * return the length (magnitude) of this vector
     * @name length
     * @memberOf me.Vector2d
     * @function
     * @return {Number} the length of this vector
     */
    length() {
        return Math.sqrt(this.length2());
    }

    /**
     * Linearly interpolate between this vector and the given one.
     * @name lerp
     * @memberOf me.Vector2d
     * @function
     * @param {me.Vector2d} v
     * @param {Number} alpha distance along the line (alpha = 0 will be this vector, and alpha = 1 will be the given one).
     * @return {me.Vector2d} Reference to this object for method chaining
     */
    lerp(v, alpha) {
        this.x += ( v.x - this.x ) * alpha;
        this.y += ( v.y - this.y ) * alpha;
        return this;
    }

    /**
     * return the distance between this vector and the passed one
     * @name distance
     * @memberOf me.Vector2d
     * @function
     * @param {me.Vector2d} v
     * @return {Number}
     */
    distance(v) {
        var dx = this.x - v.x, dy = this.y - v.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * return the angle between this vector and the passed one
     * @name angle
     * @memberOf me.Vector2d
     * @function
     * @param {me.Vector2d} v
     * @return {Number} angle in radians
     */
    angle(v) {
        return Math.acos(clamp(this.dotProduct(v) / (this.length() * v.length()), -1, 1));
    }

    /**
     * project this vector on to another vector.
     * @name project
     * @memberOf me.Vector2d
     * @function
     * @param {me.Vector2d} v The vector to project onto.
     * @return {me.Vector2d} Reference to this object for method chaining
     */
    project(v) {
        return this.scale(this.dotProduct(v) / v.length2());
    }

    /**
     * Project this vector onto a vector of unit length.<br>
     * This is slightly more efficient than `project` when dealing with unit vectors.
     * @name projectN
     * @memberOf me.Vector2d
     * @function
     * @param {me.Vector2d} v The unit vector to project onto.
     * @return {me.Vector2d} Reference to this object for method chaining
     */
    projectN(v) {
        return this.scale(this.dotProduct(v));
    }

    /**
     * return a clone copy of this vector
     * @name clone
     * @memberOf me.Vector2d
     * @function
     * @return {me.Vector2d} new me.Vector2d
     */
    clone() {
        return pool.pull("Vector2d", this.x, this.y);
    }

    /**
     * convert the object to a string representation
     * @name toString
     * @memberOf me.Vector2d
     * @function
     * @return {String}
     */
    toString() {
        return "x:" + this.x + ",y:" + this.y;
    }
};

export default Vector2d;
