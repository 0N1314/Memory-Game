/*
 * Global Variables
 */
let time = 0;
let clockOff = true;
let clockId;
let moves = 0
let openCards = [];
let matchedCards = [];


/*
 * Create a list that holds all of your cards
 */
const icons = ["fa fa-diamond", "fa fa-paper-plane-o", "fa fa-anchor", "fa fa-bolt", "fa fa-cube", "fa fa-anchor", "fa fa-leaf", "fa fa-bicycle", "fa fa-diamond", "fa fa-bomb", "fa fa-leaf", "fa fa-bomb", "fa fa-bolt", "fa fa-bicycle", "fa fa-paper-plane-o", "fa fa-cube"];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
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
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

function gameStart() {
    displayTime();

    shuffle(icons);

    for (let i = 0; i < icons.length; i++) {
        const card = document.createElement("li");
        card.classList.add("card");
        card.innerHTML = `<i class = "${icons[i]}"></i>`;
        cardContainer.appendChild(card);

        //Card Click event
        card.addEventListener('click', function() {

            if (clockOff) {
                startClock();
                clockOff = false;
            }

            const currentCard = this;
            const previousCard = openCards[0];

            //We have an existing OPENED card
            if (openCards.length === 1 && !openCards.includes(currentCard)) {

                card.classList.add('open', 'show');
                openCards.push(currentCard);

                //We should compare our 2 opened allCards
                if (currentCard.innerHTML === previousCard.innerHTML) {

                    //Matched
                    currentCard.classList.add('match');
                    previousCard.classList.add('match');

                    matchedCards.push(currentCard, previousCard);

                    openCards = [];

                    isOver();

                } else {
                    setTimeout(function() {
                        currentCard.classList.remove('open', 'show');
                        previousCard.classList.remove('open', 'show');

                        openCards = [];

                    }, 500);

                    addMove();

                }

            } else if (openCards.length === 0) {
                //We don't have any opened cards
                card.classList.add('open', 'show');
                openCards.push(this);
            }
        });
    }
}

function displayTime() {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    if (seconds < 10) {
        timer.innerHTML = `${minutes}:0${seconds}`;
    } else {
        timer.innerHTML = `${minutes}:${seconds}`;
    }
}

function startClock() {
    clockId = setInterval(() => {
        time++;
        displayTime();
    }, 1000);
}

function isOver() {
    if (matchedCards.length === icons.length) {
        stopClock();
        showModal();
    }
}

function stopClock() {
    clearInterval(clockId);
}

const movesContainer = document.querySelector('.moves');
movesContainer.innerHTML = 0

function addMove() {
    moves++
    movesContainer.innerHTML = moves

    starsRating();
}

const rating = document.querySelector('.stars');
rating.innerHTML = `<span><i class="fa fa-star"></i></span><span><i class="fa fa-star"></i></span><span><i class="fa fa-star"></i></span>`;

function starsRating() {
    if (moves > 10 && moves <= 15) {
        rating.innerHTML = `<span><i class="fa fa-star"></i></span><span><i class="fa fa-star"></i></span>`;
    } else if (moves > 15) {
        rating.innerHTML = `<span><i class="fa fa-star"></i></span>`;
    } else {
        rating.innerHTML = `<span><i class="fa fa-star"></i></span><span><i class="fa fa-star"></i></span><span><i class="fa fa-star"></i></span>`
    }
}

const scorePanel = document.querySelector('.score-panel');
const timer = document.createElement('span');
timer.classList.add('clock');
scorePanel.appendChild(timer);

function gameReset() {

    clockOff = true;
    time = 0;
    clearInterval(clockId);
    cardContainer.innerHTML = '';
    matchedCards = [];
    moves = 0;
    movesContainer.innerHTML = moves;
    openCards = [];
    starsRating();

    gameStart();
}

const cardContainer = document.querySelector(".deck");

const restartBtn = document.querySelector('.restart');

restartBtn.addEventListener('click', function() {
    gameReset();
});

gameStart();

function showCard(card) {
    card.classList.add('open', 'show');
}

function addOpenCard(card) {
    openCards.push(card);
}

const modal = document.querySelector('.modal_background');

function showModal() {
    const stats = document.querySelector('.modal_stats');
    stats.innerHTML = `<span class = "modal_time">Time: ${timer.innerHTML}</span><span class = "modal_stars">Stars: ${rating.innerHTML}</span><span class = "modal_moves">Moves: ${movesContainer.innerHTML}</span>`;

    modal.classList.toggle('hide');
}

function hideModal() {
    modal.classList.add('hide');
}

const replay = document.querySelector('.modal_button.modal_replay');

replay.addEventListener('click', function() {
    hideModal();
    gameReset();
})

const cancel = document.querySelector('.modal_button.modal_cancel');

cancel.addEventListener('click', function() {
    hideModal();
})

const modalClose = document.querySelector('.modal_close');

modalClose.addEventListener('click', function() {
    hideModal();
})