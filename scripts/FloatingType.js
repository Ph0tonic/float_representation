/**
 *  Author: Bastien Wermeille
 *  Date: Février-Mars 2018
 *  Goal: Representation of a floating value with only int and boolean types
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

/*
*  Underscore is standard to say "Should not be accessed from outside"
*/
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
            if (number.isNaN || number.isInfinity) {
                //TODO init
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
                this._init(value)
            }

            //

        }

        // if ((value || value === 0) && !isNaN(value)) {     if (value === -0) {  value
        // = "-0";     } else if (Number.isInteger(value)) {         value =
        // value.toString();     }     if (value === Infinity || value == "Infinity") {
        //       //Infinity         this.sign = false;         this.exponent =
        // this._exponentToBinary(Math.pow(2, this.e) - 1 - this._dOffset());
        // this.exponent.length = this.e;         this.mantissa = [];
        // this.mantissa.length = this.m;     } else if (value === -Infinity || value ==
        // "-Infinity") {         this.sign = true;         this.exponent =
        // this._exponentToBinary(Math.pow(2, this.e) - 1 - this._dOffset());
        // this.exponent.length = this.e;         this.mantissa = [];
        // this.mantissa.length = this.m;     } else {         //Standard cases
        // this._init(value);     } } else {     if (Number.isNaN(NaN)) {         //NaN
        //       this.sign = false;         this.exponent =
        // this._exponentToBinary(Math.pow(2, this.e) - 1 - this._dOffset());
        // this.exponent.length = this.e;         this.mantissa = [true];
        // this.mantissa.length = this.m;     } else {         //Initialisation sans
        // valeur         this.sign = false;         this.exponent = [];
        // this.exponent.length = this.e;         this.mantissa = [];
        // this.mantissa.length = this.m;     } }
        this._cleanMantissa();
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

    _cleanMantissa() {
        for (let i = 0; i < this.m; ++i) {
            if (this.mantissa[i] != true) 
                this.mantissa[i] = false;
            }
        }

    _wholeToBinary(whole) {
        //Convert an int as an integer part in binary
        let binary = [];
        while (!whole.isZero()) {
            binary.unshift(!!(whole.mod(2).valueOf())); //!! pour que les valeurs soient des booléens et non pas un 0 ou un 1
            whole = whole.minus(whole.mod(2));
            whole = whole.div(2);
        }
        return binary;
    }

    _decimalToBinary(decimal) {
        //Converts the decimal place of a number in binary
        if (decimal == undefined) {
            decimal = 0;
        }

        let length = decimal.length | decimal
            .toString()
            .length; // /!\ compter avant le parse afin de ne pas supprimer les 0 éventuelles zéro se trouvant au début de la chaine: 12.002 -> 002
        decimal = parseInt(decimal);
        let binary = [];
        let limit = Math.pow(10, length);
        let count = 0;
        while (decimal != 0 && count < this.m) {
            decimal *= 2;
            binary.push(!!(decimal >= limit)); //!! pour que les valeurs soient des booléens et non pas un 0 ou un 1
            if (decimal >= limit) {
                decimal -= limit;
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
        //TODO: Adapt for subnormal number
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

        //Step 1 - signe
        this.sign = n.isNegative();
        if (n.isNegative()) {
            n = n.negate();
        }

        //Step 2 - separate integer part from floating part
        let whole = n.integerValue(BigNumber.ROUND_DOWN);
        let decimal = n.minus(whole);
        console.log(whole.toString())
        console.log(decimal.toString())

        whole = this._wholeToBinary(whole);
        console.log("Whole : " + whole)
        console.log("Decimal : " + decimal)

        //Step 3 - Fraction section to binary
        decimal = this._decimalToBinary(parts[1]);
        console.log("Decimal : " + decimal)

        //Step 3.5 - Special case 0
        if (decimal.length === 0 && whole.length === 0) {
            this.mantissa = [];
            console.log("potential leak")
            return;
            this.exponent = this._exponentToBinary(-this._dOffset());
            return;
        }

        //Step 4 - Join together
        let wholeSize = whole.length;
        let binaryMantissa = whole.concat(decimal);

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
        binaryMantissa.shift(); //remove of the hidden 1
        binaryMantissa.length = this.m;

        //Step 6+7 - Exponent to Binary
        console.log("second leak")
        return;
        this.exponent = this._exponentToBinary(exponent);
        this.mantissa = binaryMantissa;
    }

    toStr() {
        console.log("TOSTR call");
        // TODO: Supprimer - Fonction avec utilisation d'un type float pour tests
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

        //TODO: Display subnormal values Limitation du travail
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
            .toExponential(20);
    }

    toString() {
        console.log("TOSTRING call");
        //Special cases
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
        
        //Code here with "this" to access Object property
        let exp = this._exponentDecimal();
        let mant = this._mantissaDecimal();

        //Affichage simplifiée
        let calculated = mant;
        let pointPosition = 1;
        if (exp >= 0) {
            //Exponentielle positive
            //TODO: update when calculated is in exponent mode;
            pointPosition -= calculated
                .toString()
                .length;
            calculated *= Math.pow(2, exp);
            pointPosition += calculated
                .toString()
                .length;
        } else {
            //exponentielle négative
            exp = -exp; // passage en mode positif
            calculated *= Math.pow(5, exp);
            pointPosition -= exp;
        }

        calculated = calculated.toString();

        //Remove exponential notation
        let temp = calculated.split('.');
        calculated = "" + temp[0];
        if (temp[1]) {
            calculated += "" + temp[1].split('e')[0];
        }

        if (pointPosition < 0) {
            calculated = Array(-pointPosition + 1).join("0") + calculated;
            pointPosition = 1;
        }
        calculated = calculated.slice(0, pointPosition) + '.' + calculated.slice(pointPosition);

        //Display
        let signe = (this.sign
            ? '-'
            : '+');
        let result = signe;
        result += calculated;
        return result;
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