/**
 * Cookie Manager
 * This class is designed to easily set, get and remove cookies.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class CookieManager {

	/**
	 * Creates a new cookie with the specified name, value, and expiration time in minutes.
	 * 
	 * @param {string} name
	 * @param {string} value 
	 * @param {number} minutes
	 * @returns {void}
	 */
	static set(name, value, minutes = 0) {
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
	static get(name) {
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
	static remove(name) {
		CookieManager.set(name, "", -1);
	}
}

export { CookieManager };