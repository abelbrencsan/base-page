/**
 * Memory game
 * This class is designed to create memory card games.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class MemoryGame {

	/**
	 * Represents the wrapper element that that contains the elements of the game.
	 * 
	 * @type {HTMLElement}
	 */
	wrapper;

	/**
	 * Represents the list element that includes the cards.
	 * 
	 * @type {HTMLUListElement}
	 */
	cardList;

	/**
	 * List of cards to be paired.
	 * 
	 * @type {Array<MemoryGameCard>}
	 */
	cards;

	/**
	 * Represents the trigger button that restarts the memory game when clicked.
	 * 
	 * @type {HTMLButtonElement|null}
	 */
	restartTrigger = null;

	/**
	 * Represents an element where the current number of found pairs is displayed.
	 * 
	 * @type {HTMLElement|null}
	 */
	scoreIndicator = null;

	/**
	 * Represents an element where the current number of card flips is displayed.
	 * 
	 * @type {HTMLElement|null}
	 */
	moveCountIndicator = null;

	/**
	 * Represents an element where the elapsed seconds is displayed since the first flip.
	 * 
	 * @type {HTMLElement|null}
	 */
	timerIndicator = null;

	/**
	 * The delay in milliseconds after the cards are flipped back when they are mismatched.
	 * 
	 * @type {number}
	 */
	flipCardBackDelay = 1000;

	/**
	 * The time limit in seconds after the game completes.
	 * 
	 * @type {number}
	 */
	timeLimit = 0;

	/**
	 * The class that is added to the card trigger while it is flipped.
	 * 
	 * @type {string}
	 */
	isCardFlippedClass = "is-flipped";

	/**
	 * The class that is added to the card trigger when it is paired with the other selected card.
	 * 
	 * @type {string}
	 */
	isCardPairedClass = "is-paired";

	/**
	 * The class that is added to the card trigger when it is mismatched with the other selected card.
	 * 
	 * @type {string}
	 */
	isCardMismatchedClass = "is-mismatched";

	/**
	 * The class that is added to the wrapper while a card is being flipped.
	 * 
	 * @type {string}
	 */
	hasFlippingCardClass = "has-flipping-card";

	/**
	 * The class that is added to the wrapper when all card pairs have been found.
	 * 
	 * @type {string}
	 */
	isCompletedClass = "is-completed";

	/**
	 * Callback function that is called after the memory game has been initialized.
	 * 
	 * @type {function():void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called after a card has been flipped.
	 * 
	 * @type {function(MemoryGameCard):void|null}
	 */
	cardFlipCallback = null;

	/**
	 * Callback function that is called after the two cards have been matched.
	 * 
	 * @type {function(MemoryGameCard, MemoryGameCard, boolean):void|null}
	 */
	cardMatchCallback = null;

	/**
	 * Callback function that is called after the two cards have been mismatched.
	 * 
	 * @type {function(MemoryGameCard, MemoryGameCard):void|null}
	 */
	cardMismatchCallback = null;

	/**
	 * Callback function that is called after all the cards have been matched with their pairs.
	 * 
	 * @type {function(number, number, number):void|null}
	 */
	completeCallback = null;

	/**
	 * Callback function that is called after the memory game has been restarted.
	 * 
	 * @type {function():void|null}
	 */
	restartCallback = null;

	/**
	 * Callback function that is called after the memory game has been destroyed.
	 * 
	 * @type {function():void|null}
	 */
	destroyCallback = null;

	/**
	 * The current number of found pairs.
	 * 
	 * @type {number}
	 */
	score = 0;

	/**
	 * The current number of card flips.
	 * 
	 * @type {number}
	 */
	moveCount = 0;

	/**
	 * The elapsed seconds since the first flip.
	 * 
	 * @type {number}
	 */
	timer = 0;

	/**
	 * The flipped card that is being attempted to be paired with another card after it is flipped.
	 * 
	 * @type {MemoryGameCard|null}
	 */
	flippedCard = null;

	/**
	 * Indicates whether the flipping is disabled.
	 * 
	 * @type {boolean}
	 */
	hasFlippingCard = false;

	/**
	 * The ID of the interval created to count the elapsed seconds since the first flip.
	 * 
	 * @type {number|null}
	 */
	intervalId = null;

	/**
	 * Creates a memory game.
	 * 
	 * @param {Object} options
	 * @param {HTMLElement} options.wrapper
	 * @param {HTMLUListElement} options.cardList
	 * @param {Array<MemoryGameCard>} options.cards
	 * @param {HTMLButtonElement|null} options.restartTrigger
	 * @param {HTMLElement|null} options.scoreIndicator
	 * @param {HTMLElement|null} options.moveCountIndicator
	 * @param {HTMLElement|null} options.timerIndicator
	 * @param {number} options.flipCardBackDelay
	 * @param {number} options.timeLimit
	 * @param {string} options.isCardFlippedClass
	 * @param {string} options.isCardPairedClass
	 * @param {string} options.isCardMismatchedClass
	 * @param {string} options.hasFlippingCardClass
	 * @param {string} options.isCompletedClass
	 * @param {function():void} options.initCallback
	 * @param {function(MemoryGameCard):void} options.cardFlipCallback
	 * @param {function(MemoryGameCard, MemoryGameCard, boolean):void} options.cardMatchCallback
	 * @param {function(MemoryGameCard, MemoryGameCard):void} options.cardMismatchCallback
	 * @param {function(number, number, number):void} options.completeCallback
	 * @param {function():void} options.restartCallback
	 * @param {function():void} options.destroyCallback
	 * @returns {MemoryGame}
	 */
	constructor(options) {

		// Test required options
		if (!(options.wrapper instanceof HTMLElement)) {
			throw "Memory game \"wrapper\" must be an `HTMLElement`";
		}
		if (!(options.cardList instanceof HTMLUListElement)) {
			throw "Memory game \"cardList\" must be an `HTMLUListElement`";
		}
		if (!(options.cards instanceof Array)) {
			throw 'Memory game \"cards\" must be an `array`';
		}
		if (options.cards.length == 0) {
			throw 'Memory game \"cards\" must include at least one card';
		}
		options.cards.forEach((card, index) => {
			if (!(card instanceof MemoryGameCard)) {
				throw 'Memory game card must be a `MemoryGameCard`';
			}
		});

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}

		// Initialize the memory game
		this.handleEvent = (event) => this.#handleEvents(event);
		this.#addEvents();
		this.shuffleCards();
		this.#updateIndicators();
		if (typeof(this.initCallback) == "function") this.initCallback();
	}

	/**
	 * Flips the spcified card.
	 * 
	 * @param {MemoryGameCard} card
	 * @returns {void}
	 */
	flipCard(card) {
		if (card.trigger.classList.contains(this.isCardFlippedClass)) return;
		if (this.flippedCard == card) return; 
		if (this.hasFlippingCard) return;
		this.#applyCardAsFlipped(card);
		this.#startTimer();
		if (this.flippedCard === null) {
			this.#selectFirstCard(card);
		} else {
			this.#incrementMoveCount();
			this.#matchCards(this.flippedCard, card);
			this.flippedCard = null;
		}
	}

	/**
	 * Resets the current state of the memory game and starts a new one.
	 * 
	 * @returns {void}
	 */
	restart() {
		this.reset();
		this.shuffleCards();
		if (typeof(this.restartCallback) == "function") this.restartCallback();
	}

	/**
	 * Resets the current state of the memory game.
	 * 
	 * @returns {void}
	 */
	reset() {
		this.#resetState();
		this.#resetCards(false);
	}

	/**
	 * Shuffles the cards.
	 * 
	 * @returns {void}
	 */
	shuffleCards() {
		let cardListChildren = this.#getShuffledElems(this.cardList.children);
		this.cardList.innerHTML = "";
		cardListChildren.forEach((cardListChild) => {
			this.cardList.appendChild(cardListChild);
		});
	}

	/**
	 * Destroys the memory game.
	 * 
	 * @returns {void}
	 */
	destroy() {
		this.reset();
		this.#destroyCards();
		this.#removeEvents();
		if (typeof(this.destroyCallback) == "function") this.destroyCallback();
	}

	/**
	 * Indicates whether the game is completed.
	 * 
	 * @returns {boolean}
	 */
	get isCompleted() {
		return this.score >= this.cards.length / 2;
	}

	/**
	 * Selects the specified card as the card to be compared with the next selected card.
	 * 
	 * @param {MemoryGameCard} card
	 * @returns {void}
	 */
	#selectFirstCard(card) {
		this.flippedCard = card;
	}

	/**
	 * Detects whether the two specified cards match; pairs them if they do, and mismatches them if they do not.
	 * 
	 * @param {MemoryGameCard} firstCard
	 * @param {MemoryGameCard} secondCard
	 * @returns {void}
	 */
	#matchCards(firstCard, secondCard) {
		if (firstCard.id == secondCard.id) {
			this.#pairCards(firstCard, secondCard);
		} else {
			this.#mismatchCards(firstCard, secondCard);
		}
	}

	/**
	 * Pairs the two specified cards.
	 * 
	 * @param {MemoryGameCard} firstCard
	 * @param {MemoryGameCard} secondCard
	 * @returns {void}
	 */
	#pairCards(firstCard, secondCard) {
		this.#applyCardAsPaired(firstCard);
		this.#applyCardAsPaired(secondCard);
		this.#incrementScore();
		if (typeof(this.cardMatchCallback) == "function") this.cardMatchCallback(firstCard, secondCard, this.isCompleted);
		if (this.isCompleted)this.#complete();
	}

	/**
	 * Completes the memory game.
	 * 
	 * @returns {void}
	 */
	#complete() {
		this.wrapper.classList.add(this.isCompletedClass);
		this.#stopTimer();
		if (typeof(this.completeCallback) == "function") this.completeCallback(this.score, this.moveCount, this.timer);
	}

	/**
	 * The two specified cards mismatches.
	 * 
	 * @param {MemoryGameCard} firstCard
	 * @param {MemoryGameCard} secondCard
	 * @returns {void}
	 */
	#mismatchCards(firstCard, secondCard) {
		this.#applyCardAsMismatched(firstCard);
		this.#applyCardAsMismatched(secondCard);
		this.hasFlippingCard = true;
		this.wrapper.classList.add(this.hasFlippingCardClass);
		this.cards.forEach((card) => {
			card.trigger.setAttribute("disabled", "disabled");
		});
		setTimeout(() => {
			this.#resetCards(true);
		}, this.flipCardBackDelay);
		if (typeof(this.cardMismatchCallback) == "function") this.cardMismatchCallback(firstCard, secondCard);
	}

	/**
	 * Applies the specified card as flipped.
	 * 
	 * @param {MemoryGameCard} card
	 * @returns {void}
	 */
	#applyCardAsFlipped(card) {
		card.trigger.classList.add(this.isCardFlippedClass);
		card.trigger.setAttribute("disabled", "disabled");
		if (typeof(this.cardFlipCallback) == "function") this.cardFlipCallback(card);
	}

	/**
	 * Applies the specified card as paired.
	 * 
	 * @param {MemoryGameCard} card
	 * @returns {void}
	 */
	#applyCardAsPaired(card) {
		card.trigger.classList.add(this.isCardPairedClass);
	}

	/**
	 * Applies the specified card as mismatched.
	 * 
	 * @param {MemoryGameCard} card
	 * @returns {void}
	 */
	#applyCardAsMismatched(card) {
		card.trigger.classList.add(this.isCardMismatchedClass);
	}

	/**
	 * Starts the timer.
	 * 
	 * @returns {void}
	 */
	#startTimer() {
		if (this.intervalId) return;
		this.intervalId = setInterval(() => {
			if (this.timeLimit && this.timeLimit <= this.timer + 1) {
				this.#complete();
			} else {
				this.timer++;
				this.#updateTimerIndicator();
			}
		}, 1000);
	}

	/**
	 * Stops the timer.
	 * 
	 * @returns {void}
	 */
	#stopTimer() {
		if (!this.intervalId) return;
		clearInterval(this.intervalId);
		this.intervalId = null;
	}

	/**
	 * Increments the number of card flips by one.
	 * 
	 * @returns {void}
	 */
	#incrementMoveCount() {
		this.moveCount++;
		this.#updateMoveCountIndicator();
	}

	/**
	 * Increments the number of found pairs by one.
	 * 
	 * @returns {void}
	 */
	#incrementScore() {
		this.score++;
		this.#updateScoreIndicator();
	}

	/**
	 * Resets the current state of the game.
	 * 
	 * @returns {void}
	 */
	#resetState() {
		this.wrapper.classList.remove(this.isCompletedClass);
		this.score = 0;
		this.moveCount = 0;
		this.timer = 0;
		this.flippedCard = null;
		this.#stopTimer();
		this.#updateIndicators();
	}

	/**
	 * Resets the cards added to the game.
	 * 
	 * @param {boolean} keepPaired
	 * @returns {void}
	 */
	#resetCards(keepPaired) {
		this.wrapper.classList.remove(this.hasFlippingCardClass);
		this.hasFlippingCard = false;
		this.cards.forEach((card) => {
			card.trigger.classList.remove(this.isCardFlippedClass);
			card.trigger.classList.remove(this.isCardMismatchedClass);
			if (!keepPaired) {
				card.trigger.classList.remove(this.isCardPairedClass);
				card.trigger.removeAttribute("disabled");
			} else if (!card.trigger.classList.contains(this.isCardPairedClass)) {
				card.trigger.removeAttribute("disabled");
			}
		});
	}

	/**
	 * Retrieves the specified elements in a random order.
	 * 
	 * @param {Array<HTMLLIElement>} elems
	 * @returns {Array<HTMLLIElement>}
	 */
	#getShuffledElems(elems) {
		return Array.from(elems)
			.map(value => ({ value, sort: Math.random() }))
			.sort((a, b) => a.sort - b.sort)
			.map(({ value }) => value);
	}

	/**
	 * Updates the indicators.
	 * 
	 * @returns {void}
	 */
	#updateIndicators() {
		this.#updateScoreIndicator();
		this.#updateMoveCountIndicator();
		this.#updateTimerIndicator();
	}

	/**
	 * Displays the current number of found pairs within the score indicator.
	 * 
	 * @returns {void}
	 */
	#updateScoreIndicator() {
		if (!this.scoreIndicator) return;
		this.scoreIndicator.innerHTML = this.score;
	}

	/**
	 * Displays the current number of flips within the move count indicator.
	 * 
	 * @returns {void}
	 */
	#updateMoveCountIndicator() {
		if (!this.moveCountIndicator) return;
		this.moveCountIndicator.innerHTML = this.moveCount;
	}

	/**
	 * Displays the elapsed seconds since the first flip within the timer indicator.
	 * 
	 * @returns {void}
	 */
	#updateTimerIndicator() {
		if (!this.timerIndicator) return;
		this.timerIndicator.innerHTML = this.timer;
	}

	/**
	 * Destroys the cards added to the game.
	 * 
	 * @returns {void}
	 */
	#destroyCards() {
		this.cards.forEach((card) => {
			card.destroy();
		});
	}

	/**
	 * Adds event listeners related to the memory game.
	 * 
	 * @returns {void}
	 */
	#addEvents() {
		this.cards.forEach((card) => {
			card.trigger.addEventListener("click", this);
		});
		if (this.restartTrigger) {
			this.restartTrigger.addEventListener("click", this);
		}
	}

	/**
	 * Removes event listeners related to the memory game.
	 * 
	 * @returns {void}
	 */
	#removeEvents() {
		this.cards.forEach((card) => {
			card.trigger.removeEventListener("click", this);
		});
		if (this.restartTrigger) {
			this.restartTrigger.removeEventListener("click", this);
		}
	}

	/**
	 * Handles events.
	 * 
	 * @param {Event} event
	 * @returns {void}
	 */
	#handleEvents(event) {
		switch (event.type) {
			case "click":
				this.cards.forEach((card) => {
					if (card.trigger.contains(event.target)) {
						this.flipCard(card);
					}
				});
				if (this.restartTrigger && this.restartTrigger == event.target) {
					this.restart();
				}
				break;
		}
	}
}

