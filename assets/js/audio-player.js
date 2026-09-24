/**
 * Audio Player
 * This class represents an audio player that can play and pause audio and seek through it using a seek range.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class AudioPlayer {

	/**
	 * The wrapper element that contains the control triggers and the seek range.
	 * 
	 * @type {HTMLElement}
	 */
	wrapper;

	/**
	 * The trigger that plays or pauses the audio when clicked.
	 * 
	 * @type {HTMLButtonElement}
	 */
	playTrigger;

	/**
	 * The trigger that stops the audio when clicked.
	 * 
	 * @type {HTMLButtonElement|null}
	 */
	stopTrigger = null;

	/**
	 * The trigger that aborts the audio when clicked.
	 * 
	 * @type {HTMLButtonElement|null}
	 */
	abortTrigger = null;

	/**
	 * The range input used to seek through the audio.
	 * 
	 * @type {HTMLInputElement|null}
	 */
	seekRange = null;

	/**
	 * The source of the audio to be played.
	 * 
	 * @type {string}
	 */
	source = "";

	/**
	 * The class that is added to the wrapper and the play trigger while the audio is playing.
	 * 
	 * @type {string}
	 */
	isPlayingClass = "is-playing";

	/**
	 * The class added to the wrapper when the audio source is set.
	 * 
	 * @type {string}
	 */
	hasAudioSourceClass = "has-audio-source";
	
	/**
	 * Callback function that is called after the audio player has been initialized.
	 * 
	 * @type {function(AudioPlayer):void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called after the audio has been stopped manually.
	 * 
	 * @type {function(AudioPlayer):void|null}
	 */
	stopCallback = null;

	/**
	 * Callback function that is called after the audio has started playing.
	 * 
	 * @type {function(AudioPlayer,Event):void|null}
	 */
	playCallback = null;

	/**
	 * Callback function that is called after the audio has been paused.
	 * 
	 * @type {function(AudioPlayer,Event):void|null}
	 */
	pauseCallback = null;

	/**
	 * Callback function that is called after the audio has been loaded.
	 * 
	 * @type {function(AudioPlayer,Event):void|null}
	 */
	loadCallback = null;

	/**
	 * Callback function that is called after the audio has been aborted.
	 * 
	 * @type {function(AudioPlayer,Event):void|null}
	 */
	abortCallback = null;

	/**
	 * Callback function that is called when the audio could not be loaded due to an error.
	 * 
	 * @type {function(AudioPlayer,Event):void|null}
	 */
	errorCallback = null;

	/**
	 * Callback function that is called after the audio has been ended.
	 * 
	 * @type {function(AudioPlayer,Event):void|null}
	 */
	endCallback = null;

	/**
	 * The audio element to be played.
	 * 
	 * @type {HTMLAudioElement}
	 */
	#audio;

	/**
	 * The audio element to be played.
	 * 
	 * @type {HTMLAudioElement}
	 */
	get audio() {
		return this.#audio;
	}

	/**
	 * Indicates whether the source of the audio is set.
	 * 
	 * @type {boolean}
	 */
	get hasAudioSource() {
		return this.#audio.src !== "";
	}

	/**
	 * Creates an audio player.
	 * 
	 * @param {Object} options
	 * @param {HTMLElement} options.wrapper -  The wrapper element that contains the control triggers and the seek range.
	 * @param {HTMLButtonElement} options.playTrigger - The trigger that plays or pauses the audio when clicked.
	 * @param {HTMLButtonElement|null} options.stopTrigger - The trigger that stops the audio when clicked.
	 * @param {HTMLButtonElement|null} options.abortTrigger - The trigger that aborts the audio when clicked.
	 * @param {HTMLInputElement|null} options.seekRange - The range input used to seek through the audio.
	 * @param {string} options.source - The source of the audio to be played.
	 * @param {string} options.isPlayingClass - The class that is added to the wrapper and the play trigger while the audio is playing.
	 * @param {string} options.hasAudioSourceClass - The class added to the wrapper when the audio source is set.
	 * @param {function(AudioPlayer):void|null} options.initCallback - Callback function that is called after the audio player has been initialized.
	 * @param {function(AudioPlayer):void|null} options.stopCallback - Callback function that is called after the audio has been stopped manually.
	 * @param {function(AudioPlayer,Event):void|null} options.playCallback - Callback function that is called after the audio has started playing.
	 * @param {function(AudioPlayer,Event):void|null} options.pauseCallback - Callback function that is called after the audio has been paused.
	 * @param {function(AudioPlayer,Event):void|null} options.loadCallback - Callback function that is called after the audio has been loaded.
	 * @param {function(AudioPlayer,Event):void|null} options.abortCallback - Callback function that is called after the audio has been aborted.
	 * @param {function(AudioPlayer,Event):void|null} options.errorCallback - Callback function that is called when the audio could not be loaded due to an error.
	 * @param {function(AudioPlayer,Event):void|null} options.endCallback - Callback function that is called after the audio has been ended.
	 * @returns {AudioPlayer}
	 */
	constructor(options) {

		// Test required options
		if (!(options.wrapper instanceof HTMLElement)) {
			throw "Audio player \"wrapper\" must be an `HTMLElement`";
		}
		if (!(options.playTrigger instanceof HTMLButtonElement)) {
			throw "Audio player \"playTrigger\" must be an `HTMLButtonElement`";
		}

		// Set fields from options
		this.wrapper = options.wrapper;
		this.playTrigger = options.playTrigger;
		if ("stopTrigger" in options) this.stopTrigger = options.stopTrigger;
		if ("abortTrigger" in options) this.abortTrigger = options.abortTrigger;
		if ("seekRange" in options) this.seekRange = options.seekRange;
		if ("source" in options) this.source = options.source;
		if ("isPlayingClass" in options) this.isPlayingClass = options.isPlayingClass;
		if ("hasAudioSourceClass" in options) this.hasAudioSourceClass = options.hasAudioSourceClass;
		if ("initCallback" in options) this.initCallback = options.initCallback;
		if ("stopCallback" in options) this.stopCallback = options.stopCallback;
		if ("playCallback" in options) this.playCallback = options.playCallback;
		if ("pauseCallback" in options) this.pauseCallback = options.pauseCallback;
		if ("loadCallback" in options) this.loadCallback = options.loadCallback;
		if ("abortCallback" in options) this.abortCallback = options.abortCallback;
		if ("errorCallback" in options) this.errorCallback = options.errorCallback;
		if ("endCallback" in options) this.endCallback = options.endCallback;

		// Initialize the tour audio player
		this.handleEvent = (event) => this.#handleEvents(event);
		this.#addEvents();
		this.#audio = this.#createAudio();
		if (this.source) {
			this.load(this.source);
		} else {
			this.#toggleTriggers();
		}
		if (typeof(this.initCallback) == "function") this.initCallback(this);
	}

	/**
	 * Loads the audio with the specified source.
	 * 
	 * @param {string} source - The source to be loaded.
	 * @returns {void}
	 */
	load(source) {
		this.#audio.setAttribute("src", source);
		this.#audio.load();
	}

	/**
	 * Aborts the current audio source.
	 * 
	 * @returns {void}
	 */
	abort() {
		this.#audio.removeAttribute("src");
		this.#audio.load();
	}

	/**
	 * Plays the audio.
	 * 
	 * @returns {void}
	 */
	play() {
		if (this.#audio.ended) this.#audio.currentTime = 0; 
		this.#audio.play().catch((error) => {
			this.stop();
		});
	}

	/**
	 * Pauses the audio.
	 * 
	 * @returns {void}
	 */
	pause() {
		this.#audio.pause();
	}

	/**
	 * Stops the audio.
	 * 
	 * @returns {void}
	 */
	stop() {
		this.#audio.pause();
		this.#audio.currentTime = 0;
		if (typeof(this.stopCallback) == "function") this.stopCallback(this);
	}

	/**
	 * Seeks the audio to the specified time in seconds.
	 * 
	 * @param {number} seconds - The seconds to be set as the current time.
	 * @returns {void}
	 */
	seekTo(seconds) {
		this.#audio.currentTime = seconds;
	}

	/**
	 * Creates the audio element.
	 * 
	 * @returns {HTMLAudioElement}
	 */
	#createAudio() {
		const audio = new Audio();
		audio.addEventListener("play", this);
		audio.addEventListener("pause", this);
		audio.addEventListener("loadedmetadata", this);
		audio.addEventListener("abort", this);
		audio.addEventListener("error", this);
		audio.addEventListener("timeupdate", this);
		audio.addEventListener("ended", this);
		return audio;
	}

	/**
	 * Enables or disables the triggers and the seek range based on whether the audio source is set.
	 * 
	 * @returns {void}
	 */
	#toggleTriggers() {
		this.wrapper.classList.toggle(this.hasAudioSourceClass, this.hasAudioSource);
		this.playTrigger.disabled = !this.hasAudioSource;
		if (this.stopTrigger) {
			this.stopTrigger.disabled = !this.hasAudioSource;
		}
		if (this.abortTrigger) {
			this.abortTrigger.disabled = !this.hasAudioSource;
		}
		if (this.seekRange) {
			this.seekRange.disabled = !this.hasAudioSource;
			this.seekRange.min = 0;
			this.seekRange.max = this.hasAudioSource ? Math.ceil(this.#audio.duration) : 0;
			this.seekRange.value = this.hasAudioSource ? this.#audio.currentTime : 0;
		}
	}

	/**
	 * Adds the classes used while the audio is playing.
	 * 
	 * @returns {void}
	 */
	#addPlayingClasses() {
		this.wrapper.classList.add(this.isPlayingClass);
		this.playTrigger.classList.add(this.isPlayingClass);
	}

	/**
	 * Removes the classes used while the audio is playing.
	 * 
	 * @returns {void}
	 */
	#removePlayingClasses() {
		this.wrapper.classList.remove(this.isPlayingClass);
		this.playTrigger.classList.remove(this.isPlayingClass);
	}

	/**
	 * Executes after the audio has started playing.
	 * 
	 * @param {Event} event - The event to be handled.
	 * @returns {void}
	 */
	#isPlaying(event) {
		this.#addPlayingClasses();
		if (typeof(this.playCallback) == "function") this.playCallback(this, event);
	}

	/**
	 * Executes after the audio has paused.
	 * 
	 * @param {Event} event - The event to be handled.
	 * @returns {void}
	 */
	#isPaused(event) {
		this.#removePlayingClasses();
		if (typeof(this.pauseCallback) == "function") this.pauseCallback(this, event);
	}

	/**
	 * Executes after the source of the audio has been loaded.
	 * 
	 * @param {Event} event - The event to be handled.
	 * @returns {void}
	 */
	#isLoaded(event) {
		this.#removePlayingClasses();
		this.#toggleTriggers();
		if (typeof(this.loadCallback) == "function") this.loadCallback(this, event);
	}

	/**
	 * Executes after the source of the audio has been aborted.
	 * 
	 * @param {Event} event - The event to be handled.
	 * @returns {void}
	 */
	#isAborted(event) {
		this.#removePlayingClasses();
		this.#toggleTriggers();
		if (typeof(this.abortCallback) == "function") this.abortCallback(this, event);
	}

	/**
	 * Executes after the source of the audio has been aborted.
	 * 
	 * @param {Event} event - The event to be handled.
	 * @returns {void}
	 */
	#hasError(event) {
		this.#audio.removeAttribute("src");
		this.#toggleTriggers();
		if (typeof(this.errorCallback) == "function") this.errorCallback(this, event);
	}

	/**
	 * Executes after the current time of the audio has been updated.
	 * 
	 * @param {Event} event - The event to be handled.
	 * @returns {void}
	 */
	#isTimeUpdated(event) {
		this.seekRange.value = this.#audio.currentTime;
	}

	/**
	 * Executes after the audio has been ended.
	 * 
	 * @param {Event} event - The event to be handled.
	 * @returns {void}
	 */
	#isEnded(event) {
		this.seekRange.value = this.seekRange.max;
		if (typeof(this.endCallback) == "function") this.endCallback(this, event);
	}

	/**
	 * Adds event listeners related to the tour audio player.
	 * 
	 * @returns {void}
	 */
	#addEvents() {
		this.playTrigger.addEventListener("click", this);
		if (this.stopTrigger) this.stopTrigger.addEventListener("click", this);
		if (this.abortTrigger) this.abortTrigger.addEventListener("click", this);
		if (this.seekRange) this.seekRange.addEventListener("input", this);
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
				if (event.target == this.playTrigger) {
					this.#audio.paused ? this.play() : this.pause();
				}
				if (event.target == this.stopTrigger) {
					this.stop();
				}
				if (event.target == this.abortTrigger) {
					this.abort();
				}
				break;
			case "input":
				if (this.seekRange) {
					this.seekTo(parseInt(this.seekRange.value));
				}
				break;
			case "play":
				this.#isPlaying(event);
				break;
			case "pause":
				this.#isPaused(event);
				break;
			case "loadedmetadata":
				this.#isLoaded(event);
				break;
			case "abort":
				this.#isAborted(event);
				break;
			case "error":
				this.#hasError(event);
				break;
			case "timeupdate":
				this.#isTimeUpdated(event);
				break;
			case "ended":
				this.#isEnded(event);
				break;
		}
	}
}

export { AudioPlayer };