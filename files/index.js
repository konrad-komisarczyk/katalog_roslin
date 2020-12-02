let shell = require('electron').shell;
const fs = require('fs');

try {
    let rawdata = fs.readFileSync('./files/database.json');
    var json = JSON.parse(rawdata);

    var url = new URL(window.location.href);
    var id = url.searchParams.get("id");

    displayProduct();
    displayMenu();

} catch (e) {
    document.body.innerHTML = "Wystąpił krytyczny błąd. Zamknij aplikację.";
    alert("Wystąpił błąd we wczytywaniu bazy danych! Upewnij się, że plik \'database.json\' znajduje się w odpowiednim katalogu.");
}


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
            if (product.height) {
                document.getElementById("product-height").innerText = "Wysokość: " + product.height + " cm";
            }
            if (product.container) {
                document.getElementById("product-container").innerText = "Pojemnik: " + product.container;
            }
            document.getElementById("product-initial-description").innerText = product.initialDescription;
            document.getElementById("product-remove").setAttribute("onclick", "removeProduct(" + i + ");");
            document.getElementById("product-edit").setAttribute("href", "./files/addProduct.html?id=" + id);

            var productSumPrice = 0;
            for (ei = 0; ei < entries.length; ei++) {
                productSumPrice += Number(entries[ei].priceIncrement);
            }
            document.getElementById("product-sum-price").innerText = productSumPrice;



            var entriesContainer = document.getElementById("entries");
            for (ei = 0; ei < entries.length; ei++) {

                var entryContainer = document.createElement("div");
                entryContainer.setAttribute("class", "entry");
                if (entries[ei].highlighted) {
                    entryContainer.setAttribute("class", "entry highlited");
                }

                var entryHeaderContainer = document.createElement("div");
                entryHeaderContainer.setAttribute("class", "entry-header");

                var entryDate = document.createElement("span");
                entryDate.setAttribute("class", "entry-date");
                entryDate.innerText = entries[ei].date;
                entryHeaderContainer.appendChild(entryDate);

                var entryTitle = document.createElement("span");
                entryTitle.setAttribute("class", "entry-title");
                if (entries[ei].annual) {
                    entryTitle.innerText = "Całoroczna pielęgnacja " + entries[ei].date.split("-")[0];
                }
                if (entries[ei].highlighted) {
                    entryTitle.innerText = "Wpis początkowy";
                }
                entryHeaderContainer.appendChild(entryTitle);

                var entryPriceIncrement = document.createElement("span");
                entryPriceIncrement.setAttribute("class", "entry-price-increment");
                entryPriceIncrement.innerText = "Wzrost kosztu: " + entries[ei].priceIncrement + " zł";
                entryHeaderContainer.appendChild(entryPriceIncrement);

                entryContainer.appendChild(entryHeaderContainer);

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
            "<h1>Witaj w katalogu roślin!</h1><br/>" +
            "<p>Wybierz jedno z drzewek z menu po lewej stronie lub dodaj nowe.</p>"
    }
}

function displayMenu() {
    var menu = document.getElementById("menu");
    for (i = 0; i < json.products.length; i++) {
        var link = document.createElement("a");
        link.setAttribute("href", "?id=" + i);
        link.innerText = json.products[i].prodname;
        menu.appendChild(link);
    }
}

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
    } catch (e) {
        alert("Wystąpił błąd przy zapisywaniu!");
    }
}