/**
 * Memory game card
 * This class is designed to create a card within a memory game.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class MemoryGameCard {

	/**
	 * The id of the memory game card.
	 * 
	 * @type {string}
	 */
	id;

	/**
	 * Represents the trigger button that flips the card when clicked.
	 * 
	 * @type {HTMLButtonElement}
	 */
	trigger;

	/**
	 * Represents the front view of the card, which is displayed when it is flipped.
	 * 
	 * @type {HTMLElement}
	 */
	frontView;

	/**
	 * Represents the back view of the card, which is displayed when it is not flipped.
	 * 
	 * @type {HTMLElement}
	 */
	backView;

	/**
	 * Callback function that is called after the memory game card has been initialized.
	 * 
	 * @type {function():void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called after the memory game card has been destroyed.
	 * 
	 * @type {function():void|null}
	 */
	destroyCallback = null;

	/**
	 * Creates a memory game card.
	 * 
	 * @param {Object} options
	 * @param {string} options.id
	 * @param {HTMLButtonElement} options.trigger
	 * @param {HTMLElement} options.frontView
	 * @param {HTMLElement} options.backView
	 * @param {function():void} options.initCallback
	 * @param {function():void} options.destroyCallback
	 * @returns {MemoryGameCard}
	 */
	constructor(options) {

		// Test required options
		if (typeof options.id !== "string") {
			throw "Memory game card \"id\" must be a string";
		}
		if (!(options.trigger instanceof HTMLButtonElement)) {
			throw "Memory game card \"trigger\" must be an `HTMLButtonElement`";
		}
		if (!(options.frontView instanceof HTMLElement)) {
			throw "Memory game card \"frontView\" must be an `HTMLElement`";
		}
		if (!(options.backView instanceof HTMLElement)) {
			throw "Memory game card \"backView\" must be an `HTMLElement`";
		}

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}

		// Initialize the memory game card
		if (typeof(this.initCallback) == "function") this.initCallback();
	}

	/**
	 * Destroys the memory game card.
	 * 
	 * @returns {void}
	 */
	destroy() {
		if (typeof(this.destroyCallback) == "function") this.destroyCallback();
	}
}

export { MemoryGame, MemoryGameCard };