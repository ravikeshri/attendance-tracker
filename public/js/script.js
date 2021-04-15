// to copy joining code
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

// to validate if attendance is not taken on this date
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

// to generate attendance report
$('#report').on('submit', function(e) {
    e.preventDefault();
    var x = $(this).serializeArray();
    var from = new Date(x[0].value);
    var to = new Date(x[1].value);
    
    // if dates are valid
    if(!from.getTime() || !to.getTime() || from.getTime() > to.getTime()) {
        $('#report-error').show();
    } else {
        $('#report-error').hide();
        
        var report = `
            <table class="table">
            <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Registration No.</th>
                <th scope="col">Name</th>
                <th scope="col">Percentage</th>
        `;
        cls.dates.sort(function(a,b) {
            var x = new Date(a);
            var y = new Date(b);
            return x.getTime() - y.getTime();
        });
        cls.dates.forEach(date => {
            var d = new Date(date);
            if(from.getTime() <= d.getTime() && d.getTime() <= to.getTime()) {
                d = d.toLocaleDateString();
                report += `<th scope="col">${d}</th>`;
            }
        });
        report += `</tr></thead><tbody>`;

        var count = 1;
        students.forEach(function(student) {
            report += `
            <tr>
                <th scope="row">${count}</th>
                <td>${student.regd}</td>
                <td>${student.name}</td>
                <td>${student.percentage.toFixed(2)}</td>
            `;
            
            cls.dates.forEach(date => {
                var d = new Date(date);
                if(from.getTime() <= d.getTime() && d.getTime() <= to.getTime()) {
                    var check = student.attendance.findIndex(function(val){return val == date});
                    if(check != -1) {
                        report += `<td>P</td>`;
                    } else {
                        report += `<td>A</td>`;
                    }
                }
            });

            report += `</tr>`;
            count++;
        });

        report += `</tbody></table>`;
        console.log(report);

        $('body').html(report);
        $('body').css({'background-color': 'white', 'color': 'black'});
    }
});
