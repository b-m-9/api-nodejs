class _String {
    constructor(len, options) {
        this.max = len || 255;
        if(options){
            if(options.regexp){
                this.regexp = new RegExp(String(options.regexp))

            }
        }
    }

    valid(v) {
        if (!v) return {success: false, error: 'Value undefined'};
        v = String(v);
        if (typeof v !== 'string') return {success: false, error: 'Value is not string'};
        if (v.length > this.max) return {success: false, error: 'Value length > ' + 255};
        if(this.regexp  && !this.regexp.test(v)) return {success: false, error: 'Value not valid regexp'};
        return {success: true, value: v};
    }
}

class _Float {
    // IEEE_754-2008 - Standard for Floating-Point Arithmetic
    constructor(length, fixed, options) {
        this.max = length || 10;
        this.fixed = fixed || 4;
        if(options){
            if(options.regexp){
                this.regexp = new RegExp(String(options.regexp))
            }
        }
    }

    valid(v) {
        if (!v) return {success: false, error: 'Value undefined'};
        v = Number(v);
        if (typeof v !== 'number') return {success: false, error: 'Value is not string'};
        if (isNaN(v)) return {success: false, error: 'Value NaN'};
        if (!isFinite(v)) return {success: false, error: 'Value Infinity'};
        if (String(v).length > this.max) return {success: false, error: 'Value length > ' + 255};
        // Gaussovo (bank rounding)
        let d = this.fixed || 0,
            m = Math.pow(10, d),
            n = +(d ? v * m : v).toFixed(8),
            i = Math.floor(n), f = n - i,
            e = 1e-8,
            r = (f > 0.5 - e && f < 0.5 + e) ?
                ((i % 2 === 0) ? i : i + 1) : Math.round(n);

        v = d ? r / m : r;
        if(this.regexp  && !this.regexp.test(v)) return {success: false, error: 'Value not valid regexp'};


        return {success: true, value: v};
    }
}

class _Date {
    constructor(len) {
        this.max = len;
    }

    valid(v) {

    }
}

const DATE = (length, options) => {
    return new _Date(length, options).valid;

};

const STRING = (length, options) => {
    return new _String(length, options).valid;
};

const FLOAT = (length, fixed, options) => {
    /*
          ┌────────── fixed (3)
       13.556 ───────── length (5)
    */
    return new _Float(length, fixed, options).valid;

};
const INTEGER = (length, options) => {
    return FLOAT(length, 0, options);
};


module.exports = {
    DATE: DATE,
    STRING: STRING,
    FLOAT: FLOAT,
    INTEGER: INTEGER,
};