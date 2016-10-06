$(document).ready(function() {
$(".element").typed({
    strings: [
        "Making a Strathmore based app ? ...",
        "Leverage the power of Cranium",
        "Get your data preformated in json",
        "Show us your support by starring the repo on github",
        "Thank you...",
        "and happy coding."
    ],
    typeSpeed: 5,
    backSpeed: 0,
    callback: function() {
        $("button.star").removeClass("noDisp");
    }
})

$('.custBut').click(function() {
    $('div.instructions').addClass('noDisp');
    $('.prog').show();
    var values = $('.selectpicker').val()
    var auth = {
      studentNumber: $('#studentNumber').val(),
      password: $('#password').val(),
      requests: values
    }

    $.post('/api/devGeneric', auth,  function(response) {
        if (typeof(response) !== 'undefined' && response !== '') {
            $("pre#dataSet").removeClass("noDisp");
            $("pre#dataSet").html(JSON.stringify(response, null, 2));
            $('.prog').hide();
        }
    });

});

});
