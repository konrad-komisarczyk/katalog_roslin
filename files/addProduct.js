const fs = require('fs');
try {
    let rawdata = fs.readFileSync('./files/database.json');
    var json = JSON.parse(rawdata);
} catch (e) {
    document.body.innerHTML = "Wystąpił krytyczny błąd. Zamknij aplikację.";
    alert("Wystąpił błąd we wczytywaniu bazy danych! Upewnij się, że plik \'database.json\' znajduje się w odpowiednim katalogu.");
}

var url = new URL(window.location.href);
var id = url.searchParams.get("id");
if (id) {
    document.getElementById('go-back').setAttribute("href", "../index.html?id=" + id);

    var i = parseInt(id);
    if (i < json.products.length) {
        var product = json.products[i];
        document.getElementById('page-title').innerText =
            "Edytuj roślinę (" + product.prodname + ")";

        document.getElementById("prodname").value = product.prodname;
        document.getElementById("species").value = product.species;
        document.getElementById("style").value = product.style;
        document.getElementById("initial-description").value = product.initialDescription;
    } else {
        alert("Nie ma drzewka o takim id! Zostanie dodane nowe drzewko.");
        id = null;
    }
}

function saveProduct() {
    var prodname = document.getElementById("prodname").value.trim();
    var species = document.getElementById("species").value.trim();
    var style = document.getElementById("style").value.trim();
    var initialDescription = document.getElementById("initial-description").value.trim();

    if (id) {
        var i = parseInt(id);
        if (i < json.products.length) {
            json.products[i].prodname = prodname;
            json.products[i].species = species;
            json.products[i].style = style;
            json.products[i].initialDescription = initialDescription;
        } else {
            alert("Too big product id.");
        }
    } else {
        var newProduct = {
            prodname: prodname,
            species: species,
            style: style,
            initialDescription: initialDescription,
            entries: []
        };
        json.products.push(newProduct);
    }

    saveJSON();
}

function saveJSON() {
    try {
        let data = JSON.stringify(json);
        fs.writeFileSync('./files/database.json', data);
    } catch (e) {
        alert("Wystąpił błąd przy zapisywaniu!");
    }
}
