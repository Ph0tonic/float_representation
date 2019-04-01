var float = 0;

$(document).ready(() => {
    //Initialise types combo
    Object.keys(IntegerTypes).map((objectKey, index) => {
        let type = IntegerTypes[objectKey];
        $("#whole-types").append(new Option(type.name, objectKey));
    });

    Object.keys(FloatingTypes).map((objectKey, index) => {
        let type = FloatingTypes[objectKey];
        $("#floating-types").append(new Option(type.name, objectKey));
    });

    //Connect event when editing input
    $("#whole-types").change(() => {
        $('#entry-whole').trigger('input');
    });

    $("#floating-types").change(() => {
        $('#entry-float').trigger('input');
    });

    $('#entry-whole').on('input', () => {
        integer = new IntegerType($('#entry-whole').val(), IntegerTypes[$("#whole-types").val()]);

        //Formulaire de binary to decimal
        let result = "";

        result += '<td class="main">';
        for (let i = 0; i < integer.size; ++i) {
            result += '<input class="input-binary" id="w_d' + i + '" type="checkbox" ' + (integer.value[i] ? "checked" : "") + '>\t';
        }
        result += '</td>';

        $('#binary-whole').html(result);
    });

    $('#entry-float').on('input', () => {
        float = new FloatingType($('#entry-float').val(), FloatingTypes[$("#floating-types").val()]);

        //Formulaire de binary to decimal
        let result = "";
        result += '<td class="sign"><input class="input-binary" id="f_s" type="checkbox" ' + (float.sign ? "checked" : "") + '></td>';

        result += '<td class="exponent">';
        for (let i = 0; i < float.e; ++i) {
            result += '<input class="input-binary" id="f_e' + i + '" type="checkbox" ' + (float.exponent[i] ? "checked" : "") + '>\t';
        }
        result += '</td>';

        result += '<td class="mantissa">';
        for (let i = 0; i < float.m; ++i) {
            result += '<input class="input-binary" id="f_m' + i + '" type="checkbox" ' + (float.mantissa[i] ? "checked" : "") + '>\t';
        }
        result += '</td>';

        $('#binary-float').html(result);
        $('#float-exp').html(float.dOffset());
    });

    setTimeout(() => {
        $('#entry-whole').trigger('input');
        $('#entry-float').trigger('input');

        $('#binary-whole').change('.input-float', () => {
            //Getting entry data
            let integer = new IntegerType(undefined, IntegerTypes[$("#whole-types").val()]);

            for (let i = 0; i < integer.size; i++) {
                integer.value[i] = $('#w_d' + i).prop('checked');
            }

            $('#entry-whole').val(integer.toString());
        });

        $('#binary-float').change('.input-float', () => {
            //Getting entry data
            let float = new FloatingType(undefined, FloatingTypes[$("#floating-types").val()]);
            float.sign = $('#f_s').prop('checked');

            for (let i = 0; i < float.e; i++) {
                float.exponent[i] = $('#f_e' + i).prop('checked');
            }

            for (let i = 0; i < float.m; i++) {
                float.mantissa[i] = $('#f_m' + i).prop('checked');
            }

            $('#entry-float').val(float.toString());
            $('#float-exp').html(float.dOffset());
        });

    }, 1);
});