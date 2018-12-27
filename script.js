
$(document).ready(function(){
  //Ajout de la valeur de pi
  let estimatedPi = pi();
  $("#pi").html(estimatedPi.toStr());

  $('#entry-decimal').on('input',function(){
      let float = new FloatingType($('#entry-decimal').val());

      //Formulaire de binary to decimal
      let result = "";
      result += '<td class="sign"><input class="input-binary" id="s1" type="checkbox" '+(float.sign?"checked":"")+'></td>';

      result += '<td class="exponent">';
      for(let i=0;i<float.e;++i){
        result += '<input class="input-binary" id="e'+i+'" type="checkbox" '+(float.exponent[i]?"checked":"")+'>\t';
      }
      result += '</td>';

      result += '<td class="mantissa">';
      for(let i=0;i<float.m;++i){
        result += '<input class="input-binary" id="m'+i+'" type="checkbox" '+(float.mantissa[i]?"checked":"")+'>\t';
      }
      result += '</td>';

      $('#binary').html(result);
  });

  setTimeout(function(){
    $('#entry-decimal').trigger('input');

    $('#binary').change('.input-binary', function(){
      //Getting entry data
      let float = new FloatingType();
      float.sign = $('#s1').prop('checked');

      for(let i=0;i<float.e;i++){
        float.exponent[i] = $('#e'+i).prop('checked');
      }

      for(let i=0;i<float.m;i++){
        float.mantissa[i] = $('#m'+i).prop('checked');
      }

      $('#entry-decimal').val(float.toStr());
    });
  }, 1);

  //Actions des boutons bonus
  $('#btnAdd').on('click',function(){
    let a = new FloatingType($('#a1').val());
    let b = new FloatingType($('#b1').val());
    $('#addition').text(a.add(b).toStr());
  });

  $('#btnSub').on('click',function(){
    let a = new FloatingType($('#a2').val());
    let b = new FloatingType($('#b2').val());
    $('#substraction').text(a.sub(b).toStr());
  });

  $('#btnMult').on('click',function(){
    let a = new FloatingType($('#a3').val());
    let b = new FloatingType($('#b3').val());
    $('#multiplication').text(a.mult(b).toStr());
  });

  $('#btnDiv').on('click',function(){
    let a = new FloatingType($('#a4').val());
    let b = new FloatingType($('#b4').val());
    $('#division').text(a.divBy(b).toStr());
  });
});

function pi(){
  //    Somme de 0 à l'infini de ((4/(8n+1)-2/(8n+4)-1/(8n+5)-1/(8n+6))*(1/16)^n)
  // -> Somme de 0 à l'infini de ((4/(8n+1)-1/(4n+2)-1/(8n+5)-1/(8n+6))*(1/16)^n)
  let infiniTest = 200;
  let pi = new FloatingType(0);

  let two = new FloatingType(2);
  let four = new FloatingType(4);
  let oneSixteen = new FloatingType(1);

  for(let n=0;n<infiniTest;++n){
    pi = pi.add(four.divBy(new FloatingType(8*n+1)).sub(FloatingType.oneBy(4*n+2)).sub(FloatingType.oneBy(8*n+5)).sub(FloatingType.oneBy(8*n+6)).mult(oneSixteen));
    oneSixteen = oneSixteen.mult(FloatingType.oneBy(16));
  }
  return pi;
}

//TODO: Supprimer, valeurs pour tests
let a = new FloatingType('11');
let b = new FloatingType('-1.125');
let c = new FloatingType('1.875')
let d = new FloatingType('91.34375');
let e = new FloatingType('0.14453125')
