/**
 * Page reveal
 * This class is designed to manage view transitions between pages.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class PageReveal {

	/**
	 * A function that is called to retrieve the active view transition type.
	 * 
	 * @type {function(NavigationHistoryEntry, NavigationHistoryEntry):string}
	 */
	getType;

	/**
	 * Creates a page reveal.
	 * 
	 * @param {Object} options
	 * @param {function(NavigationHistoryEntry, NavigationHistoryEntry):string} options.getType
	 * @param {function():void} options.initCallback
	 * @param {function():void} options.destroyCallback
	 * @returns {PageReveal}
	 */
	constructor(options) {

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}
		
		// Initialize the page reveal
		this.handleEvent = (event) => this.#handleEvents(event);
		this.#addEvents();
		if (typeof(this.initCallback) == "function") this.initCallback();
	}

	/**
	 * The previous page is about to unload during the view transition.
	 * 
	 * @param {PageSwapEvent} event
	 * @returns {void}
	 */
	#swap(event) {
		if (event.viewTransition === null) return;
		const oldPage = event.activation.from;
		const newPage = event.activation.entry;
		const type = this.getType(oldPage, newPage);
		localStorage.setItem("pageRevealTransition", type);
	}

	/**
	 * The previous page is about to load during the view transition.
	 * 
	 * @param {PageRevealEvent} event
	 * @returns {void}
	 */
	async #reveal(event) {
		if (event.viewTransition === null) return;
		const type = localStorage.getItem("pageRevealTransition");
		if (type !== null) {
			document.documentElement.dataset.pageRevealType = type;
			await event.viewTransition.finished;
			this.#removeTransitionType();
		}
	}

	/**
	 * Removes the type of the view transition from the DOM and the local storage.
	 * 
	 * @returns {void}
	 */
	#removeTransitionType() {
		delete document.documentElement.dataset.pageRevealType;
		localStorage.removeItem("pageRevealTransition");
	}

	/**
	 * Destroys the page reveal.
	 * 
	 * @returns {void}
	 */
	destroy() {
		this.#removeTransitionType();
		this.#removeEvents();
		if (typeof(this.destroyCallback) == "function") this.destroyCallback();
	}

	/**
	 * Adds event listeners related to the page reveal.
	 * 
	 * @returns {void}
	 */
	#addEvents() {
		window.addEventListener("pageswap", this);
		window.addEventListener("pagereveal", this);
	}

	/**
	 * Remove event listeners related to the page reveal.
	 * 
	 * @returns {void}
	 */
	#removeEvents() {
		window.removeEventListener("pageswap", this);
		window.removeEventListener("pagereveal", this);
	}

	/**
	 * Handle events.
	 * 
	 * @param {Event} event
	 * @returns {void}
	 */
	#handleEvents(event) {
		switch (event.type) {
			case "pageswap":
				this.#swap(event);
				break;
			case "pagereveal":
				this.#reveal(event);
				break;
		}
	}
};

// Create a page reveal instance
window.pageReveal = new PageReveal({
	getType: (oldPage, newPage) => {
		if (newPage.url.includes('sign-in')) {
			return 'sign-in-open';
		}
		if (oldPage.url.includes('sign-in')) {
			return 'sign-in-close';
		}
		return 'default';
	}
});