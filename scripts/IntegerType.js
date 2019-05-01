/**
 *  Author: Bastien Wermeille
 *  Date: Février-Mars 2019
 *  Goal: Representation of a integer value
 */
var IntegerTypes = Object.freeze({
  HALF: {
    size: 8,
    name: "Byte - 8 bits"
  },
  SINGLE: {
    size: 16,
    name: "Short - 16 bits"
  },
  DOUBLE: {
    size: 32,
    name: "Int - 32 bits"
  },
  EXTENDED: {
    size: 64,
    name: "Long - 64 bits"
  }
});

class IntegerType {
  constructor(value, type = IntegerTypes.DOUBLE) {
    this.size = type.size;
    this.value = [];

    if (value === undefined) {
      for (let i = 0; i < this.size; ++i) {
        this.value.push(true);
      }
    } else {
      //Init integer value
      let n = new BigNumber(value).integerValue();

      let negative = false;
      if (n.isNegative()) {
        n = n.negated();
        negative = true;
      }
      for (let i = 0; i < this.size; ++i) {
        this.value.unshift(n.mod(2) == 1);
        n = n.minus(n.mod(2)).div(2);
      }

      //Complement to 2
      if (negative) {
        this.value = this._twoComplement(this.value);
      }
    }
  }

  _twoComplement(value) {
    //Inverse
    value = value.slice(0).map(e => !e);

    //Add 1
    let end = false;
    let i = value.length - 1;
    while (!end && i >= 0) {
      value[i] = !value[i];
      if (value[i]) {
        end = true;
      }
      --i;
    }
    return value;
  }

  toString() {
    let value = this.value.slice(0);
    let negative = false;

    if (value[0] === true) {
      //inverse 2 complement
      negative = true;
      value = this._twoComplement(this.value);
    }

    let two = new BigNumber(2);
    let n = new BigNumber(0);
    let length = value.length;

    for (let i = 0; i < length; ++i) {
      n = n.times(two).plus(value[i] ? 1 : 0);
    }

    if (negative) {
      n = n.negated();
    }

    return n.toString();
  }
}
