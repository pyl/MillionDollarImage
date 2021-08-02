const mainsect = document.querySelector("#mainsect");

window.onload = event => {
  const images = firebase.database().ref();

  images.on("value", snapshot => {
    const data = snapshot.val();
    renderDataAsHtml(data);
  });
};

// EACH HAVE imageURL, link, displayName, price
function renderDataAsHtml(data) {
    let images = ``;
    for (const index in data) {
        const image = data[index];
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