/**
 * Memory game
 * This class is designed to create memory card games.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class MemoryGame {

	/**
	 * The wrapper element that that contains the elements of the game.
	 * 
	 * @type {HTMLElement}
	 */
	wrapper;

	/**
	 * The list element that includes the cards.
	 * 
	 * @type {HTMLUListElement}
	 */
	cardList;

	/**
	 * An array of cards to be paired.
	 * 
	 * @type {MemoryGameCard[]}
	 */
	cards;

	/**
	 * The trigger button that restarts the memory game when clicked.
	 * 
	 * @type {HTMLButtonElement|null}
	 */
	restartTrigger = null;

	/**
	 * The element where the current number of found pairs is displayed.
	 * 
	 * @type {HTMLElement|null}
	 */
	scoreIndicator = null;

	/**
	 * The element where the current number of card flips is displayed.
	 * 
	 * @type {HTMLElement|null}
	 */
	moveCountIndicator = null;

	/**
	 * The element where the number of elapsed seconds is displayed since the first flip.
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
	 * The number of elapsed seconds since the first flip.
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
	 * The ID of the interval created to count the number of elapsed seconds since the first flip.
	 * 
	 * @type {number|null}
	 */
	intervalId = null;

	/**
	 * Indicates whether the game is completed.
	 * 
	 * @returns {boolean} `true` if the game is completed; otherwise, `false`.
	 */
	get isCompleted() {
		return this.score >= this.cards.length / 2;
	}

	/**
	 * Creates a memory game.
	 * 
	 * @param {Object} options
	 * @param {HTMLElement} options.wrapper - The wrapper element that that contains the elements of the game.
	 * @param {HTMLUListElement} options.cardList - The list element that includes the cards.
	 * @param {MemoryGameCard[]} options.cards - An array of cards to be paired.
	 * @param {HTMLButtonElement|null} options.restartTrigger - The trigger button that restarts the memory game when clicked.
	 * @param {HTMLElement|null} options.scoreIndicator - The element where the current number of found pairs is displayed.
	 * @param {HTMLElement|null} options.moveCountIndicator - The element where the current number of card flips is displayed.
	 * @param {HTMLElement|null} options.timerIndicator - The element where the number of elapsed seconds is displayed since the first flip.
	 * @param {number} options.flipCardBackDelay - The delay in milliseconds after the cards are flipped back when they are mismatched.
	 * @param {number} options.timeLimit - The time limit in seconds after the game completes.
	 * @param {string} options.isCardFlippedClass - The class that is added to the card trigger while it is flipped.
	 * @param {string} options.isCardPairedClass - The class that is added to the card trigger when it is paired with the other selected card.
	 * @param {string} options.isCardMismatchedClass - The class that is added to the card trigger when it is mismatched with the other selected card.
	 * @param {string} options.hasFlippingCardClass - The class that is added to the wrapper while a card is being flipped.
	 * @param {string} options.isCompletedClass - The class that is added to the wrapper when all card pairs have been found.
	 * @param {function():void|null} options.initCallback - Callback function that is called after the memory game has been initialized.
	 * @param {function(MemoryGameCard):void|null} options.cardFlipCallback - Callback function that is called after a card has been flipped.
	 * @param {function(MemoryGameCard, MemoryGameCard, boolean):void|null} options.cardMatchCallback - Callback function that is called after the two cards have been matched.
	 * @param {function(MemoryGameCard, MemoryGameCard):void|null} options.cardMismatchCallback - Callback function that is called after the two cards have been mismatched.
	 * @param {function(number, number, number):void|null} options.completeCallback - Callback function that is called after all the cards have been matched with their pairs.
	 * @param {function():void|null} options.restartCallback - Callback function that is called after the memory game has been restarted.
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
	 * @param {MemoryGameCard} card - The card to be flipped.
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
	 * Selects the specified card as the card to be compared with the next selected card.
	 * 
	 * @param {MemoryGameCard} card - The card to be selected.
	 * @returns {void}
	 */
	#selectFirstCard(card) {
		this.flippedCard = card;
	}

	/**
	 * Detects whether the two specified cards match; pairs them if they do, and mismatches them if they do not.
	 * 
	 * @param {MemoryGameCard} firstCard - The first card to be compared.
	 * @param {MemoryGameCard} secondCard - The second card to be compared.
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
	 * @param {MemoryGameCard} firstCard - The first card to be paired.
	 * @param {MemoryGameCard} secondCard - The second card to be paired.
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
	 * Mismatches the two specified cards.
	 * 
	 * @param {MemoryGameCard} firstCard - The first card to be mismatched.
	 * @param {MemoryGameCard} secondCard - The second card to be mismatched.
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
	 * @param {MemoryGameCard} card - The card to be applied as flipped.
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
	 * @param {MemoryGameCard} card - The card to be applied as paired.
	 * @returns {void}
	 */
	#applyCardAsPaired(card) {
		card.trigger.classList.add(this.isCardPairedClass);
	}

	/**
	 * Applies the specified card as mismatched.
	 * 
	 * @param {MemoryGameCard} card - The card to be applied as mismatched.
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
	 * @param {boolean} keepPaired - Indicates whether to keep paired cards.
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
	 * @param {HTMLLIElement[]} elems - The elements to be retrieved in random order.
	 * @returns {HTMLLIElement[]} The elements in random order.
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
	 * Displays the number of seconds elapsed since the first flip within the timer indicator.
	 * 
	 * @returns {void}
	 */
	#updateTimerIndicator() {
		if (!this.timerIndicator) return;
		this.timerIndicator.innerHTML = this.timer;
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
	 * Handles events.
	 * 
	 * @param {Event} event - The event to be handled.
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
	 * The trigger button that flips the card when clicked.
	 * 
	 * @type {HTMLButtonElement}
	 */
	trigger;

	/**
	 * The front view of the card, which is displayed when it is flipped.
	 * 
	 * @type {HTMLElement}
	 */
	frontView;

	/**
	 * The back view of the card, which is displayed when it is not flipped.
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
	 * Creates a memory game card.
	 * 
	 * @param {Object} options
	 * @param {string} options.id - The id of the memory game card.
	 * @param {HTMLButtonElement} options.trigger - The trigger button that flips the card when clicked.
	 * @param {HTMLElement} options.frontView - The front view of the card, which is displayed when it is flipped.
	 * @param {HTMLElement} options.backView - The back view of the card, which is displayed when it is not flipped.
	 * @param {function():void|null} options.initCallback - Callback function that is called after the memory game card has been initialized.
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
}

export { MemoryGame, MemoryGameCard };