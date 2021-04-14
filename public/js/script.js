
function copy_code() {

    var currentURL = window.location;
    var chars = currentURL.href.substr(-24);

    var dummy = document.createElement('input');
    document.body.appendChild(dummy);
    dummy.value = chars;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
    alert('Joining Code Copied Successfully');
}

function date_check() {
    var date = $("#attendance-date").val();
    date = new Date(date);

    var check = cls.dates.findIndex(function(val){var nwD = new Date(val); return date.getTime() === nwD.getTime()});
    if(check != -1) {
        $('#att-form-error').show();
        $('#att-form-body').hide();
        $('#att-form-submit').addClass('disabled');
    } else {
        $('#att-form-body').show();
        $('#att-form-error').hide();
        $('#att-form-submit').removeClass('disabled');
    }
}

console.log(students);