var IntegerTypes = Object.freeze({
    HALF: {
        size: 8,
        name: 'Byte - 8 bits'
    },
    SINGLE: {
        size: 16,
        name: 'Short - 16 bits'
    },
    DOUBLE: {
        size: 32,
        name: 'Int - 32 bits'
    },
    EXTENDED: {
        size: 64,
        name: 'Long - 64 bits'
    }
})

class IntegerType {

    constructor(value, type = IntegerTypes.DOUBLE) {
        this.size = type.size;
        console.log(type)
        console.log("size : " + this.size)
        this.value = [];

        if (value === undefined) {
            for (let i = 0; i < this.size; ++i) {
                this
                    .value
                    .push(true)
            }
        } else {
            //TODO Init value array
        }
        console.log(this.value)
    }

    toString() {
        console.log(this.value)
        let two = new BigNumber(2);
        let n = new BigNumber(0);
        let length = this.value.length;
        console.log(length)
        for (let i = 0; i < length; ++i) {
            n = n
                .times(two)
                .plus(this.value[i]
                    ? 1
                    : 0);
            console.log(this.value[i]
                ? 1
                : 0)
        }
        n = n.minus(two.pow(this.size - 1));
        console.log(n.toString());
        return n.toExponential(20);
    }

}