var IntegerTypes = Object.freeze({
  HALF:{size:8, name:'Byte - 8 bits'},
  SINGLE:{size:8, name:'Short - 16 bits'},
  DOUBLE:{size:11, name:'Int - 32 bits'},
  EXTENDED:{size:15, name:'Long - 64 bits'}
})

class IntegerType{

  constructor(value, type = IntegerTypes.DOUBLE) {
    this.size = type.size;
    this.sign = [true];
    this.value = [true,true,true,true,true,true,false];
  }
}