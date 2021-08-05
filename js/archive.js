const mainsect = document.querySelector("#mainsect");

window.onload = event => {
  const images = firebase.database().ref("images");

  images.orderByChild('price').on("value", snapshot => {
    const data = snapshot.val();
    renderDataAsHtml(data);
  });
};

// EACH HAVE imageURL, link, displayName, price
function renderDataAsHtml(data) {
    let imgs = ``;
    const keys = Object.keys(data).sort().reverse();
    for (const key of keys) {
        const image = data[key];
        console.log(image);
        imgs += createArchiveItem(image);
    }
    mainsect.innerHTML = imgs;
}

// Return an image object converted into HTML
const createArchiveItem = (image) => {
  let imageURL = image.imageURL;
  let displayName = image.displayName;
  let link = image.link;
  let price = image.price;

  const imageId = `<span style='color: #00d1b2'>${price}</span> Dollar Image`;

  let archiveItem = `<div class="column is-one-quarter">
                        <img src="${imageURL}" alt="${imageId}">
                    </div>
                    <div class="column is-one-quarter has-text-left">
                        <span class="title">$${imageId}</span><br><br>
                        <span class="subtitle"><a href="${link}">${link}</a></span><br><br>
                        <span class="subtitle">by ${displayName}</span>
                    </div>`;
  return archiveItem;
};

// search archive
function searchArchive() {
    let input = document.querySelector("#search").value.toLowerCase(); // handles capitalization as long as all db entries lowercase
    const images = firebase.database().ref("images");
    const searchOption = document.querySelector("#searchOption").value;

    let items = ``;

    if(searchOption == "all") { // search all
        images.orderByChild("displayName").startAt(input).endAt(input + "\uf8ff").on("child_added", (snap) => { // returns all results that start w input keyword
            console.log(snap.val());
            items += createArchiveItem(snap.val());
        });

        images.orderByChild("link").startAt(input).endAt(input + "\uf8ff").on("child_added", (snap) => {
            console.log(snap.val());
            items += createArchiveItem(snap.val());
        });
        
        images.orderByChild("imageURL").startAt(input).endAt(input + "\uf8ff").on("child_added", (snap) => {
            console.log(snap.val());
            items += createArchiveItem(snap.val());
        });

        // handles $ for price
        if(input.substring(0, 1) == "$") {
            input = input.substring(1);
        }
        
        input = parseFloat(input);

        if(!isNaN(input)) {
            images.orderByChild("price").equalTo(input).on("child_added", (snap) => {
                console.log(snap.val());
                items += createArchiveItem(snap.val());
            });
        }        
    } else { // search individual dropdown option (display name, price, link, image url)
        if(searchOption == "price") {
            if(input.substring(0, 1) == "$") {
                input = input.substring(1);
            }

            input = parseFloat(input);

            images.orderByChild("price").equalTo(input).on("child_added", (snap) => {
                console.log(snap.val());
                items += createArchiveItem(snap.val());
            });
        } else {
            images.orderByChild(searchOption).startAt(input).endAt(input + "\uf8ff").on("child_added", (snap) => {
                console.log(snap.val());
                items += createArchiveItem(snap.val());
            });
        }
    }

    document.querySelector("#mainsect").innerHTML = items;
}
