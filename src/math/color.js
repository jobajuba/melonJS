import { clamp, random } from "./math.js";
import pool from "./../system/pooling.js";

// convert a give color component to it hexadecimal value
var toHex = function (component) {
    return "0123456789ABCDEF".charAt((component - (component % 16)) >> 4) + "0123456789ABCDEF".charAt(component % 16);
};

var rgbaRx = /^rgba?\((\d+), ?(\d+), ?(\d+)(, ?([\d\.]+))?\)$/;
var hex3Rx = /^#([\da-fA-F])([\da-fA-F])([\da-fA-F])$/;
var hex4Rx = /^#([\da-fA-F])([\da-fA-F])([\da-fA-F])([\da-fA-F])$/;
var hex6Rx = /^#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})$/;
var hex8Rx = /^#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})$/;

var cssToRGB = new Map();

[
    // CSS1
    [ "black",                  [   0,   0,   0 ] ],
    [ "silver",                 [ 192, 192, 129 ] ],
    [ "gray",                   [ 128, 128, 128 ] ],
    [ "white",                  [ 255, 255, 255 ] ],
    [ "maroon",                 [ 128,   0,   0 ] ],
    [ "red",                    [ 255,   0,   0 ] ],
    [ "purple",                 [ 128,   0, 128 ] ],
    [ "fuchsia",                [ 255,   0, 255 ] ],
    [ "green",                  [   0, 128,   0 ] ],
    [ "lime",                   [   0, 255,   0 ] ],
    [ "olive",                  [ 128, 128,   0 ] ],
    [ "yellow",                 [ 255, 255,   0 ] ],
    [ "navy",                   [   0,   0, 128 ] ],
    [ "blue",                   [   0,   0, 255 ] ],
    [ "teal",                   [   0, 128, 128 ] ],
    [ "aqua",                   [   0, 255, 255 ] ],

    // CSS2
    [ "orange",                 [ 255, 165,   0 ] ],

    // CSS3
    [ "aliceblue",              [ 240, 248, 245 ] ],
    [ "antiquewhite",           [ 250, 235, 215 ] ],
    [ "aquamarine",             [ 127, 255, 212 ] ],
    [ "azure",                  [ 240, 255, 255 ] ],
    [ "beige",                  [ 245, 245, 220 ] ],
    [ "bisque",                 [ 255, 228, 196 ] ],
    [ "blanchedalmond",         [ 255, 235, 205 ] ],
    [ "blueviolet",             [ 138,  43, 226 ] ],
    [ "brown",                  [ 165,  42,  42 ] ],
    [ "burlywood",              [ 222, 184,  35 ] ],
    [ "cadetblue",              [  95, 158, 160 ] ],
    [ "chartreuse",             [ 127, 255,   0 ] ],
    [ "chocolate",              [ 210, 105,  30 ] ],
    [ "coral",                  [ 255, 127,  80 ] ],
    [ "cornflowerblue",         [ 100, 149, 237 ] ],
    [ "cornsilk",               [ 255, 248, 220 ] ],
    [ "crimson",                [ 220,  20,  60 ] ],
    [ "darkblue",               [   0,   0, 139 ] ],
    [ "darkcyan",               [   0, 139, 139 ] ],
    [ "darkgoldenrod",          [ 184, 134,  11 ] ],
    [ "darkgray[*]",            [ 169, 169, 169 ] ],
    [ "darkgreen",              [   0, 100,   0 ] ],
    [ "darkgrey[*]",            [ 169, 169, 169 ] ],
    [ "darkkhaki",              [ 189, 183, 107 ] ],
    [ "darkmagenta",            [ 139,   0, 139 ] ],
    [ "darkolivegreen",         [  85, 107,  47 ] ],
    [ "darkorange",             [ 255, 140,   0 ] ],
    [ "darkorchid",             [ 153,  50, 204 ] ],
    [ "darkred",                [ 139,   0,   0 ] ],
    [ "darksalmon",             [ 233, 150, 122 ] ],
    [ "darkseagreen",           [ 143, 188, 143 ] ],
    [ "darkslateblue",          [  72,  61, 139 ] ],
    [ "darkslategray",          [  47,  79,  79 ] ],
    [ "darkslategrey",          [  47,  79,  79 ] ],
    [ "darkturquoise",          [   0, 206, 209 ] ],
    [ "darkviolet",             [ 148,   0, 211 ] ],
    [ "deeppink",               [ 255,  20, 147 ] ],
    [ "deepskyblue",            [   0, 191, 255 ] ],
    [ "dimgray",                [ 105, 105, 105 ] ],
    [ "dimgrey",                [ 105, 105, 105 ] ],
    [ "dodgerblue",             [  30, 144, 255 ] ],
    [ "firebrick",              [ 178,  34,  34 ] ],
    [ "floralwhite",            [ 255, 250, 240 ] ],
    [ "forestgreen",            [  34, 139,  34 ] ],
    [ "gainsboro",              [ 220, 220, 220 ] ],
    [ "ghostwhite",             [ 248, 248, 255 ] ],
    [ "gold",                   [ 255, 215,   0 ] ],
    [ "goldenrod",              [ 218, 165,  32 ] ],
    [ "greenyellow",            [ 173, 255,  47 ] ],
    [ "grey",                   [ 128, 128, 128 ] ],
    [ "honeydew",               [ 240, 255, 240 ] ],
    [ "hotpink",                [ 255, 105, 180 ] ],
    [ "indianred",              [ 205,  92,  92 ] ],
    [ "indigo",                 [  75,   0, 130 ] ],
    [ "ivory",                  [ 255, 255, 240 ] ],
    [ "khaki",                  [ 240, 230, 140 ] ],
    [ "lavender",               [ 230, 230, 250 ] ],
    [ "lavenderblush",          [ 255, 240, 245 ] ],
    [ "lawngreen",              [ 124, 252,   0 ] ],
    [ "lemonchiffon",           [ 255, 250, 205 ] ],
    [ "lightblue",              [ 173, 216, 230 ] ],
    [ "lightcoral",             [ 240, 128, 128 ] ],
    [ "lightcyan",              [ 224, 255, 255 ] ],
    [ "lightgoldenrodyellow",   [ 250, 250, 210 ] ],
    [ "lightgray",              [ 211, 211, 211 ] ],
    [ "lightgreen",             [ 144, 238, 144 ] ],
    [ "lightgrey",              [ 211, 211, 211 ] ],
    [ "lightpink",              [ 255, 182, 193 ] ],
    [ "lightsalmon",            [ 255, 160, 122 ] ],
    [ "lightseagreen",          [  32, 178, 170 ] ],
    [ "lightskyblue",           [ 135, 206, 250 ] ],
    [ "lightslategray",         [ 119, 136, 153 ] ],
    [ "lightslategrey",         [ 119, 136, 153 ] ],
    [ "lightsteelblue",         [ 176, 196, 222 ] ],
    [ "lightyellow",            [ 255, 255, 224 ] ],
    [ "limegreen",              [  50, 205,  50 ] ],
    [ "linen",                  [ 250, 240, 230 ] ],
    [ "mediumaquamarine",       [ 102, 205, 170 ] ],
    [ "mediumblue",             [   0,   0, 205 ] ],
    [ "mediumorchid",           [ 186,  85, 211 ] ],
    [ "mediumpurple",           [ 147, 112, 219 ] ],
    [ "mediumseagreen",         [  60, 179, 113 ] ],
    [ "mediumslateblue",        [ 123, 104, 238 ] ],
    [ "mediumspringgreen",      [   0, 250, 154 ] ],
    [ "mediumturquoise",        [  72, 209, 204 ] ],
    [ "mediumvioletred",        [ 199,  21, 133 ] ],
    [ "midnightblue",           [  25,  25, 112 ] ],
    [ "mintcream",              [ 245, 255, 250 ] ],
    [ "mistyrose",              [ 255, 228, 225 ] ],
    [ "moccasin",               [ 255, 228, 181 ] ],
    [ "navajowhite",            [ 255, 222, 173 ] ],
    [ "oldlace",                [ 253, 245, 230 ] ],
    [ "olivedrab",              [ 107, 142,  35 ] ],
    [ "orangered",              [ 255,  69,   0 ] ],
    [ "orchid",                 [ 218, 112, 214 ] ],
    [ "palegoldenrod",          [ 238, 232, 170 ] ],
    [ "palegreen",              [ 152, 251, 152 ] ],
    [ "paleturquoise",          [ 175, 238, 238 ] ],
    [ "palevioletred",          [ 219, 112, 147 ] ],
    [ "papayawhip",             [ 255, 239, 213 ] ],
    [ "peachpuff",              [ 255, 218, 185 ] ],
    [ "peru",                   [ 205, 133,  63 ] ],
    [ "pink",                   [ 255, 192, 203 ] ],
    [ "plum",                   [ 221, 160, 221 ] ],
    [ "powderblue",             [ 176, 224, 230 ] ],
    [ "rosybrown",              [ 188, 143, 143 ] ],
    [ "royalblue",              [  65, 105, 225 ] ],
    [ "saddlebrown",            [ 139,  69,  19 ] ],
    [ "salmon",                 [ 250, 128, 114 ] ],
    [ "sandybrown",             [ 244, 164,  96 ] ],
    [ "seagreen",               [  46, 139,  87 ] ],
    [ "seashell",               [ 255, 245, 238 ] ],
    [ "sienna",                 [ 160,  82,  45 ] ],
    [ "skyblue",                [ 135, 206, 235 ] ],
    [ "slateblue",              [ 106,  90, 205 ] ],
    [ "slategray",              [ 112, 128, 144 ] ],
    [ "slategrey",              [ 112, 128, 144 ] ],
    [ "snow",                   [ 255, 250, 250 ] ],
    [ "springgreen",            [   0, 255, 127 ] ],
    [ "steelblue",              [  70, 130, 180 ] ],
    [ "tan",                    [ 210, 180, 140 ] ],
    [ "thistle",                [ 216, 191, 216 ] ],
    [ "tomato",                 [ 255,  99,  71 ] ],
    [ "turquoise",              [  64, 224, 208 ] ],
    [ "violet",                 [ 238, 130, 238 ] ],
    [ "wheat",                  [ 245, 222, 179 ] ],
    [ "whitesmoke",             [ 245, 245, 245 ] ],
    [ "yellowgreen",            [ 154, 205,  50 ] ]
].forEach(function (value) {
    cssToRGB.set(value[0], value[1]);
});

