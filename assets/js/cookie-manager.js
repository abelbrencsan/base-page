/**
 * Cookie Manager
 * This class is designed to easily create, add, and remove cookies.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class CookieManager {

	/**
	 * Created cookie manager instance.
	 * 
	 * @type {CookieManager|null}
	 */
	static #instance = null;

	/**
	 * Creates a new instance of the cookie manager or returns an existing one.
	 * 
	 * @param {Object} options
	 * @returns {CookieManager}
	 */
	constructor(options) {

		// Handle singleton pattern
		if (CookieManager.#instance) return CookieManager.#instance;
		CookieManager.#instance = this;

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}
	}

	/**
	 * Creates a new cookie with the specified name, value, and expiration time in minutes.
	 * 
	 * @param {string} name
	 * @param {string} value 
	 * @param {number} minutes
	 * @returns {void}
	 */
	create(name, value, minutes = 0) {
		let expires = "";
		if (minutes) {
			let date = new Date();
			date.setMinutes(date.getMinutes() + minutes);
			expires = `expires=${date.toUTCString()}`;
		}
		document.cookie = `${name}=${value}; ${expires}; sameSite=Lax; Secure`;
	}

	/**
	 * Retrieves the cookie with the specified name.
	 * 
	 * @param {string} name
	 * @returns {string}
	 */
	get(name) {
		let row = document.cookie.split("; ").find((row) => {
			return row.startsWith(`${name}=`);
		});
		if (row) {
			return row.split("=")[1];
		}
		return "";
	}

	/**
	 * Removes the cookie with the specified name.
	 * 
	 * @param {string} name
	 * @returns {void}
	 */
	remove(name) {
		this.create(name, "", -1);
	}
}

export { CookieManager };