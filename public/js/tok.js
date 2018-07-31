var socket = io();

$('#passe1').modal('show');

const enigma = {
    1: {id: "#e1", result: "soberano"},
    2: {id: "#e2", result: "pepe"}
};


for (const prop in enigma) {


    socket.on('message', function (data) {
        console.log("reading... ", data);

        $(data.id).val(data.value);
    });

    let element = $(enigma[prop].id);
    element.on('input', function () {

        let message = {"id": enigma[prop].id, "value": element.val()};

        console.log('emit...', message);
        socket.emit('message', message);
        return false;
    });

}


let validateEnigma = (id) => {

    if (enigma[id].element.val().toLowerCase() !== enigma[id].result) {
        enigma[id].element.addClass("is-invalid");
    }

};


