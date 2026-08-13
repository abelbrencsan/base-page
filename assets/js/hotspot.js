/**
 * Hotspot
 * This class represents a hotspot that can be aligned within a hotspot scene.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class Hotspot {

	/**
	 * The wrapper element whose width and height are set by the coordinate and the hotspot scene.
	 * 
	 * @type {HTMLElement}
	 */
	wrapper;

	/**
	 * The coordinate of the hotspot.
	 * 
	 * @type {Coordinate}
	 */
	coordinate;

	/**
	 * Callback function that is called after the hotspot has been initialized.
	 * 
	 * @type {function():void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called after the hotspot has been updated.
	 * 
	 * @type {function():void|null}
	 */
	updateCallback = null;

	/**
	 * Creates a hotspot.
	 * 
	 * @param {Object} options
	 * @param {HTMLElement} options.wrapper - The wrapper element whose width and height are set by the coordinate and the hotspot scene.
	 * @param {Coordinate} options.coordinate - The coordinate of the hotspot.
	 * @param {function():void|null} options.initCallback - Callback function that is called after the hotspot has been initialized.
	 * @param {function():void|null} options.updateCallback - Callback function that is called after the hotspot has been updated.
	 * @returns {Hotspot}
	 */
	constructor(options) {

		// Test required options
		if (!(options.wrapper instanceof HTMLElement)) {
			throw "Hotspot \"wrapper\" must be an `HTMLElement`";
		}
		if (!(options.coordinate instanceof Coordinate)) {
			throw "Hotspot \"coordinate\" must be a `Coordinate`";
		}

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}

		// Initialize the hotspot
		if (typeof(this.initCallback) == "function") this.initCallback();
	}

	/**
	 * Updates the hotspot.
	 * 
	 * @param {HotspotScene} scene - The scene the hotspot belongs to.
	 * @returns {void}
	 */
	update(scene) {
		const lat = this.coordinate.lat;
		const long = this.coordinate.long;
		const lower = scene.lowerLimit;
		const upper = scene.upperLimit;
		const relLat = this.calculateRelativeValue(lat, lower.lat, upper.lat);
		const relLong = this.calculateRelativeValue(long, lower.long, upper.long);
		this.wrapper.style.top = `${relLat * 100}%`;
		this.wrapper.style.left = `${relLong * 100}%`;
		if (typeof(this.updateCallback) == "function") this.updateCallback(this);
	}

	/**
	 * Calculates the relative value of the specified absolute value between the minimum and maximum range.
	 * 
	 * @param {number} value - The absolute value to calculate the relative value for.
	 * @param {min} value - The minimum value of the range.
	 * @param {max} value - The maximum value of the range.
	 * @returns {number} The relative value between 0 and 1.
	 */
	calculateRelativeValue(value, min, max) {
		const isReverse = min >= max;
		if (isReverse) {
			[min, max] = [max, min];
		}
		const clampedValue = Math.max(min, Math.min(max, value));
		const relativeValue = (clampedValue - min) / (max - min);
		return isReverse ? 1 - relativeValue : relativeValue;
	}
}

/**
 * Hotspot Scene
 * This class represents a hotspot scene that defines the boundary coordinates for the included hotspots.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class HotspotScene {

	/**
	 * The wrapper element that contains the scene.
	 * 
	 * @type {HTMLElement}
	 */
	wrapper;

	/**
	 * The coordinate of the lower limit.
	 * 
	 * @type {Coordinate}
	 */
	lowerLimit;

	/**
	 * The coordinate of the upper limit.
	 * 
	 * @type {Coordinate}
	 */
	upperLimit;

	/**
	 * An array of hotspots.
	 * 
	 * @type {Hotspot[]}
	 */
	hotspots = [];

	/**
	 * Callback function that is called after the hotspot scene has been initialized.
	 * 
	 * @type {function():void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called after the hotspots have been updated.
	 * 
	 * @type {function():void|null}
	 */
	updateCallback = null;

	/**
	 * Creates a hotspot.
	 * 
	 * @param {Object} options
	 * @param {HTMLElement} options.wrapper - The wrapper element that contains the scene.
	 * @param {Coordinate} options.lowerLimit - The coordinate of the lower limit.
	 * @param {Coordinate} options.lowerLimit - The coordinate of the upper limit.
	 * @param {Hotspot[]} options.hotspots - An array of hotspots.
	 * @param {function():void|null} options.initCallback - Callback function that is called after the hotspot scene has been initialized.
	 * @param {function():void|null} options.updateCallback - Callback function that is called after the hotspots have been updated.
	 * @returns {HotspotScene}
	 */
	constructor(options) {

		// Test required options
		if (!(options.wrapper instanceof HTMLElement)) {
			throw "Hotspot scene \"wrapper\" must be an `HTMLElement`";
		}
		if (!(options.lowerLimit instanceof Coordinate)) {
			throw "Hotspot scene \"lowerLimit\" must be a `Coordinate`";
		}
		if (!(options.upperLimit instanceof Coordinate)) {
			throw "Hotspot scene \"upperLimit\" must be a `Coordinate`";
		}

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}

		// Initialize the hotspot scene
		this.update();
		if (typeof(this.initCallback) == "function") this.initCallback();
	}

	/**
	 * Updates the hotspots.
	 * 
	 * @returns {void}
	 */
	update() {
		this.hotspots.forEach((hotspot) => hotspot.update(this));
		if (typeof(this.updateCallback) == "function") this.updateCallback(this);
	}
}

/**
 * Coordinate
 * This class represents the latitude and longitude of a coordinate.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class Coordinate {

	/**
	 * The latitude of the coordinate.
	 * 
	 * @type {number}
	 */
	lat = 0;

	/**
	 * The longitude of the coordinate.
	 * 
	 * @type {number}
	 */
	long = 0;

	/**
	 * Creates a new coordinate.
	 * 
	 * @param {number} lat - The latitude of the coordinate.
	 * @param {number} long - The longitude of the coordinate.
	 * @returns {Coordinate}
	 */
	constructor(lat = 0, long = 0) {
		this.lat = lat;
		this.long = long;
	}

	/**
	 * Creates a new coordinate from the comma-seperated string.
	 * 
	 * @param {string} raw - The raw, comma-seperated string.
	 * @returns {Coordinate} The created coordinate.
	 */
	static fromString(raw) {
		const values = raw.split(",").map((val) => parseFloat(val));
		return values.length == 2 ? new this(...values) : new this(0, 0);
	}
}

export { Hotspot, HotspotScene, Coordinate };