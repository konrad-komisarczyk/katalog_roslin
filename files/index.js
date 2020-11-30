let shell = require('electron').shell;
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

function displayProduct() {
    if (id) {
        var i = parseInt(id);
        if (i < json.products.length) {
            var product = json.products[i];
            var entries = product.entries;

            document.getElementById("product-name").innerText = product.prodname;
            if (product.species) {
                document.getElementById("product-species").innerText = product.species;
            }
            if (product.style) {
                document.getElementById("product-style").innerText = "Styl: " + product.style;
            }
            document.getElementById("product-initial-price").innerText = product.initialPrice;
            document.getElementById("product-initial-description").innerText = product.initialDescription;
            document.getElementById("product-remove").setAttribute("onclick", "removeProduct(" + i + ");");
            document.getElementById("product-edit").setAttribute("href", "./files/addProduct.html?id=" + id);

            var productSumPrice = Number(product.initialPrice);
            for (ei = 0; ei < entries.length; ei++) {
                productSumPrice += Number(entries[ei].priceIncrement);
            }
            document.getElementById("product-sum-price").innerText = productSumPrice;

            var entriesContainer = document.getElementById("entries");
            for (ei = 0; ei < entries.length; ei++) {
                var entryContainer = document.createElement("div");
                entryContainer.setAttribute("class", "entry");

                var entryDate = document.createElement("span");
                entryDate.setAttribute("class", "entry-date");
                entryDate.innerText = entries[ei].date;
                entryContainer.appendChild(entryDate);

                var entryDescription = document.createElement("div");
                entryDescription.setAttribute("class", "entry-description");
                entryDescription.innerText = entries[ei].description;
                entryContainer.appendChild(entryDescription);

                var imagesContainer = document.createElement("div");
                imagesContainer.setAttribute("class", "images-container");
                var images = entries[ei].images;
                for (j = 0; j < images.length; j++) {
                    var imageContainer = document.createElement("div");
                    imageContainer.setAttribute("class", "image-container");
                    if (images[j].toLowerCase().endsWith(".mp4")) {
                        var video = document.createElement("video");
                        video.src = images[j];
                        video.controls = true;
                        video.autoplay = false;
                        var source = document.createElement("source");
                        //source.setAttribute("src", images[j]);
                        //source.setAttribute("type", "video/mp4");
                        //video.appendChild(source);
                        imageContainer.appendChild(video);
                    } else {
                        var a = document.createElement("a");

                        a.setAttribute("onclick", 'shell.openExternal(' + '\"' + 'file://' + images[j] + '\"' + ');');
                        var img = document.createElement("img");
                        if (images[j].toLowerCase().endsWith(".jpg") || images[j].toLowerCase().endsWith(".jpeg") || images[j].toLowerCase().endsWith(".gif") ||
                            images[j].toLowerCase().endsWith(".png") || images[j].toLowerCase().endsWith(".bmp") || images[j].toLowerCase().endsWith(".tiff")) {
                            img.setAttribute("src", images[j]);
                            a.appendChild(img);
                            imageContainer.appendChild(a);
                        } else {
                            img.setAttribute("src", "./files/unknown_file.png");
                            img.setAttribute("class", "image-placeholder");
                            a.appendChild(img);
                            imageContainer.appendChild(a);
                            imageContainer.appendChild(document.createElement("br"));
                            var placeholderName = document.createElement("span");
                            placeholderName.setAttribute("class", "placeholder-text");
                            var name = images[j].split("/");
                            placeholderName.innerText = name[name.length - 1];
                            imageContainer.appendChild(placeholderName);
                        }
                    }
                    imagesContainer.appendChild(imageContainer);
                }
                entryContainer.appendChild(imagesContainer);


                var entryPriceIncrement = document.createElement("div");
                entryPriceIncrement.setAttribute("class", "entry-price-increment");
                entryPriceIncrement.innerText = "Wzrost ceny: " + entries[ei].priceIncrement + " zł";
                entryContainer.appendChild(entryPriceIncrement);

                var entryControl = document.createElement("div");
                entryControl.setAttribute("class", "entry-control control");
                var entryRemove = document.createElement("a");
                entryRemove.setAttribute("class", "entry-remove button-like");
                entryRemove.innerText = "Usuń ten wpis";
                entryRemove.setAttribute("href", "?id=" + id);
                entryRemove.setAttribute("onclick", "removeEntry(" + i + ", " + ei + ");");
                entryControl.appendChild(entryRemove);
                var entryEdit = document.createElement("a");
                entryEdit.setAttribute("class", "entry-edit button-like");
                entryEdit.innerText = "Edytuj ten wpis";
                entryEdit.setAttribute("href", "./files/addEntry.html?id=" + id +"&entryId=" + ei);
                entryControl.appendChild(entryEdit);
                entryContainer.appendChild(entryControl);

                entriesContainer.appendChild(entryContainer);
            }

            document.getElementById("add-entry").setAttribute("href", "files/addEntry.html?id=" + id);
        } else {
            alert("Too big product id.");
        }
    } else {
        document.getElementById("main").innerHTML =
            "<h1>Witaj w katalogu bonsai!</h1><br/>" +
            "<p>Wybierz jedno z drzewek z menu po lewej lub dodaj nowe.</p>"
    }
}
displayProduct();

function displayMenu() {
    var menu = document.getElementById("menu");
    for (i = 0; i < json.products.length; i++) {
        var link = document.createElement("a");
        link.setAttribute("href", "?id=" + i);
        link.innerText = json.products[i].prodname;
        menu.appendChild(link);
    }
}
displayMenu();

function removeProduct(i) {
    var conf = confirm("Czy na pewno chcesz usunąć drzewko?");
    if (conf === true) {
        json.products.splice(i, 1);
        saveJSON();
    }
}

function removeEntry(i, ei) {
    var conf = confirm("Czy na pewno chcesz usunąć wpis?");
    if (conf === true) {
        json.products[i].entries.splice(ei, 1);
        saveJSON();
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