var socket = io();


const enigma = {
    1: {id: "input_1", result: "soberano", item_selector: "g#Enigma_1 g path", el: "#e1"},
    2: {id: "input_2", result: "pepe", item_selector: "g#e2 path", el: "#e2"},
    3: {id: "input_3", result: "ramon", item_selector: "g#Mountains path", el: "#mountains"}
};

let readAndEmit = (enigma) => {
    for (let prop in enigma) {

        socket.on('message', function (data) {
            //console.log("reading... ", data);

            $('#' + data.id).val(data.value);
        });

        let element = $('#' + enigma[prop].id);
        element.on('input', function () {

            let message = {"id": enigma[prop].id, "value": element.val()};

            //console.log('emit...', message);
            socket.emit('message', message);
            return false;
        });

    }
};

let loading = (time) => {
    $("#bruju-loading").fadeIn();
    setTimeout(function(){
        $("#bruju-loading").fadeOut();
    }, time);
};

let buttonClick = (enigma) => {
    socket.on('preset', function (id) {
        let i = parseInt(id);
        let data = enigma[i];

        console.log("reading... ", data);

        let input = $('#' + data.id);

        if (!!input.val() && input.val().toLowerCase() === data.result) {
            console.log("Access Granted");

            loading(5000);


            let m = $('#modal-' + data.id),
                item = $(data.item_selector);

            m.modal('hide');

            if(i < 2) {
                let arrow = "<i id=\"arrow\" class=\"fas fa-location-arrow arrow pepe\"></i>";
                $('body').append(arrow);
            }

            let hearth = $(".hearth"),

                left = hearth.first().position().left,
                top = hearth.first().position().top;

            $("#arrow").css("top", top).css("left", left).addClass("arrow_" + i).removeClass("arrow_" + (i-1));


            let element= $(data.el);
            element.css("cursor", "pointer");
            element.on('click', function () {
                console.log("click......");
                $('#modal-input_' + (i+1) ).modal('show');
            });

            hearth.removeClass("hearth").addClass("visited");

            item.addClass("hearth");



        }
        else {
            input.css("border-color", "red");
            $(".invalid-feedback").fadeIn();
            console.log("BAD Password");
        }

    });

    for (let e in enigma) {

        let modalElement = $('#modal-' + enigma[e].id);
        let button = modalElement.find("button");

        button.on("click", function () {
            console.log('emit::preset...', e);
            socket.emit('preset', e);
        });


    }
};


$(document).ready(function () {


    readAndEmit(enigma);

    buttonClick(enigma);


    let barco = $("#Barquito g path"),
        e1 = $('#modal-input_1'),
        brujumap = $('#brujumap');

    e1.modal('show');

    brujumap.on('click', function () {
        loading(5000);
    });

    barco.addClass("hearth");



});


