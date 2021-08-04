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

  let archiveItem = `<div class="columns is-mobile is-centered is-vcentered">
                        <div class="column">
                            <img src="${imageURL}" alt="${imageId}">
                        </div>
                        <div class="column has-text-left">
                            <span class="title">$${imageId}</span><br><br>
                            <span class="subtitle"><a href="${link}">${link}</a></span><br><br>
                            <span class="subtitle">by ${displayName}</span>
                        </div>
                    </div>`;
  return archiveItem;
};

function searchArchive() {
    let input = document.querySelector("#search").value;
    const images = firebase.database().ref("images");

    const searchOption = document.querySelector("#searchOption").value;

    if(searchOption == "displayName") {
        // input = input.toLowerCase();
        images.orderByChild("displayName").equalTo(input).on("child_added", (snap) => {
            console.log(snap.val());
            renderArchiveDataAsHtml(snap.val());
        });
    } else if(searchOption == "price") {
        if(input.substring(0, 1) == "$") {
            input = input.substring(1);
        }
        images.orderByChild("price").equalTo(input).on("child_added", (snap) => {
            console.log(snap.val());
            renderArchiveDataAsHtml(snap.val());
        });
    } else if(searchOption == "imageURL") {
        console.log(searchOption);
        images.orderByChild("imageURL").equalTo(input).on("child_added", (snap) => {
            console.log(snap.val());
            renderArchiveDataAsHtml(snap.val());
        });
    } else if(searchOption == "link") {
        console.log(searchOption);
        images.orderByChild("link").equalTo(input).on("child_added", (snap) => {
            console.log(snap.val());
            renderArchiveDataAsHtml(snap.val());
        });
    }
}

function renderArchiveDataAsHtml(data) {
    let images = ``;
    images += createArchiveItem(data);
    document.querySelector("#mainsect").innerHTML = images;
}