/**
 * @classdesc
 * A color manipulation object.
 * @class Color
 * @memberOf me
 * @constructor
 * @param {Number|Float32Array} [r=0] red component or array of color components
 * @param {Number} [g=0] green component
 * @param {Number} [b=0] blue component
 * @param {Number} [alpha=1.0] alpha value
 */
class Color {

    constructor(r, g, b, alpha) {
        this.onResetEvent(r, g, b, alpha);
    }

    /**
     * @ignore
     */
    onResetEvent(r = 0, g = 0, b = 0, alpha = 1.0) {
        /**
         * @ignore
         */
        if (typeof (this.glArray) === "undefined") {
            // Color components in a Float32Array suitable for WebGL
            this.glArray = new Float32Array([ 0.0, 0.0, 0.0, 1.0 ]);
        }

        return this.setColor(r, g, b, alpha);
    }

    /**
     * Color Red Component
     * @type Number
     * @name r
     * @readonly
     * @memberOf me.Color
     */

    /**
     * @ignore
     */
    get r() {
        return ~~(this.glArray[0] * 255);
    }
    /**
     * @ignore
     */
    set r(value) {
        this.glArray[0] = clamp(~~value || 0, 0, 255) / 255.0;
    }


    /**
     * Color Green Component
     * @type Number
     * @name g
     * @readonly
     * @memberOf me.Color
     */

