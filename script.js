var float = 0;

$(document).ready(()=>{
  Object.keys(FloatingTypes).map((objectKey, index)=>{
    let type = FloatingTypes[objectKey];
    $("#number-type").append(new Option(type.name, objectKey));
  });
  
  $("#number-type").change(()=>{
    $('#entry-decimal').trigger('input');
  });
  
  $('#entry-decimal').on('input',()=>{
      float = new FloatingType($('#entry-decimal').val(), FloatingTypes[$("#number-type").val()]);

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

  setTimeout(() => {
    $('#entry-decimal').trigger('input');

    $('#binary').change('.input-binary', ()=>{
      //Getting entry data
      let float = new FloatingType(FloatingTypes[$("#number-type").val()]);
      float.sign = $('#s1').prop('checked');

      for(let i=0;i<float.e;i++){
        float.exponent[i] = $('#e'+i).prop('checked');
      }

      for(let i=0;i<float.m;i++){
        float.mantissa[i] = $('#m'+i).prop('checked');
      }

      $('#entry-decimal').val(float.toStr().toString());
    });
  }, 1);
});
