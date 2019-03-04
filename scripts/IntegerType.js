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
        this.value = [];

        if (value === undefined) {
            for (let i = 0; i < this.size; ++i) {
                this
                    .value
                    .push(true)
            }
        } else {
            //Init integer value
            let n = new BigNumber(value)
                .integerValue()
                .plus(new BigNumber(2).pow(this.size - 1));
                
            for (let i = 0; i < this.size; ++i) {
                this
                    .value
                    .unshift(n.mod(2) == 1);
                n = n
                    .minus(n.mod(2))
                    .div(2);
            }
        }
    }

    toString() {
        let two = new BigNumber(2);
        let n = new BigNumber(0);
        let length = this.value.length;
        
        for (let i = 0; i < length; ++i) {
            n = n
                .times(two)
                .plus(this.value[i]
                    ? 1
                    : 0);
        }
        
        n = n.minus(two.pow(this.size - 1));
        
        return n.toExponential(20);
    }
}