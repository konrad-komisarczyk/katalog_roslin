const fs = require('fs');

try {
    let rawdata = fs.readFileSync('./files/database.json');
    var json = JSON.parse(rawdata);
} catch (e) {
    alert("Wystąpił błąd we wczytywaniu bazy danych! Zostaniesz przekierowany na stronę główną.");
    window.open("../index.html");
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
        document.getElementById("initial-price").value = product.initialPrice;
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
    var initialPrice = document.getElementById("initial-price").value;
    var initialDescription = document.getElementById("initial-description").value.trim();

    if (id) {
        var i = parseInt(id);
        if (i < json.products.length) {
            json.products[i].prodname = prodname;
            json.products[i].species = species;
            json.products[i].style = style;
            json.products[i].initialPrice = parseFloat(initialPrice);
            json.products[i].initialDescription = initialDescription;
        } else {
            alert("Too big product id.");
        }
    } else {
        var newProduct = {
            prodname: prodname,
            species: species,
            style: style,
            initialPrice: initialPrice,
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
        alert("Zapisano pomyślnie.");
    } catch (e) {
        alert("Wystąpił błąd przy zapisywaniu!");
    }
}
