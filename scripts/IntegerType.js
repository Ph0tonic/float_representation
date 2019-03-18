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

            console.log(this.value)
            //Complement to 2
            if (negative){
                //Inverse
                this.value = this.value.map(e => !e);
                console.log(this.value)
                //Add 1
                let end = false;
                let i = this.value.length-1;
                console.log(i)
                while(!end && i >= 0) {
                    this.value[i] = !this.value[i];
                    if(this.value[i]){
                        end = true;
                    }
                    --i;
                }
            }
            console.log(this.value)
        }
    }

    toString() {
        let negative = false;

        //inverse 2 complement
        if (this.value[0] === true) {
            negative = true;

            //Inverse
            this.value = this.value.map(e => !e);
            
            //Add 1
            let end = false;
            let i = this.value.length-1;
            while(!end && i >= 0) {
                this.value[i] = !this.value[i];
                if(this.value[i]){
                    end = true;
                }
                --i;
            }
        }
        console.log(this.value)

        let two = new BigNumber(2);
        let n = new BigNumber(0);
        let length = this.value.length;
        
        for (let i = 0; i < length; ++i) {
            n = n.times(two).plus(this.value[i] ? 1 : 0);
        }
        
        if(negative){
            n = n.negated();
        }

        return n.toExponential(20);
    }
}