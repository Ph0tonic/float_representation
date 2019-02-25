
var IntegerTypes = Object.freeze({
  HALF:{exponent:5, mantissa:10, name:'Half - 16 bits'},
  SINGLE:{exponent:8, mantissa:23, name:'Single - 32 bits'},
  DOUBLE:{exponent:11, mantissa:52, name:'Double - 64 bits'},
  EXTENDED:{exponent:15, mantissa:64, name:'Extended - 80 bits'},
  QUAD:{exponent:15, mantissa:112, name:'Quad - 128 bits'}
})
  
class IntegerType{
  constructor(value, type = FloatingTypes.DOUBLE) {

  }
}