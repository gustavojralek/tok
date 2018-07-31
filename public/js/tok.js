var socket = io();

$('#modal-e1').modal('show');

const enigma = {
    1: {id: "e1", result: "soberano", coords: ""},
    2: {id: "e2", result: "pepe", coords: ""}
};

let readAndEmit = (enigma) => {
    for (let prop in enigma) {

        socket.on('message', function (data) {
            console.log("reading... ", data);

            $('#' + data.id).val(data.value);
        });

        let element = $('#' + enigma[prop].id);
        element.on('input', function () {

            let message = {"id": enigma[prop].id, "value": element.val()};

            console.log('emit...', message);
            socket.emit('message', message);
            return false;
        });

    }
};

let buttonClick = (enigma) => {
    for (let e in enigma) {

        let modalElement = $('#modal-' + enigma[e].id);
        let button = modalElement.find("button");
        let input = $('#' + enigma[e].id);

        button.on("click", function () {

            if (input.val().toLowerCase() === enigma[e].result) {
                console.log("Access Granted");
            }
            else {
                console.log("BAD Password");
            }
        });
    }
};

readAndEmit(enigma);

buttonClick(enigma);




