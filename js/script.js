const chatIcon = document.querySelector("#chatIcon");

window.onload = event => {
  const images = firebase.database().ref();
  images.orderByChild('price').limitToLast(1).once("value", snapshot => {
    const data = snapshot.val();
    console.log(data);
    // renderDataAsHtml(data);
  });
};

chatIcon.addEventListener("click", function() {
    const chatIconState = chatIcon.getAttribute("name");
    if (chatIconState === "closed") {
        chatIcon.setAttribute('name', 'opened');
    } else {
        chatIcon.setAttribute('name', 'closed');
    }
});

function shareYourImage(imglink) {
    var maxHeight = 500;
    var maxWidth = 500;
    var image = document.getElementById("milliondollarimage");
    image.src = imglink;
    let link = document.querySelector("link");   
}

shareYourImage("https://www.paypalobjects.com/ppdevdocs/img/docs/checkout/pp-ecxo-integration-patterns.png");


function renderDataAsHTML(data) {
    document.querySelector("#mainContainer").innerHTML = image;
}

