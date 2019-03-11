/**
 *  Author: Bastien Wermeille
 *  Date: Février-Mars 2019
 *  Goal: Representation of a floating value
 */
BigNumber.config({DECIMAL_PLACES: 5000})

var FloatingTypes = Object.freeze({
    HALF: {
        exponent: 5,
        mantissa: 10,
        name: 'Half - 16 bits'
    },
    SINGLE: {
        exponent: 8,
        mantissa: 23,
        name: 'Single - 32 bits'
    },
    DOUBLE: {
        exponent: 11,
        mantissa: 52,
        name: 'Double - 64 bits'
    },
    EXTENDED: {
        exponent: 15,
        mantissa: 64,
        name: 'Extended - 80 bits'
    },
    QUAD: {
        exponent: 15,
        mantissa: 112,
        name: 'Quad - 128 bits'
    }
})

class LogicOp {
    static minimise(a) { // Supprime les 0 non significatifs (à gauche)
        let n = 0;
        while (a[0] != true && a.length > 0) {
            a.shift();
            n++;
        }
        return n;
    }
}

class FloatingType {
    constructor(value, type = FloatingTypes.DOUBLE) {
        this.type = type;

        //Size for field exponent
        this.e = type.exponent;
        //Size field mantissa
        this.m = type.mantissa;

        if (value === undefined) {
            this.sign = false;
            this.mantissa = [];
            this.exponent = [];

            let i = 0;
            let length = this.e;
            for (i = 0; i < length; ++i) {
                this.exponent.push(false);
            }

            length = this.m;
            for (i = 0; i < length; ++i) {
                this.mantissa.push(false);
            }

        } else {
            let number = new BigNumber(value);
            
            if (number.isNaN()){
                this.sign = false;
                this._initNaN();
            }else if(!number.isFinite()) {
                this.sign = number.isNegative();
                this._initInfinity();
            } else {
                this._init(value)
            }
        }

        this._cleanMantissa();
    }

    _initNaN() {
        this.mantissa = [];
        this.exponent = [];

        let i = 0;
        let length = this.e;
        for (i = 0; i < length; ++i) {
            this
                .exponent
                .push(false);
        }

        length = this.m;
        for (i = 0; i < length; ++i) {
            this
                .mantissa
                .push(false);
        }
    }

    _initInfinity() {
        this.mantissa = [];
        this.exponent = [];

        let i = 0;
        let length = this.e;
        for (i = 0; i < length; ++i) {
            this
                .exponent
                .push(false);
        }

        length = this.m;
        for (i = 0; i < length; ++i) {
            this
                .mantissa
                .push(false);
        }
    }

    isNaN() {
        //Exposant décalé = (2^e)-1 & mantissa <> 0
        let mantissaClone = this
            .mantissa
            .slice(0);
        LogicOp.minimise(mantissaClone);
        return (this._exponentDecimal() + this._dOffset() == Math.pow(2, this.e) - 1 && mantissaClone.length != 0);
    }

    isZero() {
        //Exponent shiffted = 0 & mantissa = 0
        let mantissaClone = this
            .mantissa
            .slice(0);
        LogicOp.minimise(mantissaClone);
        return (this._exponentDecimal() + this._dOffset() == 0 && mantissaClone.length == 0);
    }

    isInfinity() {
        //Exposant décalé = (2^e)-1 & mantissa = 0
        let mantissaClone = this
            .mantissa
            .slice(0);
        LogicOp.minimise(mantissaClone);
        return (this._exponentDecimal() + this._dOffset() == Math.pow(2, this.e) - 1 && mantissaClone.length == 0);
    }

    isSubnormal() {
        // exposant is empty and mantissa = 0
        let mantissaClone = this
            .mantissa
            .slice(0);
        LogicOp.minimise(mantissaClone);
        return (this._exponentDecimal() + this._dOffset() == 0 && mantissaClone.length > 0)
    }

    _cleanMantissa() {
        for (let i = 0; i < this.m; ++i) {
            if (this.mantissa[i] != true) 
                this.mantissa[i] = false;
            }
        }

    _wholeToBinary(whole) {
        //Convert an int as an integer part in binary
        let binary = [];
        let limit = this.m + 1;
        while (!whole.isZero() && limit > 0) {
            binary.unshift(!!(whole.mod(2).valueOf())); //!! pour que les valeurs soient des booléens et non pas un 0 ou un 1
            whole = whole.minus(whole.mod(2));
            whole = whole.div(2);
            limit--;
        }
        return binary;
    }

    _decimalToBinary(decimal, limit) {
        //Converts the decimal place of a number in binary
        let binary = [];
        
        while (!decimal.isZero() && limit > 0) { 
            decimal = decimal.times(2);
            binary.push(!!(decimal.gte(1))); //!! pour que les valeurs soient des booléens et non pas un 0 ou un 1
            if (decimal.gte(1)) {
                decimal = decimal.minus(1);
            }
            count++;
        }

        return binary;
    }

