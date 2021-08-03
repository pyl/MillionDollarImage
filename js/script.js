const chatIcon = document.querySelector("#chatIcon");

const images = firebase.database().ref();
images.orderByChild('price').limitToLast(1).once("value", snapshot => {
    const data = snapshot.val();
    shareYourImage(data);
});

chatIcon.addEventListener("click", function() {
    const chatIconState = chatIcon.getAttribute("name");
    const chatIconImg = document.getElementById("chatIconImg");
    if (chatIconState === "closed") {
        chatIcon.setAttribute('name', 'opened');
        chatIconImg.src = 'images/closeChat.svg';
    } else {
        chatIcon.setAttribute('name', 'closed');
        chatIconImg.src = 'images/chat.svg';
    }
});

//Create paypal button
paypal.Buttons({
    createOrder: function(data, actions) {
    // This function sets up the details of the transaction, including the amount and line item details.
    return actions.order.create({
        purchase_units: [{
        amount: {
            value: '1.00'
        }
        }]
    });
    },
    onApprove: function(data, actions) {
    // This function captures the funds from the transaction.
    return actions.order.capture().then(function(details) {
        // This function shows a transaction success message to your buyer.
        alert('Transaction completed by ' + details.payer.name.given_name);
        console.log("payment successful");
    });
    }
}).render('#paypal-button-container');
//This function displays Smart Payment Buttons on your web page.


function shareYourImage(data) {
    var maxHeight = 500;
    var maxWidth = 500;
    const workingImage = data[Object.keys(data)[0]];
    const mainContainer = document.getElementById("mainContainer");
    let imageItem = `
            <h1 class="title">Million Dollar Image</h1>
            <img id='milliondollarimage' src="${workingImage.imageURL}">
            <a
                href="${workingImage.link}"
                id="link">${workingImage.link}</a>
            <p class="subtitle" id="byDisplayName">by ${workingImage.displayName}</p>`;
    mainContainer.innerHTML = imageItem;
}

shareYourImage("https://www.paypalobjects.com/ppdevdocs/img/docs/checkout/pp-ecxo-integration-patterns.png");
//shareYourImage("https://www.w3schools.com/images/w3lynx_200.png");
function renderDataAsHTML() {
    document.querySelector("").innerHTML = image;
}

document.getElementById("livechat").style.display = "none";

function toggleLiveChat() {
    document.getElementById("livechat").style.display = "block";
}

function closeLiveChat() {
    document.getElementById("livechat").style.display = "none";
}
