(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// const cleverbot = require("cleverbot-free");
// var m = require('mitsuku-api')();

// m.send('hello world')
//   .then(function(response){
//     console.log(response);
//   });

const usernameBase = ["yasserx_", "wriosw", "alejandro_venegas250", "KrabbyBoii", "bfresh98", "Zorcutt", "OmegaPraetor",
    "IMPAAUL", "gamasthelazy", "DwayneRaven", "jackisjaded", "kohaku05290", "ravilishac", "levimattos",
    "Hellspawn932", "TrickyRose", "reganisit", "Popoye_222", "genshinimpactfan1", "oreorenzo", "StarOfElyon"];
const personalityForgeBotIds = ["2", "6", "16051", "136579", "149852"];
let personalityForgeUserToId = {"yasserx_": "2", "wriosw": "6", "alejandro_venegas250": "16051", 
    "KrabbyBoii": "136579", "bfresh98": "149852"};
let currentUserToId = [0, 1, 2, 3, 4];
let currentMessage = "hey, what's up";
const chatIcon = document.querySelector("#chatIcon");
const mainContainer = document.getElementById("mainContainer");

const images = firebase.database().ref("/images");
const chat = firebase.database().ref("/chat");

images.orderByChild('price').limitToLast(1).once("value", snapshot => {
    const data = snapshot.val();
    shareYourImage(data);
});

function generateRandomInteger(max) {
    return Math.floor(Math.random() * max);
}
function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

function switchUsernames() {
    for (user in personalityForgeUserToId) {
        let newUser = generateRandomInteger(21);
        if (!currentUserToId.includes(newUser)) {
            personalityForgeUserToId[usernameBase[newUser]] = personalityForgeUserToId[user];
            delete personalityForgeUserToId[user];
            currentUserToId.push(newUser);
        }
    }
    currentUserToId.splice(0, 5);
}
function callEveryHour() {
    setInterval(switchUsernames, 1000 * 60 * 60);
}
function botConversation() {
    talkToPersonalityForge(personalityForgeBotIds[generateRandomInteger(5)], currentMessage, "newPerson");
    console.log(currentMessage);
    talkToPersonalityForge(personalityForgeBotIds[generateRandomInteger(5)], currentMessage, "anotherPerson");
    console.log(currentMessage);
}
botConversation();
// send a message to the specified bot and receive a message in return
function testTalkToPersonalityForge(chatBotID, message, externalID) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", `https://www.personalityforge.com/api/chat/?apiKey=4ufxHcmAff8EL8q1&chatBotID=${chatBotID}&message=${message}&externalID=${externalID}`, true);
    xhr.send(null);
    (function wait() {
        if ( xhr.readyState === 4 && xhr.status === 200 ) {
            const chatBotUsername = getKeyByValue(personalityForgeUserToId, chatBotID);
            var d = new Date().toLocaleString();
            var data = {
                typing: JSON.parse(xhr.response)['message']['message'],
                date: d,
                nametag: chatBotUsername
            }
            database.push(data);
            return JSON.parse(xhr.response)['message']['message'];
        } else {
            setTimeout( wait, 100 );
        }
    })();
}





var nextDate = new Date();
if (nextDate.getMinutes() === 0) { // You can check for seconds here too
    callEveryHour();
} else {
    nextDate.setHours(nextDate.getHours() + 3);
    nextDate.setMinutes(0);
    nextDate.setSeconds(0);// I wouldn't do milliseconds too ;)

    var difference = nextDate - new Date();
    setTimeout(callEveryHour, difference);
}

let h = Math.floor(window.innerHeight*.2);
function shareYourImage(data) {
    var maxHeight = 500;
    var maxWidth = 500;
    const workingImage = data[Object.keys(data)[0]];
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
            shareYourImage(data);
        });
    });
    }
}).render('#paypal-button-container');
//This function displays Smart Payment Buttons on your web page.

// live chat
var ref;
var username = "";
var message = "";
const visibleChat = document.getElementById("chat");
const chatDisplayName = document.getElementById('chatDisplayName');
const chatbox = document.getElementById("chatbox");
const mentionPattern = /\B@[a-z0-9_-]+/gi;

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
        let mentions = message.match(mentionPattern);
        let mentioned = false;
        if (mentions) {
            for (mention of mentions) {
                if (mention.length > 1) {
                    let user = mention.substring(1);
                    if (personalityForgeUserToId.hasOwnProperty(user)) talkToPersonalityForge(personalityForgeUserToId[user], message, username);
                    mentioned = true;
                }
            }
        }
        if (!mentioned) talkToPersonalityForge(personalityForgeBotIds[generateRandomInteger(5)], message, username);
        chatbox.value = "";
    }
});

// send a message to the specified bot and receive a message in return
function talkToPersonalityForge(chatBotID, message, externalID) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", `https://www.personalityforge.com/api/chat/?apiKey=4ufxHcmAff8EL8q1&chatBotID=${chatBotID}&message=${message}&externalID=${externalID}`, true);
    xhr.send(null);
    (function wait() {
        if ( xhr.readyState === 4 && xhr.status === 200 ) {
            const chatBotUsername = getKeyByValue(personalityForgeUserToId, chatBotID);
            var d = new Date().toLocaleString();
            var data = {
                typing: JSON.parse(xhr.response)['message']['message'],
                date: d,
                nametag: chatBotUsername
            }
            database.push(data);
            currentMessage = JSON.parse(xhr.response)['message']['message'];
            return 0;
        } else {
            setTimeout( wait, 100 );
        }
    })();
}

// update the chat appearance
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
    visibleChatLog += makeChatMessage(text, timestamp, un);
  }
  visibleChat.innerHTML = visibleChatLog;
  // delete old data
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

function errData(err) {
  console.log("error")
  console.log(err)
}

// toggle chat open/close
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

},{}]},{},[1]);