    /**
     * @ignore
     */
    get g() {
        return ~~(this.glArray[1] * 255);
    }
    /**
     * @ignore
     */
    set g(value) {
        this.glArray[1] = clamp(~~value || 0, 0, 255) / 255.0;
    }


    /**
     * Color Blue Component
     * @type Number
     * @name b
     * @readonly
     * @memberOf me.Color
     */
    /**
     * @ignore
     */
    get b() {
        return ~~(this.glArray[2] * 255);
    }
    /**
     * @ignore
     */
    set b(value) {
        this.glArray[2] = clamp(~~value || 0, 0, 255) / 255.0;
    }

    /**
     * Color Alpha Component
     * @type Number
     * @name alpha
     * @readonly
     * @memberOf me.Color
     */

    /**
     * @ignore
     */
    get alpha() {
        return this.glArray[3];
    }
    /**
     * @ignore
     */
    set alpha(value) {
        this.glArray[3] = typeof(value) === "undefined" ? 1.0 : clamp(+value, 0, 1.0);
    }


    /**
     * Set this color to the specified value.
     * @name setColor
     * @memberOf me.Color
     * @function
     * @param {Number} r red component [0 .. 255]
     * @param {Number} g green component [0 .. 255]
     * @param {Number} b blue component [0 .. 255]
     * @param {Number} [alpha=1.0] alpha value [0.0 .. 1.0]
     * @return {me.Color} Reference to this object for method chaining
     */
    setColor(r, g, b, alpha = 1.0) {
        // Private initialization: copy Color value directly
        if (r instanceof Color) {
            this.glArray.set(r.glArray);
            return r;
        }
        this.r = r;
        this.g = g;
        this.b = b;
        this.alpha = alpha;
        return this;
    }

