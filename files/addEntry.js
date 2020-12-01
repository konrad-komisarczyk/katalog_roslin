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
var entryId = url.searchParams.get("entryId");
if (id) {
    var i = parseInt(id);
    if (i < json.products.length) {
        document.getElementById('title').innerText = "Dodaj nowy wpis dla rośliny \"" + json.products[i].prodname + "\"";
    }
    document.getElementById('go-back').setAttribute("href", "../index.html?id=" + id);
    document.getElementById('hidden-id').value = id;

    if (entryId) {
        var ei = parseInt(entryId);
        if (i < json.products.length && ei < json.products[i].entries.length) {
            var entry = json.products[i].entries[ei];
            document.getElementById('title').innerText =
                "Edytuj wpis z dnia " + entry.date + " dla rośliny \"" + json.products[i].prodname +"\"";
            document.getElementById("date").value = entry.date;
            document.getElementById("price-increment").value = entry.priceIncrement;
            document.getElementById("description").value = entry.description;

            // TODO a co z uzupełnianiem pól typu file?
        } else {
            alert("Niepoprawny id rośliny lub wpisu! Zostaniesz przekierowany na stronę główną.");
            window.open("../index.html");
        }
    }
} else {
    alert("Niepoprawny id rośliny! Zostaniesz przekierowany na stronę główną.");
    window.open("../index.html");
}

function saveEntry() {
    if (id) {
        var i = parseInt(id);
        if (i < json.products.length) {
            var entries = json.products[i].entries;

            var date = document.getElementById("date").value;
            var priceIncrement = parseFloat(document.getElementById("price-increment").value);
            var description = document.getElementById("description").value.trim();

            var imagesField = document.getElementById("images");
            var images = [];
            for (j = 0; j < imagesField.files.length; j++) {
                images.push(imagesField.files[j].path);
            }

            if (entryId) {
                var ei = parseInt(entryId);
                if (ei < entries.length) {
                    var entry = entries[ei];
                    entry.date = date;
                    entry.priceIncrement = priceIncrement;
                    entry.description = description;
                    entry.images = images;
                } else {
                    alert("Too big entry id.");
                }
            } else {
                var entry = {
                    date: date,
                    priceIncrement: priceIncrement,
                    description: description,
                    images: images
                };
                entries.push(entry);
            }
            entries.sort(function(a, b) {
                if (a.date > b.date) {
                    return -1;
                } else if (a.date < b.date) {
                    return 1;
                } else {
                    return 0;
                }
            });

            saveJSON();
        } else {
            alert("Too big product id.")
        }
    }
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
