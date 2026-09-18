/**
 * Audio manager
 * This class is designed to fetch, store, and play short audio snippets.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class AudioManager {

	/**
	 * An array of triggers that mutes or unmutes the audio manager when clicked.
	 * 
	 * @type {HTMLButtonElement[]}
	 */
	muteTriggers = [];

	/**
	 * An array of sounds that are played in a loop in the background.
	 * 
	 * @type {HTMLAudioElement[]}
	 */
	backgroundSounds = [];

	/**
	 * The class that is added to the triggers when the audio manager is muted.
	 * 
	 * @type {string}
	 */
	isMutedClass = "is-muted";

	/**
	 * Callback function that is called after the audio manager has been initialized.
	 * 
	 * @type {function(AudioManager):void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called after the audio manager is muted.
	 * 
	 * @type {function(AudioManager):void|null}
	 */
	muteCallback = null;

	/**
	 * Callback function that is called after the audio manager is unmuted.
	 * 
	 * @type {function(AudioManager):void|null}
	 */
	unmuteCallback = null;

	/**
	 * Indicates whether the audio manager is muted.
	 * 
	 * @type {boolean}
	 */
	#isMuted = true;

	/**
	 * The audio context that handles audio.
	 * 
	 * @type {AudioContext}
	 */
	#audioContext = new AudioContext();

	/**
	 * A map that stores fetched audio buffers.
	 * 
	 * @type {Map<string,AudioBuffer>}
	 */
	#audioBuffers = new Map();

	/**
	 * Indicates whether the audio manager is muted.
	 * 
	 * @type {boolean}
	 */
	get isMuted() {
		return this.#isMuted;
	}

	/**
	 * Creates an audio manager.
	 * 
	 * @param {Object} options
	 * @param {HTMLButtonElement[]} options.muteTriggers - An array of triggers that mutes or unmutes the audio manager when clicked.
	 * @param {HTMLAudioElement[]} options.backgroundSounds - An array of sounds that are played in a loop in the background.
	 * @param {string} options.isMutedClass - The class that is added to the triggers when the audio manager is muted.
	 * @param {function(AudioManager):void|null} options.initCallback - Callback function that is called after the audio manager has been initialized.
	 * @param {function(AudioManager):void|null} options.muteCallback - Callback function that is called after the audio manager is muted.
	 * @param {function(AudioManager):void|null} options.unmuteCallback - Callback function that is called after the audio manager is unmuted.
	 * @returns {AudioManager}
	 */
	constructor(options) {

		// Set fields from options
		if ("muteTriggers" in options) this.muteTriggers = options.muteTriggers;
		if ("backgroundSounds" in options) this.backgroundSounds = options.backgroundSounds;
		if ("isMutedClass" in options) this.isMutedClass = options.isMutedClass;
		if ("initCallback" in options) this.initCallback = options.initCallback;
		if ("muteCallback" in options) this.muteCallback = options.muteCallback;
		if ("unmuteCallback" in options) this.unmuteCallback = options.unmuteCallback;

		// Initialize the audio manager
		this.handleEvent = (event) => this.#handleEvents(event);
		this.#addEvents();
		this.#toggleMuteTriggers();
		if (typeof(this.initCallback) == "function") this.initCallback(this);
	}

	/**
	 * Plays the stored audio buffer with the specified name once.
	 * 
	 * @param {string} name - The name of the audio buffer to be played.
	 * @returns {void}
	 */
	play(name) {
		if (this.#isMuted) return; 
		const buffer = this.#audioBuffers.get(name);
		if (buffer) {
			const source = new AudioBufferSourceNode(this.#audioContext);
			source.buffer = buffer;
			source.connect(this.#audioContext.destination);
			source.start();
		}
	}

	/**
	 * Mutes the audio manager.
	 * 
	 * @returns {void}
	 */
	mute() {
		this.#isMuted = true;
		this.#toggleMuteTriggers();
		this.#toggleBackgroundSounds();
		if (typeof(this.muteCallback) == "function") this.muteCallback(this);
	}

	/**
	 * Unmutes the audio manager.
	 * 
	 * @returns {void}
	 */
	unmute() {
		this.#isMuted = false;
		this.#toggleMuteTriggers();
		this.#toggleBackgroundSounds();
		if (typeof(this.unmuteCallback) == "function") this.unmuteCallback(this);
	}

	/**
	 * Fetches the audio file from the specified source.
	 * 
	 * @param {string} src - The source of the audio file.
	 * @param {string} name - The name under which the audio buffer is stored.
	 * @returns {void}
	 */
	fetchAudioFile(src, name) {
		if (!src) return;
		fetch(src)
			.then((response) => {
				if (!response.ok) {
					throw `Audio manager \"${name}\" audio could not be fetched: ${response.status}`;
				}
				return response.arrayBuffer();
			})
			.then((buffer) => this.#audioContext.decodeAudioData(buffer))
			.then((audioBuffer) => this.#audioBuffers.set(name, audioBuffer));
	}

	/**
	 * Adds a new trigger that mutes or unmutes the audio manager.
	 * 
	 * @param {HTMLButtonElement} muteTrigger - The trigger that mutes or unmutes the audio manager when clicked.
	 * @returns {void}
	 */
	addMuteTrigger(muteTrigger) {
		muteTrigger.addEventListener("click", this);
		this.muteTriggers.push(muteTrigger);
		this.#toggleMuteTriggers();
	}

	/**
	 * Adds or removes classes from the mute triggers.
	 * 
	 * @returns {void}
	 */
	#toggleMuteTriggers() {
		this.muteTriggers.forEach((muteTrigger) => {
			muteTrigger.classList.toggle(this.isMutedClass, this.#isMuted);
		});
	}

	/**
	 * Starts or stops background sounds.
	 * 
	 * @returns {void}
	 */
	#toggleBackgroundSounds() {
		this.backgroundSounds.forEach((backgroundSound) => {
			backgroundSound.loop = true;
			if (this.#isMuted) {
				backgroundSound.pause();
			} else {
				backgroundSound.play().catch((error) => {
					this.mute();
				});
			}
		});
	}

	/**
	 * Adds event listeners related to the audio manager.
	 * 
	 * @returns {void}
	 */
	#addEvents() {
		this.muteTriggers.forEach((muteTrigger) => {
			muteTrigger.addEventListener("click", this);
		});
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
				this.muteTriggers.forEach((muteTrigger) => {
					if (muteTrigger == event.target) {
						this.#isMuted ? this.unmute() : this.mute();
					}
				});
				break;
		}
	}
}

export { AudioManager };