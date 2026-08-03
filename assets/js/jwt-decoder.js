/**
 * JWT Decoder
 * This class is designed to easily decode JSON web tokens (JWT).
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class JWTDecoder {

	/**
	 * Retrieves the header of the specified JSON Web Token (JWT).
	 * 
	 * @param {string} token - The token whose header to be retrieved.
	 * @returns {Object|undefined} The decoded token header, or `undefined` if it cannot be decoded.
	 */
	static getHeader(token) {
		return JWTDecoder.#decodeTokenPart(token, "header");
	}

	/**
	 * Gets the payload of the specified JSON Web Token (JWT).
	 * 
	 * @param {string} token - The token whose payload to be retrieved.
	 * @returns {Object|undefined} The decoded token payload, or `undefined` if it cannot be decoded.
	 */
	static getPayload(token) {
		return JWTDecoder.#decodeTokenPart(token, "payload");
	}

	/**
	 * Checks whether the specified JSON Web Token (JWT) is expired.
	 * 
	 * @param {string} token - The token whose expiration to be checked.
	 * @returns {boolean} `true` if the token is expired; otherwise, `false`.
	 */
	static isExpired(token) {
		const payload = JWTDecoder.getPayload(token);
		const expiration = parseInt(payload.exp);
		if (isNaN(expiration)) {
			throw "The expiration date is not specified in the token payload";
		}
		return Date.now() / 1000 > expiration;
	}

	/**
	 * Decodes the specified part of the specified JSON Web Token (JWT).
	 *
	 * @param {string} token - The token whose part should be decoded.
	 * @param {string} partName - The part name to be decoded (e.g., 'header' or 'payload').
	 * @returns {Object|undefined} The decoded part, or `undefined` if it cannot be decoded.
	 */
	static #decodeTokenPart(token, partName = "payload") {
		const tokenPart = JWTDecoder.#parsePart(token, partName);
		return JSON.parse(JWTDecoder.#decodeBase64Unicode(tokenPart.replace('-', '+').replace('_', '/')));
	}

	/**
	 * Parses the specified part of the specified JSON Web Token (JWT).
	 *
	 * @param {string} token - The token whose part should be parsed.
	 * @param {string} partName - The part name to be parsed (e.g., 'header' or 'payload').
	 * @returns {string} The parsed part.
	 */
	static #parsePart(token, partName = "payload") {
		const parts = token.split(".");
		if (parts.length !== 3) {
			throw "The token format is not valid";
		}
		switch (partName) {
			case "header":
				return parts[0];
			case "payload":
				return parts[1];
			case "signature":
				return parts[2];
			default:
				throw `The token part name '${partName}' is not valid`;
		}
	}

	/**
	 * Decodes the specified Base64 encoded string.
	 * 
	 * @param {string} base64 - The base64 encoded string.
	 * @returns {string} The decoded string.
	 */	
	static #decodeBase64Unicode(base64) {
		try {
			return decodeURIComponent([...atob(base64)].map((c) => {
				return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
			}).join(''));
		} catch (error) {
			throw "The token is not parsable";
		}
	}
}

export { JWTDecoder };