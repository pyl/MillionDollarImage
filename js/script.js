const chatIcon = document.querySelector("#chatIcon");

const images = firebase.database().ref();
images.orderByChild('price').limitToLast(1).once("value", snapshot => {
    const data = snapshot.val();
    shareYourImage(data);
});

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

chatIcon.addEventListener("click", function() {
    const chatIconState = chatIcon.getAttribute("name");
    const chatIconImg = document.getElementById("chatIconImg");
    if (chatIconState === "closed") {
        chatIcon.setAttribute('name', 'opened');
        chatIconImg.src = 'images/closeChat.svg';
        document.getElementById("livechat").style.display = "block";
    } else {
        chatIcon.setAttribute('name', 'closed');
        chatIconImg.src = 'images/chat.svg';
        document.getElementById("livechat").style.display = "none";
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



// https://textboxwebsite.firebaseapp.com/
// live chat
var ref;
var username = "lol";

var firstmessage = 1;

function setup() {
  noCanvas();
var database = firebase.database();
ref = database.ref('text');
ref.on('value', gotData, errData);

document.getElementById("submitbutton").addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        if (document.getElementById('submitbutton').value != "") {
          if (firstmessage === 0) {
          buttonClick();
        } else if (firstmessage === 1) {
          firstButtonClick();
        }
      }
    }
});

}
function gotData(data) {
  document.getElementById("chat").innerHTML = "";
  var scores = data.val();
  var keys = Object.keys(scores)
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    var text = scores[k].typing;
    var timestamp = scores[k].date;
    var un = scores[k].nametag;
    displayText(text, timestamp, un);
  }
  //delete old data
  if (keys.length > 40) {
    ref.child(keys[0]).remove();
  }
}

const prng = s => (typeof s!=='undefined'&&((l=s%2147483647)<=0&&(l+=2147483646)),((l=l*16807%2147483647)-1)/2147483646);

function charToNumber (s, i) {
    return parseInt(s.charAt(i), 36) - 9;
}
function sumChars (s) {
    var i = s.length, r = 0;
    while (--i >= 0) r += charToNumber(s, i);
    return r;
}

function displayText(t, ts, u) {

    var li = createElement("li", ts.fontcolor('rgb(' + prng(sumChars(u))*255 + ',' + prng(sumChars(u))*255 + ',' + prng(sumChars(u))*255 + ')') + " " + u.fontcolor('rgb(' + prng(sumChars(u))*255 + ',' + prng(sumChars(u))*255 + ',' + prng(sumChars(u))*255 + ')') + ": " + linkify(t));
    li.style("font-size","20px");
    li.style("font-family","Arial");

    li.parent("chat");
    if (checkURL(t)) {
    var val = t,
                src = val,
                img = document.createElement('img');
                img.src = src;
                img.height = "250"
                img.width = "250"
                document.getElementById('chat').appendChild(img);

    }

}
function linkify(text) {
    var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(urlRegex, function(url) {
    return '<a href="' + url + '">' + url + '</a>';
    });
}

function checkURL(url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

function errData(err) {
  console.log("error")
  console.log(err)
}
function buttonClick() {
  var d = new Date().toLocaleString();
  var data = {
    typing: document.getElementById('submitbutton').value,
    date: d,
    nametag: username
  }
  ref.push(data);
  document.getElementById('submitbutton').value = "";
}
function firstButtonClick() {
  username = document.getElementById('submitbutton').value;
  firstmessage = 0;
  document.getElementById("submitbutton").setAttribute("placeholder", "Message");
  document.getElementById('submitbutton').value = "";
  var usernametext = createP("Username: " + username, 0, 100);
  usernametext.style('text-align', 'right');
  usernametext.style('font-size', '30');
}