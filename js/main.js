(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// const cleverbot = require("cleverbot-free");
// var m = require('mitsuku-api')();

// m.send('hello world')
//   .then(function(response){
//     console.log(response);
//   });

const chatIcon = document.querySelector("#chatIcon");

const images = firebase.database().ref("/images");
const chat = firebase.database().ref("/chat");

images.orderByChild('price').limitToLast(1).once("value", snapshot => {
    const data = snapshot.val();
    console.log(data)
    shareYourImage(data);
});



let h = Math.floor(window.innerHeight*.2);
console.log(h);
function shareYourImage(data) {
    var maxHeight = 500;
    var maxWidth = 500;
    const workingImage = data[Object.keys(data)[0]];
    const mainContainer = document.getElementById("mainContainer");
    console.log(data)
    let imageItem = `
            <h1 class="title is-1">Million Dollar Image</h1>
            <h3 class="title is-3">$<span style='color: #00d1b2'>${workingImage.price}</span></h1>
            <img id='milliondollarimage' style="height: ${h} !important; width: auto" src="${workingImage.imageURL}">
            <a
                href="${workingImage.link}"
                id="link">${workingImage.link}</a>
            <p class="subtitle" id="byDisplayName">by ${workingImage.displayName}</p>`;
    mainContainer.innerHTML = imageItem;
}
function addToDatabase() {
    const imgUrl = document.getElementById("imageURL").value;
    const link = document.getElementById("link").value;
    const displayName = document.getElementById("displayName").value;
    const price = document.getElementById("price").value;
    
    images.push({
        "displayName": displayName,
        "imageURL": imgUrl,
        "link": link,
        "price": price        
    });
    images.orderByChild('price').limitToLast(1).once("value", snapshot => {
            const data = snapshot.val();
            console.log(data)
            shareYourImage(data);
        });
}


//Create paypal button
paypal.Buttons({
    createOrder: function(data, actions) {
    // This function sets up the details of the transaction, including the amount and line item details.
    return actions.order.create({
        purchase_units: [{
        amount: {
            value: '0.01'
        }
        }]
    });
    },
    onApprove: function(data, actions) {
    // This function captures the funds from the transaction.
    return actions.order.capture().then(function(details) {
        //details.transID
        // This function shows a transaction success message to your buyer.
        alert('Transaction completed by ' + details.payer.name.given_name);
        console.log("payment successful");
        addToDatabase();
        images.orderByChild('price').limitToLast(1).once("value", snapshot => {
            const data = snapshot.val();
            console.log(data)
            shareYourImage(data);
        });
    });
    }
}).render('#paypal-button-container');
//This function displays Smart Payment Buttons on your web page.

// https://textboxwebsite.firebaseapp.com/
// live chat
var ref;
var username = "";
var message = "";
const visibleChat = document.getElementById("chat");
const chatDisplayName = document.getElementById('chatDisplayName');
const chatbox = document.getElementById("chatbox");

var database = firebase.database().ref("chat");
database.on('value', gotData, errData);

chatbox.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        if (chatDisplayName.value) username = chatDisplayName.value;
        if (chatbox.value) message = chatbox.value;
        var d = new Date().toLocaleString();
        var data = {
            typing: message,
            date: d,
            nametag: username
        }
        database.push(data);
        chatbox.value = "";
    }
});

function gotData(data) {
  visibleChat.innerHTML = "";
  var visibleChatLog = ``;
  var chatLog = data.val();
  var keys = Object.keys(chatLog)
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    var text = chatLog[k].typing;
    var timestamp = chatLog[k].date;
    var un = chatLog[k].nametag;
    // displayText(text, timestamp, un);
    visibleChatLog += makeChatMessage(text, timestamp, un);
  }
  visibleChat.innerHTML = visibleChatLog;
  //delete old data
  if (keys.length > 40) {
    database.child(keys[0]).remove();
  }
}

function makeChatMessage(text, timestamp, user) {
    var newElement = `<li class="wrapOverflow">
                        <font color="#485fc7">${timestamp}</font> 
                        <font color="#00d1b2">${user}</font>: ${text}
                    </li>`
    return newElement;
}

const prng = s => (typeof s!=='undefined'&&((l=s%2147483647)<=0&&(l+=2147483646)),((l=l*16807%2147483647)-1)/2147483646);

function errData(err) {
  console.log("error")
  console.log(err)
}

chatIcon.addEventListener("click", function() {
    const chatIconState = chatIcon.getAttribute("name");
    const chatIconImg = document.getElementById("chatIconImg");
    if (chatIconState === "closed") {
        chatIcon.setAttribute('name', 'opened');
        chatIconImg.src = 'images/closeChat.svg';

        document.getElementById("livechat").style.display = "inline";
    } else {
        chatIcon.setAttribute('name', 'closed');
        chatIconImg.src = 'images/chat.svg';
        document.getElementById("livechat").style.display = "none";
    }
});

// function talkToRose() {
//     var xhr = new XMLHttpRequest();
//     xhr.open("POST", 'https://ec2-54-215-197-164.us-west-1.compute.amazonaws.com/ui.php', true);
//     xhr.setRequestHeader('Content-Type', 'application/json');
//     xhr.send(JSON.stringify({
//         user: "hey",
//         message: "hey"
//     }));
//     console.log("here");
//     xhr.addEventListener("readystatechange", e => {
//     if (xhr.readyState === 4 && xhr.status === 200) {
//         let response = xhr.responseText;
//         // JSON.parse()
//         console.log(response);
//     }
//     console.log("now here");
//     }, false);
// }
// talkToRose();
},{}]},{},[1]);
