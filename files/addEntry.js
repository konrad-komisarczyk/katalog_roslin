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
            document.getElementById("container").value = entry.container;
            document.getElementById("height").value = entry.height;
            document.getElementById("description").value = entry.description;
            document.getElementById("highlighted").checked = entry.highlighted;
            document.getElementById("annual").checked = entry.annual;

            // TODO a co z uzupełnianiem pól typu file?
        } else {
            alert("Niepoprawny id wpisu!");
        }
    }
} else {
    alert("Niepoprawny id rośliny!");
}

function saveEntry() {
    if (id) {
        var i = parseInt(id);
        if (i < json.products.length) {
            var entries = json.products[i].entries;

            var date = document.getElementById("date").value;
            var priceIncrement = parseFloat(document.getElementById("price-increment").value);
            var description = document.getElementById("description").value.trim();
            var container = document.getElementById("container").value.trim();
            var height = document.getElementById("height").value;
            var highlighted = document.getElementById("highlighted").checked;
            var annual = document.getElementById("annual").checked;

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
                    entry.container = container;
                    entry.height = height;
                    entry.highlighted = highlighted;
                    entry.annual = annual;
                } else {
                    alert("Too big entry id.");
                }
            } else {
                var entry = {
                    date: date,
                    priceIncrement: priceIncrement,
                    description: description,
                    images: images,
                    container: container,
                    height: height,
                    highlighted: highlighted,
                    annual: annual
                };
                entries.push(entry);
            }


            if (!json.products[i].newestActualization || new Date(json.products[i].newestActualization) < new Date(date)) { //TODO DATE COMPARISON
                json.products[i].newestActualization = date
                if (height !== "") {
                    json.products[i].height = height;
                }
                if (container !== "") {
                    json.products[i].container = container;
                }
            }

            entries.sort(function(a, b) {
                if (a.highlighted && !b.highlighted) {
                    return -1;
                }
                if (b.highlighted && !a.highlighted) {
                    return 1;
                } else if (a.date > b.date) {
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
    } catch (e) {
        alert("Wystąpił błąd przy zapisywaniu!");
    }
}
