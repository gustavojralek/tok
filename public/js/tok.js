var socket = io();


const enigma = {
    1: {id: "input_1", result: "soberano", item_selector: "g#Enigma_1 g path", el: "#e1"},
    2: {id: "input_2", result: "creacion", item_selector: "g#Arboles path", el: "#Arboles"},
    3: {id: "input_3", result: "necesidad", item_selector: "g#Rocks g path", el: "#Rocks"},
    4: {id: "input_4", result: "sacrificio", item_selector: "g#cueva path", el: "#cueva"},
    5: {id: "input_5", result: "ayuda", item_selector: "g#Mountains path", el: "#Mountains"},
    6: {id: "input_6", result: "", item_selector: "g#e2 path", el: "#e2"}

};



let readAndEmit = (enigma) => {
    socket.on('select', function (idd) {
        console.log("reading::select...");
        $('#modal-input_' + idd).modal('show');

    });
    socket.on('recalculando', function (azarId) {
        console.log("reading::recalculando...");
        loading(5000, null, "Recalculando...");
    });
    socket.on('message', function (data) {
        //console.log("reading... ", data);
        console.log("reading::message...");
        $('#' + data.id).val(data.value);
    });

    buttonClick(enigma);

    for (let prop in enigma) {

        let element = $('#' + enigma[prop].id);
        element.on('input', function () {
            let message = {"id": enigma[prop].id, "value": element.val()};
            //console.log('emit...', message);
            socket.emit('message', message);
            return false;
        });

        let enig = $(enigma[prop].el);
        let i = parseInt(prop);

        enig.css("cursor", "pointer");

        enig.on('click', function () {
            console.log("emit::select", (i+1));
            socket.emit('select', (i + 1));
        });

    }
};

let loading = (time, fn, text) => {
    $("#bruju-loading p ").html(text);
    $("#bruju-loading").fadeIn();
    setTimeout(function () {
        $("#bruju-loading").fadeOut();
        if (fn)
            fn();
    }, time);
};

let buttonClick = (enigma) => {
    socket.on('preset', function (id) {
        let i = parseInt(id);
        let data = enigma[i];

        console.log("reading::preset", data);

        let input = $('#' + data.id);

        if (!!input.val() && input.val().toLowerCase() === data.result) {
            console.log("Access Granted");

            $(".invalid-feedback").fadeOut();


            let m = $('#modal-' + data.id),
                item = $(data.item_selector);

            m.modal('hide');

            let searched = (i) => {

                if (i < 2) {
                    let arrow = "<i id=\"arrow\" class=\"fas fa-location-arrow arrow pepe\"></i>";
                    $('body').append(arrow);
                }

                let hearth = $(".hearth"),
                    left = hearth.first().position().left,
                    top = hearth.first().position().top;

                $("#arrow").css("top", top).css("left", left).addClass("arrow_" + i).removeClass("arrow_" + (i - 1));

                hearth.removeClass("hearth").addClass("visited");
                item.addClass("hearth");

            };

            loading(2000, searched(i), "Buscando...");


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


    let barco = $("#Barquito g path"),
        e1 = $('#modal-input_1'),
        brujumap = $('#brujumap');

    e1.modal('show');

    brujumap.on('click', function () {
        console.log("emit::recalculando...")
        socket.emit('recalculando', "azar1");

    });

    barco.addClass("hearth");


});


