let card = document.getElementsByClassName("card"); //Gives me an HTML Collection
let cards = [...card] //Convert th collection to an array
// Get the moves for each double click
let dualClicks = 0;
let counter = document.querySelector(".moves");
// The overlay div is modal for success
let modal = document.getElementById("overlay")
// When dualClick, then hold opencards for comparison
var openedCards = [];

/**
 * Initiate a timeTicker for the game
 */
var tenths=0, secs=0, mins=0, hrs=0;
var timeTicker=document.querySelector(".timeTicker");
var interval;
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
};
const ratings = document.querySelectorAll(".fa-star");
beginPlay();
// This helps to begin game 
function beginPlay() {
  // call the shuffle function
  cards = shuffle(cards);
  for (var i = 0; i < cards.length; i++) {
    cards[i].classList.remove("show", "open", "equal");
    document.getElementById("card-deck").appendChild(cards[i])
  }
  // Since we are starting game, we need to reset dual clicks and timeTicker
  dualClicks = 0;
  counter.innerHTML = dualClicks;
  for (var i = 0; i < ratings.length; i++) {
    ratings[i].style.color = "#DAA520";
    ratings[i].style.display = "block";
  }
  tenths=0; secs=0; mins=0; hrs=0;
  document.querySelector(".timeTicker").innerHTML = "00:00:00";;
  clearInterval(interval);
}
// Toggle class elements to open, show
var showCart = function() {
  this.classList.toggle("open");
  this.classList.toggle("show");
};
/** 
 * Add cards that are opened to OpenedCards array if cards are equal
 */
function cardOpen() {
  openedCards.push(this);
  if (openedCards.length === 2) {
    if (openedCards[0].getAttribute("data-ct") != openedCards[1].getAttribute("data-ct")) {
      true;
      countDualClicks();
      if (openedCards[0].getAttribute("data-ct").slice(0, openedCards[0].getAttribute("data-ct").indexOf("-")) === openedCards[1].getAttribute("data-ct").slice(0, openedCards[1].getAttribute("data-ct").indexOf("-"))) {
        equal();
      } else {
        notEqual();
      }
    } else {
      openedCards = [];
    }
  }
};
/**
 *  When the two clicked cards are equel
 */
function equal() {
  for (let k in openedCards) {
    openedCards[k].classList.add("equal");
    openedCards[k].classList.remove("show", "open");
  }
  openedCards = [];
}
/**
 *  When the two clicked cards are not equel
 */
function notEqual() {
  openedCards[0].classList.add("notEqual");
  openedCards[1].classList.add("notEqual");
  setTimeout(function() {
    openedCards[0].classList.remove("show", "open", "notEqual");
    openedCards[1].classList.remove("show", "open", "notEqual");
    openedCards = [];
  }, 300);
}
/**
 * Count player dual clicks to set ratings
 */
function countDualClicks() {
  dualClicks++;
  counter.innerHTML = dualClicks;
  //start timeTicker on first click
  if (dualClicks == 1) {
    secs = 0; mins = 0; hrs = 0;
    startTimeTicker();
  }
  // set ratings
  if ((dualClicks > 8 && dualClicks < 13) || mins >5) {
    for (x=0; x < 3; x++) {
      if (x> 1) {
        ratings[x].style.display = "none";
      }
    }
  } else if (dualClicks > 14 || mins > 10) {
    for (y = 0; y < 3; y++) {
      if (y > 0) {
        ratings[y].style.display = "none";
      }
    }
  }
}
/**
 * Function to calculate time taken
 */
function startTimeTicker() {
  interval = setInterval(function() {
    timeTicker.innerHTML = ((mins <= 9) ? "0" : '')+mins 
                      + ":" + ((secs <= 9) ? "0" : '')+secs 
                      + ":" + ((tenths <= 9) ? "0" : '')+tenths;
    tenths++;
    if(tenths == 10){
      secs++;
      tenths = 0;
    }
    if (secs == 60) {
      mins++;
      secs = 0;
    }
    if (mins == 60) {
      hrs++;
      mins = 0;
    }
  }, 100);
}
/**
 *  complete when all cards are equal, show modal and dualClicks, time and rating
 */
function complete() {
  if (document.getElementsByClassName("equal").length == 16) {
    document.getElementById("overlay").style.display = "block";
    finalTime = mins +"mins" + ":" + secs + "secs"
    clearInterval(interval);
    // show the congratulatory modal
    modal.classList.add("show");
    var starRating = document.querySelector(".ratings").innerHTML;
    //showing move, rating, time on modal
    document.getElementById("lastMove").innerHTML = dualClicks;
    document.getElementById("rating").innerHTML = starRating;
    document.getElementById("totalTime").innerHTML = finalTime;
    exitModal();
  };
}
/**
 * Cancel icon.
 * Once clicke on modal, closes the modal
 */
function exitModal() {
  document.querySelector(".close").addEventListener("click", function(e) {
    modal.style.display = "none";
    beginPlay();
  });
}
/**
 * Allows restart of the game
 */
function restart() {
  modal.classList.remove("show");
  modal.style.display = "none";
  beginPlay();
}
//add event listeners to each card by looping
for (var i = 0; i < card.length; i++) {
  card[i].addEventListener("click", showCart);
  card[i].addEventListener("click", cardOpen);
  card[i].addEventListener("click", complete);
};