    _checkExponent(exponent) {
        // valide -> true overflow ou underflow -> false
        return exponent <= this._dOffset() && exponent >= -this._dOffset() + 1;
    }

    _exponentToBinary(exponent) {
        //Convert an exponent in Binary
        exponent += this._dOffset();

        let binary = [];
        for (let i = 0; i < this.e; ++i) {
            binary.unshift(!!(exponent % 2)); //!! pour que les valeurs soient des booléens et non pas un 0 ou un 1
            exponent -= exponent % 2;
            exponent /= 2;
        }
        return binary;
    }

    _init(value) {
        /** Steps to folow:
        1. Negative signe
        2. Convert whole number to binary
        3. Convert fraction section to binary
        4. join together
        5. how many space to move
        6. add n to exponent
        7. Exponent to binary
        */
        
        let n = new BigNumber(value);

        //Step 1 - sign
        this.sign = n.isNegative();
        if (n.isNegative()) {
            n = n.negated();
        }

        //Step 2 - separate integer part from floating part
        let whole = n.integerValue(BigNumber.ROUND_DOWN);
        let decimal = n.minus(whole);
        
        console.log("Before Step 3")
        //Step 3 - Fraction and whole part to binary
        whole = this._wholeToBinary(whole);
        decimal = this._decimalToBinary(decimal, this.m + 1 - whole.length);

        console.log("Before Step 3.5")
        //Step 3.5 - Special case 0
        if (decimal.length === 0 && whole.length === 0) {
            this.exponent = this._exponentToBinary(-this._dOffset());
            return;
        }

        //Step 4 - Join together
        let wholeSize = whole.length;
        let binaryMantissa = whole.concat(decimal);
        console.log("Before Step 5")
        //Step 5 - How many space to move
        let exponent = 0;
        if (wholeSize > 1) {
            //Calc right shift
            exponent += (wholeSize - 1);
        } else if (wholeSize < 1) {
            //Calc left shift
            let shift = binaryMantissa.indexOf(true);
            exponent -= (shift + 1);
            for (let i = 0; i < shift; i++) {
                binaryMantissa.shift();
            }
        }
        console.log("After Step 5")
        //Detect subnormal number
        if (exponent > -this._dOffset()){
            //Normal number
            binaryMantissa.shift(); //remove of the hidden 1
            binaryMantissa.length = this.m;
        }
        else
        {
            //Subnormal numbers
            let shift = exponent;
            exponent = this._exponentToBinary(this._dOffset());
            while(shift < -this._dOffset()){
                binaryMantissa.unshift(false)
                shift++;
            }
        }

        console.log("Before Step 6")
        //Step 6+7 - Exponent to Binary
        this.exponent = this._exponentToBinary(exponent);
        this.mantissa = binaryMantissa;
    }

    toString() {
        // Special cases
        if (this.isNaN()) {
            return NaN;
        }

        if (this.isInfinity()) {
            return (this.sign
                ? -1
                : 1) * Infinity;
        }

        if (this.isZero()) {
            if (this.sign) 
                return "-0";
            else 
                return 0;
            }
        
        let exp = this._exponentDecimal();
        let length = this.mantissa.length;
        let result = new BigNumber(1);

        //If subnormal adapt exponent and remove hidden bit
        if(this.isSubnormal()){
            result = new BigNumber(0);
            exp ++;
        }

        //Remove zero at the end of the mantissa
        while (this.mantissa[length - 1] != true && length >= 1) {
            length--;
        }

        for (let i = 0; i < length; ++i) {
            if (this.mantissa[i]) {
                result = result.plus(new BigNumber(1).div(new BigNumber(2).pow(i + 1)));
            }
        }

        result = result.times(new BigNumber(2).pow(exp));

        return result
            .times(this.sign
            ? -1
            : 1)
            .toString();
    }

    _mantissaDecimal() {
        let length = this.mantissa.length;
        let stepAddition = 5;
        let result = 1; // valeur caché, compensation

        // Limitation du travail
        while (this.mantissa[length - 1] != true && length >= 1) {
            length--;
        }

        for (let i = 0; i < length; i++) {
            result *= 10;
            if (this.mantissa[i]) {
                result += stepAddition;
            }
            stepAddition *= 5;
        }

        return result;
    }

    _exponentDecimal() {
        let tot = 0;
        let size = this.e;
        for (let i = 0; i < size; ++i) {
            let n = this.exponent[i]
                ? 1
                : 0;
            tot = tot * 2 + n;
        }
        tot -= this._dOffset();
        return tot;
    }

    _dOffset() {
        return Math.pow(2, this.e - 1) - 1;
    }
}