    /**
     * Create a new copy of this color object.
     * @name clone
     * @memberOf me.Color
     * @function
     * @return {me.Color} Reference to the newly cloned object
     */
    clone() {
        return pool.pull("Color", this);
    }

    /**
     * Copy a color object or CSS color into this one.
     * @name copy
     * @memberOf me.Color
     * @function
     * @param {me.Color|String} color
     * @return {me.Color} Reference to this object for method chaining
     */
    copy(color) {
        if (color instanceof Color) {
            this.glArray.set(color.glArray);
            return this;
        }

        return this.parseCSS(color);
    }

    /**
     * Blend this color with the given one using addition.
     * @name add
     * @memberOf me.Color
     * @function
     * @param {me.Color} color
     * @return {me.Color} Reference to this object for method chaining
     */
    add(color) {
        this.glArray[0] = clamp(this.glArray[0] + color.glArray[0], 0, 1);
        this.glArray[1] = clamp(this.glArray[1] + color.glArray[1], 0, 1);
        this.glArray[2] = clamp(this.glArray[2] + color.glArray[2], 0, 1);
        this.glArray[3] = (this.glArray[3] + color.glArray[3]) / 2;

        return this;
    }

    /**
     * Darken this color value by 0..1
     * @name darken
     * @memberOf me.Color
     * @function
     * @param {Number} scale
     * @return {me.Color} Reference to this object for method chaining
     */
    darken(scale) {
        scale = clamp(scale, 0, 1);
        this.glArray[0] *= scale;
        this.glArray[1] *= scale;
        this.glArray[2] *= scale;

        return this;
    }

    /**
     * Linearly interpolate between this color and the given one.
     * @name lerp
     * @memberOf me.Color
     * @function
     * @param {me.Color} color
     * @param {Number} alpha with alpha = 0 being this color, and alpha = 1 being the given one.
     * @return {me.Color} Reference to this object for method chaining
     */
    lerp(color, alpha) {
        alpha = clamp(alpha, 0, 1);
        this.glArray[0] += (color.glArray[0] - this.glArray[0]) * alpha;
        this.glArray[1] += (color.glArray[1] - this.glArray[1]) * alpha;
        this.glArray[2] += (color.glArray[2] - this.glArray[2]) * alpha;

        return this;
    }

    /**
     * Lighten this color value by 0..1
     * @name lighten
     * @memberOf me.Color
     * @function
     * @param {Number} scale
     * @return {me.Color} Reference to this object for method chaining
     */
    lighten(scale) {
        scale = clamp(scale, 0, 1);
        this.glArray[0] = clamp(this.glArray[0] + (1 - this.glArray[0]) * scale, 0, 1);
        this.glArray[1] = clamp(this.glArray[1] + (1 - this.glArray[1]) * scale, 0, 1);
        this.glArray[2] = clamp(this.glArray[2] + (1 - this.glArray[2]) * scale, 0, 1);

        return this;
    }

    /**
     * Generate random r,g,b values for this color object
     * @name random
     * @memberOf me.Color
     * @function
     * @param {Number} [min=0] minimum value for the random range
     * @param {Number} [max=255] maxmium value for the random range
     * @return {me.Color} Reference to this object for method chaining
     */
    random(min = 0, max = 255) {
        if (min < 0) {
            min = 0;
        }
        if (max > 255) {
            max = 255;
        }

        return this.setColor(
            random(min, max),
            random(min, max),
            random(min, max),
            this.alpha
        );
    }

    /**
     * Return true if the r,g,b,a values of this color are equal with the
     * given one.
     * @name equals
     * @memberOf me.Color
     * @function
     * @param {me.Color} color
     * @return {Boolean}
     */
    equals(color) {
        return (
            (this.glArray[0] === color.glArray[0]) &&
            (this.glArray[1] === color.glArray[1]) &&
            (this.glArray[2] === color.glArray[2]) &&
            (this.glArray[3] === color.glArray[3])
        );
    }

    /**
     * Parse a CSS color string and set this color to the corresponding
     * r,g,b values
     * @name parseCSS
     * @memberOf me.Color
     * @function
     * @param {String} color
     * @return {me.Color} Reference to this object for method chaining
     */
    parseCSS(cssColor) {
        // TODO : Memoize this function by caching its input

        if (cssToRGB.has(cssColor)) {
            return this.setColor.apply(this, cssToRGB.get(cssColor));
        }

        return this.parseRGB(cssColor);
    }

