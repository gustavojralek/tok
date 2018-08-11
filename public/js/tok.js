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
            console.log('emit::input ', message);
            socket.emit('message', message);
            return false;
        });

        let enig = $(enigma[prop].el);
        let i = parseInt(prop);

        enig.css("cursor", "pointer");

        enig.on('click', function () {
            console.log("emit::select", (i + 1));
            socket.emit('select', (i + 1));
            return false;
        });


        let e = prop;
        let modalElement = $('#modal-' + enigma[e].id);
        let button = modalElement.find("button");

        button.on("click", function () {
            console.log('emit::preset...', e);
            socket.emit('preset', e);
            return false;
        });


    }

    $(enigma[5].el).on('click', function () {
        console.log('emit::preset::lastone', 6);
        socket.emit('preset', 6);
        return false;
    })
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

        if ((!!input.val() && input.val().toLowerCase() === data.result) || i === 6) {
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


};

let vers = () => {
    console.log("versiculos constructor");
    let versiculos = {
        1: {el: "v1", cita: "Salmos 46", word: "Soberano", ver: "Quédense quietos, reconozcan que yo soy DIOS"},
        2: {
            el: "v2",
            cita: "Filipenses 1:6",
            word: "Creación",
            ver: "Estoy convencido de esto: el que comenzó tan buena obra en ustedes, la irá perfeccionando hasta el día de Cristo Jesús"
        },
        3: {
            el: "v3",
            cita: "Proverbios 17:17",
            word: "Necesidad",
            ver: "En todo tiempo ama el amigo, y es como un hermano en tiempo de angustia"
        },
        4: {
            el: "v4",
            cita: "Juan 14:6",
            word: "Sacrificio",
            ver: "Yo soy el camino, y la verdad y la vida; nadie viene al Padre, sino por mí"
        },
        5: {
            el: "v5",
            cita: "Hechos 1:8",
            word: "Ayuda",
            ver: "Pero, cuando venga el Espíritu Santo sobre ustedes, recibirán poder y serán mis testigos... hasta los confines de la tierra"
        }
    };

    socket.on('versiculo', function (id) {
        let e = versiculos[id].el;
        console.log("reading::versiculo...");

        let m = $("#modal-" + e);
        m.find(".modal-body").html(versiculos[id].ver + "<i class=\"far fa-save saveVer\"></i>");
        m.modal('show');

        $(".saveVer").on('click', function () {
            socket.emit("vclose", e);
        });

    });

    socket.on('vclose', function (e) {
        $("#modal-" + e).modal('hide');
    });

    let versoClick = (id) => {
        let e = versiculos[id].el;
        $("#" + e).on("click", function () {
            console.log("click verso", e, "emit::versiculo");
            socket.emit("versiculo", id);
        })
    };

    versoClick(1);
    versoClick(2);
    versoClick(3);
    versoClick(4);
    versoClick(5);


};


$(document).ready(function () {


    readAndEmit(enigma);
    vers();


    let barco = $("#Barquito g path"),
        e1 = $('#modal-input_1'),
        brujumap = $('#brujumap');

    e1.modal('show');

    brujumap.on('click', function () {
        console.log("emit::recalculando...");
        socket.emit('recalculando', "azar1");
        return false;

    });

    barco.addClass("hearth");


});


