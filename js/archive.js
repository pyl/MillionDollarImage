const mainsect = document.querySelector("#mainsect");

window.onload = event => {
  const images = firebase.database().ref();

  images.orderByChild('price').on("value", snapshot => {
    const data = snapshot.val();
    renderDataAsHtml(data);
  });
};

// EACH HAVE imageURL, link, displayName, price
function renderDataAsHtml(data) {
    let images = ``;
    console.log(typeof(data));
    const keys = Object.keys(data).sort().reverse();
    for (const key of keys) {
        const image = data[key];
        console.log(image);
        images += createArchiveItem(image);
    }
    mainsect.innerHTML = images;
}

// Return an image object converted into HTML
const createArchiveItem = (image) => {
  let imageURL = image.imageURL;
  let displayName = image.displayName;
  let link = image.link;
  let price = image.price;

  const imageId = `${price} Dollar Image`;

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