    /**
     * Parse an RGB or RGBA CSS color string
     * @name parseRGB
     * @memberOf me.Color
     * @function
     * @param {String} color
     * @return {me.Color} Reference to this object for method chaining
     */
    parseRGB(rgbColor) {
        // TODO : Memoize this function by caching its input

        var match = rgbaRx.exec(rgbColor);
        if (match) {
            return this.setColor(+match[1], +match[2], +match[3], +match[5]);
        }

        return this.parseHex(rgbColor);
    }

    /**
     * Parse a Hex color ("#RGB", "#RGBA" or "#RRGGBB", "#RRGGBBAA" format) and set this color to
     * the corresponding r,g,b,a values
     * @name parseHex
     * @memberOf me.Color
     * @function
     * @param {String} color
     * @param {boolean} [argb = false] true if format is #ARGB, or #AARRGGBB (as opposed to #RGBA or #RGGBBAA)
     * @return {me.Color} Reference to this object for method chaining
     */
    parseHex(hexColor, argb = false) {
        // TODO : Memoize this function by caching its input

        var match;
        if ((match = hex8Rx.exec(hexColor))) {
            // #AARRGGBB or #RRGGBBAA
            return this.setColor(
                parseInt(match[argb === false ? 1 : 2], 16), // r
                parseInt(match[argb === false ? 2 : 3], 16), // g
                parseInt(match[argb === false ? 3 : 4], 16), // b
                (clamp(parseInt(match[argb === false ? 4 : 1], 16), 0, 255) / 255.0).toFixed(1) // a
            );
        }

        if ((match = hex6Rx.exec(hexColor))) {
            // #RRGGBB
            return this.setColor(
                parseInt(match[1], 16),
                parseInt(match[2], 16),
                parseInt(match[3], 16)
            );
        }

        if ((match = hex4Rx.exec(hexColor))) {
            // #ARGB or #RGBA
            var r = match[argb === false ? 1 : 2];
            var g = match[argb === false ? 2 : 3];
            var b = match[argb === false ? 3 : 4];
            var a = match[argb === false ? 4 : 1];
            return this.setColor(
                parseInt(r + r, 16), // r
                parseInt(g + g, 16), // g
                parseInt(b + b, 16), // b
                (clamp(parseInt(a + a, 16), 0, 255) / 255.0).toFixed(1) // a
            );
        }

        if ((match = hex3Rx.exec(hexColor))) {
            // #RGB
            return this.setColor(
                parseInt(match[1] + match[1], 16),
                parseInt(match[2] + match[2], 16),
                parseInt(match[3] + match[3], 16)
            );
        }

        throw new Error(
            "invalid parameter: " + hexColor
        );
    }

    /**
     * return an array representation of this object
     * @name toArray
     * @memberOf me.Color
     * @function
     * @return {Float32Array}
     */
    toArray() {
        return this.glArray;
    }

    /**
     * Get the color in "#RRGGBB" format
     * @name toHex
     * @memberOf me.Color
     * @function
     * @return {String}
     */
    toHex() {
        // TODO : Memoize this function by caching its result until any of
        // the r,g,b,a values are changed

        return "#" + toHex(this.r) + toHex(this.g) + toHex(this.b);
    }

    /**
     * Get the color in "#RRGGBBAA" format
     * @name toHex8
     * @memberOf me.Color
     * @function
     * @return {String}
     */
    toHex8() {
        // TODO : Memoize this function by caching its result until any of
        // the r,g,b,a values are changed

        return "#" + toHex(this.r) + toHex(this.g) + toHex(this.b) + toHex(this.alpha * 255);
    }

    /**
     * Get the color in "rgb(R,G,B)" format
     * @name toRGB
     * @memberOf me.Color
     * @function
     * @return {String}
     */
    toRGB() {
        // TODO : Memoize this function by caching its result until any of
        // the r,g,b,a values are changed

        return "rgb(" +
            this.r + "," +
            this.g + "," +
            this.b +
        ")";
    }

    /**
     * Get the color in "rgba(R,G,B,A)" format
     * @name toRGBA
     * @memberOf me.Color
     * @function
     * @return {String}
     */
    toRGBA() {
        // TODO : Memoize this function by caching its result until any of
        // the r,g,b,a values are changed

        return "rgba(" +
            this.r + "," +
            this.g + "," +
            this.b + "," +
            this.alpha +
        ")";
    }
};

export default Color;
