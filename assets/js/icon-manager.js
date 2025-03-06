/**
 * Icon Manager
 * This class is designed to append a set of SVG symbols to the DOM.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class IconManager {

	/**
	 * The class added to the dynamically created SVG element that contains the symbols.
	 * 
	 * @type {string}
	 */
	symbolListClass = "icon-symbols";

	/**
	 * Callback function that is called after the icon manager has been initialized.
	 * 
	 * @type {function():void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called after the icon manager has been destroyed.
	 * 
	 * @type {function():void|null}
	 */
	destroyCallback = null;

	/**
	 * Symbols that can be inserted into the DOM.
	 * 
	 * @type {string}
	 */
	static symbols = `
		<symbol id="icon-chevron-back" viewBox="0 0 512 512"><path d="m330.09 88.092a24 24 0 0 0-8.3027 0.72656 24 24 0 0 0-10.76 6.2109l-144 144a24.002 24.002 0 0 0 0 33.941l144 144a24 24 0 0 0 33.941 0 24 24 0 0 0 0-33.941l-127.03-127.03 127.03-127.03a24 24 0 0 0 0-33.941 24 24 0 0 0-14.879-6.9375z"/></symbol>
		<symbol id="icon-chevron-down" viewBox="0 0 512 512"><path d="m114.09 160.09a24 24 0 0 0-8.3027 0.72656 24 24 0 0 0-10.76 6.2109 24 24 0 0 0 0 33.941l144 144a24.002 24.002 0 0 0 33.941 0l144-144a24 24 0 0 0 0-33.941 24 24 0 0 0-33.941 0l-127.03 127.03-127.03-127.03a24 24 0 0 0-14.879-6.9375z"/></symbol>
		<symbol id="icon-chevron-forward" viewBox="0 0 512 512"><path d="m186.09 88.092a24 24 0 0 0-8.3027 0.72656 24 24 0 0 0-10.76 6.2109 24 24 0 0 0 0 33.941l127.03 127.03-127.03 127.03a24 24 0 0 0 0 33.941 24 24 0 0 0 33.941 0l144-144a24.002 24.002 0 0 0 0-33.941l-144-144a24 24 0 0 0-14.879-6.9375z"/></symbol>
		<symbol id="icon-chevron-up" viewBox="0 0 512 512"><path d="m258.09 160.09a24.002 24.002 0 0 0-8.3027 0.72656 24.002 24.002 0 0 0-10.76 6.2109l-144 144a24 24 0 0 0 0 33.941 24 24 0 0 0 33.941 0l127.03-127.03 127.03 127.03a24 24 0 0 0 33.941 0 24 24 0 0 0 0-33.941l-144-144a24.002 24.002 0 0 0-14.879-6.9375z"/></symbol>
		<symbol id="icon-close" viewBox="0 0 512 512"><path d="m368 128a16 16 0 0 0-11.314 4.6875l-100.69 100.69-100.69-100.69a16 16 0 0 0-15.455-4.1406 16 16 0 0 0-7.1738 4.1406 16 16 0 0 0 0 22.629l100.69 100.69-100.69 100.69a16 16 0 0 0 0 22.629 16 16 0 0 0 22.629 0l100.69-100.69 100.69 100.69a16 16 0 0 0 22.629 0 16 16 0 0 0 0-22.629l-100.69-100.69 100.69-100.69a16 16 0 0 0 0-22.629 16 16 0 0 0-11.314-4.6875z"/></symbol>
		<symbol id="icon-lock-closed" viewBox="0 0 512 512"><path d="m256 17c-52.83 0-96 43.17-96 96v79h-16c-35.179 0-64 28.821-64 64v176c0 35.179 28.821 64 64 64h224c35.179 0 64-28.821 64-64v-176c0-35.179-28.821-64-64-64h-16v-79c0-52.83-43.17-96-96-96zm0 32c35.536 0 64 28.464 64 64v79h-128v-79c0-35.536 28.464-64 64-64zm-112 175h32 160 32c18.005 0 32 13.995 32 32v176c0 18.005-13.995 32-32 32h-224c-18.005 0-32-13.995-32-32v-176c0-18.005 13.995-32 32-32z"/></symbol>
		<symbol id="icon-mail" viewBox="0 0 512 512"><path d="m88 80c-30.747 0-56 25.253-56 56v240c0 30.747 25.253 56 56 56h336c30.747 0 56-25.253 56-56v-240c0-30.747-25.253-56-56-56h-336zm0 32h336c13.573 0 24 10.427 24 24v240c0 13.573-10.427 24-24 24h-336c-13.573 0-24-10.427-24-24v-240c0-13.573 10.427-24 24-24zm313.98 32.125a16 16 0 0 0-11.807 3.2461l-134.18 104.36-134.18-104.36a16 16 0 0 0-7.6309-3.2207 16 16 0 0 0-14.82 6.0273 16 16 0 0 0 2.8066 22.451l144 112a16.002 16.002 0 0 0 19.645 0l144-112a16 16 0 0 0 2.8066-22.451 16 16 0 0 0-10.645-6.0527z"/></symbol>
		<symbol id="icon-menu" viewBox="0 0 512 512"><path d="m80 144a16 16 0 0 0-16 16 16 16 0 0 0 16 16h352a16 16 0 0 0 16-16 16 16 0 0 0-16-16h-352zm0 96a16 16 0 0 0-16 16 16 16 0 0 0 16 16h352a16 16 0 0 0 16-16 16 16 0 0 0-16-16h-352zm0 96a16 16 0 0 0-16 16 16 16 0 0 0 16 16h352a16 16 0 0 0 16-16 16 16 0 0 0-16-16h-352z"/></symbol>
		<symbol id="icon-person-add" viewBox="0 0 512 512"><path d="m288 32c-61.252 0-108.54 50.082-103.96 113.16a16.002 16.002 0 0 0 0 0.00195c4.3892 60.287 49.504 110.84 103.96 110.84 54.456 0 99.49-50.566 103.96-110.82a16.002 16.002 0 0 0 0-0.00195c4.6111-62.25-42.504-113.18-103.96-113.18zm0 32c44.547 0 75.432 33.069 72.043 78.818-3.3737 45.489-38.499 81.182-72.043 81.182-33.546 0-68.731-35.688-72.043-81.16v-0.00195c-3.4115-46.921 27.295-78.838 72.043-78.838zm-200 96a16 16 0 0 0-16 16v40h-40a16 16 0 0 0-16 16 16 16 0 0 0 16 16h40v40a16 16 0 0 0 16 16 16 16 0 0 0 16-16v-40h40a16 16 0 0 0 16-16 16 16 0 0 0-16-16h-40v-40a16 16 0 0 0-16-16zm200 128c-46.443 0-93.176 12.672-131.19 38.012-38.004 25.333-67.202 63.957-76.187 113.71-5.89e-4 3e-3 5.87e-4 0.00676 0 0.00976-1.6892 9.2357-0.09595 18.806 5.3281 26.717 5.426 7.9128 15.455 13.557 26.061 13.557h351.99c10.606 0 20.638-5.6538 26.055-13.564s7.0045-17.459 5.3418-26.676v-0.00196c-8.9813-49.768-38.187-88.406-76.203-113.75-38.016-25.34-84.751-38.012-131.19-38.012zm0 32c40.557 0 81.474 11.328 113.45 32.639 31.971 21.31 55.09 51.971 62.459 92.803 0.24241 1.3438 8.8e-4 2.1669-0.14453 2.5586h-351.53c-0.14271-0.38273-0.37971-1.1909-0.13672-2.5176l0.0039-0.02148 0.00391-0.02149c7.3639-40.831 30.481-71.491 62.451-92.801 31.97-21.31 72.886-32.639 113.44-32.639z"/></symbol>
		<symbol id="logo-facebook" viewBox="0 0 512 512"><path d="m256 33.35c-123.7 0-224 100.3-224 224 0 111.8 81.9 204.47 189 221.29v-156.52h-56.891v-64.77h56.891v-49.35c0-56.13 33.449-87.16 84.609-87.16 24.51 0 50.15 4.3809 50.15 4.3809v55.129h-28.26c-27.81 0-36.51 17.26-36.51 35v42h62.119l-9.9199 64.77h-52.189v156.54c107.1-16.81 189-109.48 189-221.31 0-123.7-100.3-224-224-224z"/></symbol>
		<symbol id="logo-youtube" viewBox="0 0 512 512"><path d="m247 64c-57.6 0-114.2 0.99961-169.6 3.5996-40.8 0-73.9 36.4-73.9 81.4-2.5 35.59-3.56 71.189-3.5 106.79-0.1 35.6 1.0337 71.234 3.4004 106.9 0 45 33.1 81.5 73.9 81.5 58.2 2.7 117.9 3.9008 178.6 3.8008 60.8 0.2 120.33-1.0674 178.6-3.8008 40.9 0 74-36.5 74-81.5 2.4-35.7 3.5004-71.3 3.4004-107 0.22667-35.6-0.85976-71.234-3.2598-106.9 0-45-33.1-81.199-74-81.199-55.4-2.59-111.9-3.5898-169.64-3.5898h-18zm-40 93.391 145 98.199-145 98.301v-196.5z"/></symbol>
	`;

	/**
	 * Created icon manager instance.
	 * 
	 * @type {IconManager|null}
	 */
	static #instance = null;

	/**
	 * Creates a new instance of the icon manager or returns an existing one.
	 * 
	 * @param {Object} options
	 * @param {string} options.symbolListClass
	 * @param {function():void} options.initCallback
	 * @param {function():void} options.destroyCallback
	 * @returns {IconManager}
	 */
	constructor(options) {

		// Handle singleton pattern
		if (IconManager.#instance) return IconManager.#instance;
		IconManager.#instance = this;

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}

		// Initialize the icon manager
		document.querySelector("body").insertAdjacentHTML("beforeend", this.symbolListHtml);
		if (typeof(this.initCallback) == "function") this.initCallback();
	}

	/**
	 * Destroys the icon manager.
	 * 
	 * @returns {void}
	 */
	destroy() {
		let symbolListElem = document.querySelector(`.${this.symbolListClass}`);
		if (symbolListElem) symbolListElem.remove();
		if (typeof(this.destroyCallback) == "function") this.destroyCallback();
	}

	/**
	 * Creates HTML for the symbol list that can be inserted into the DOM.
	 * 
	 * @returns {string}
	 */
	get symbolListHtml() {
		return `
			<svg class="${this.symbolListClass}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="ei-sprite" style="display:none">
				${IconManager.symbols}
			</svg>`;
	}
}

export { IconManager };