/**
 * Audio Manager
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
	 * An array of triggers that plays an audio when clicked.
	 * 
	 * @type {AudioManagerPlayTrigger[]}
	 */
	playTriggers = [];

	/**
	 * A map of audio elements that are played in a loop in the background.
	 * 
	 * @type {Map<string,HTMLAudioElement>}
	 */
	backgroundAudio = new Map();

	/**
	 * The class that is added to the mute and play triggers when the audio manager is muted.
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
	 * An array of paused background audio elements used to distinguish between audio muted because it is paused and audio muted explicitly.
	 * 
	 * @type {HTMLAudioElement[]}
	 */
	#pausedBackgroundAudio = [];

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
	 * @param {AudioManagerPlayTrigger[]} options.playTriggers - An array of triggers that plays an audio when clicked.
	 * @param {Map<string,HTMLAudioElement>} options.backgroundAudio - A map of audio elements that are played in a loop in the background.
	 * @param {string} options.isMutedClass - The class that is added to the mute and play triggers when the audio manager is muted.
	 * @param {function(AudioManager):void|null} options.initCallback - Callback function that is called after the audio manager has been initialized.
	 * @param {function(AudioManager):void|null} options.muteCallback - Callback function that is called after the audio manager is muted.
	 * @param {function(AudioManager):void|null} options.unmuteCallback - Callback function that is called after the audio manager is unmuted.
	 * @returns {AudioManager}
	 */
	constructor(options) {

		// Set fields from options
		if ("muteTriggers" in options) this.muteTriggers = options.muteTriggers;
		if ("playTriggers" in options) this.playTriggers = options.playTriggers;
		if ("backgroundAudio" in options) this.backgroundAudio = options.backgroundAudio;
		if ("isMutedClass" in options) this.isMutedClass = options.isMutedClass;
		if ("initCallback" in options) this.initCallback = options.initCallback;
		if ("muteCallback" in options) this.muteCallback = options.muteCallback;
		if ("unmuteCallback" in options) this.unmuteCallback = options.unmuteCallback;

		// Initialize the audio manager
		this.handleEvent = (event) => this.#handleEvents(event);
		this.#addEvents();
		this.#toggleMuteTriggers();
		this.#togglePlayTriggers();
		this.#toggleBackgroundAudio();
		if (typeof(this.initCallback) == "function") this.initCallback(this);
	}

	/**
	 * Plays the fetched audio with the specified name.
	 * 
	 * @param {string} name - The name of the audio to be played.
	 * @param {boolean} force - Indicates whether to play the audio even when the audio manager is muted.
	 * @returns {void}
	 */
	play(name, force = false) {
		if (this.#isMuted && !force) return; 
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
		this.#togglePlayTriggers();
		this.#toggleBackgroundAudio();
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
		this.#togglePlayTriggers();
		this.#toggleBackgroundAudio();
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
	 * Adds a new trigger that mutes or unmutes the audio manager when clicked.
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
	 * Adds a new trigger that plays an audio when clicked.
	 * 
	 * @param {AudioManagerPlayTrigger} playTrigger - The trigger that plays an audio when clicked.
	 * @returns {void}
	 */
	addPlayTrigger(playTrigger) {
		playTrigger.trigger.addEventListener("click", this);
		this.playTriggers.push(playTrigger);
		this.#togglePlayTriggers();
	}

	/**
	 * Pauses the specified background audio.
	 * 
	 * @param {string|HTMLAudioElement} nameOrAudio - The name of the background audio or the audio element to be paused.
	 * @returns {void}
	 */
	pauseBackgroundAudio(nameOrAudio) {
		const audio = this.#getBackgroundAudio(nameOrAudio);
		if (audio) {
			audio.muted = true;
			this.#addToPausedBackgroundAudio(audio);
		}
	}

	/**
	 * Play the specified background audio.
	 * 
	 * @param {string|HTMLAudioElement} nameOrAudio - The name of the background audio or the audio element to be played.
	 * @returns {void}
	 */
	playBackgroundAudio(nameOrAudio) {
		const audio = this.#getBackgroundAudio(nameOrAudio);
		if (audio) {
			audio.muted = false;
			this.#removeFromPausedBackgroundAudio(audio);
		}
	}

	/**
	 * Indicates whether the specified background audio is paused.
	 * 
	 * @param {string|HTMLAudioElement} nameOrAudio - The name of the background audio or the audio element to be checked.
	 * @returns {boolean} `true` if the background audio is paused; otherwise, `false`.
	 */
	isBackgroundAudioPaused(nameOrAudio) {
		const audio = this.#getBackgroundAudio(nameOrAudio);
		if (audio) {
			return this.#pausedBackgroundAudio.includes(audio);
		} else {
			return false;
		}
	}

	/**
	 * Removes the specified background audio from the paused background audio array.
	 * 
	 * @param {HTMLAudioElement} audio - The audio element to be removed.
	 * @returns {void}
	 */
	#removeFromPausedBackgroundAudio(audio) {
		this.#pausedBackgroundAudio = this.#pausedBackgroundAudio.filter((pausedAudio) => pausedAudio != audio);
	}

	/**
	 * Adds the specified background audio to the paused background audio array.
	 * 
	 * @param {HTMLAudioElement} audio - The audio element to be added.
	 * @returns {void}
	 */
	#addToPausedBackgroundAudio(audio) {
		if (!this.#pausedBackgroundAudio.includes(audio)) {
			this.#pausedBackgroundAudio.push(audio);
		}
	}

	/**
	 * Mutes the specified background audio.
	 * 
	 * @param {string|HTMLAudioElement} nameOrAudio - The name of the background audio or the audio element to be muted.
	 * @returns {void}
	 */
	muteBackgroundAudio(nameOrAudio) {
		const audio = this.#getBackgroundAudio(nameOrAudio);
		if (audio && !this.isBackgroundAudioPaused(audio)) audio.muted = true;
	}

	/**
	 * Unmutes the specified background audio.
	 * 
	 * @param {string|HTMLAudioElement} nameOrAudio - The name of the background audio or the audio element to be unmuted.
	 * @returns {void}
	 */
	unmuteBackgroundAudio(nameOrAudio) {
		const audio = this.#getBackgroundAudio(nameOrAudio);
		if (audio && !this.isBackgroundAudioPaused(audio)) audio.muted = false;
	}

	/**
	 * Mutes all background audio.
	 * 
	 * @returns {void}
	 */
	muteAllBackgroundAudio() {
		this.backgroundAudio.forEach((audio) => this.muteBackgroundAudio(audio));
	}

	/**
	 * Unmutes all background audio.
	 * 
	 * @returns {void}
	 */
	unmuteAllBackgroundAudio() {
		this.backgroundAudio.forEach((audio) => this.unmuteBackgroundAudio(audio));
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
	 * Adds or removes classes from the play triggers.
	 * 
	 * @returns {void}
	 */
	#togglePlayTriggers() {
		this.playTriggers.forEach((playTrigger) => {
			const isMuted = this.#isMuted && !playTrigger.forcePlay;
			playTrigger.trigger.classList.toggle(this.isMutedClass, isMuted);
		});
	}

	/**
	 * Plays or pauses the background audio elements.
	 * 
	 * @returns {void}
	 */
	#toggleBackgroundAudio() {
		this.backgroundAudio.forEach((audio) => {
			if (this.#isMuted) {
				this.#pauseBackgroundAudio(audio);
			} else {
				this.#playBackgroundAudio(audio);
			}
		});
	}

	/**
	 * Pauses the specified background audio.
	 * 
	 * @param {string|HTMLAudioElement} nameOrAudio - The name of the background audio or the audio element to be paused.
	 * @returns {void}
	 */
	#pauseBackgroundAudio(nameOrAudio) {
		const audio = this.#getBackgroundAudio(nameOrAudio);
		if (audio) {
			audio.pause();
		}
	}

	/**
	 * Plays the specified background audio.
	 * 
	 * @param {string|HTMLAudioElement} nameOrAudio - The name of the background audio or the audio element to be played.
	 * @returns {void}
	 */
	#playBackgroundAudio(nameOrAudio) {
		const audio = this.#getBackgroundAudio(nameOrAudio);
		if (audio) {
			audio.loop = 1;
			audio.play().catch((error) => {
				if (error.name == "NotAllowedError") {
					this.mute();
				}
			});
		}
	}

	/**
	 * Retrieves the background audio element with the specified name or returns the specified audio element.
	 * 
	 * @param {string|HTMLAudioElement} nameOrAudio - The name of the background audio or the audio element.
	 * @returns {HTMLAudioElement|undefined} The found audio element, or `undefined` if no audio element was found.
	 */
	#getBackgroundAudio(nameOrAudio) {
		if (nameOrAudio instanceof HTMLAudioElement) return nameOrAudio;
		return this.backgroundAudio.get(nameOrAudio);
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
		this.playTriggers.forEach((playTrigger) => {
			playTrigger.trigger.addEventListener("click", this);
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
				this.playTriggers.forEach((playTrigger) => {
					if (playTrigger.trigger == event.target) {
						this.play(playTrigger.audioName, playTrigger.forcePlay);
					}
				});
				break;
		}
	}
}

/**
 * Audio Manager Play Trigger
 * This class is designed to create a trigger that plays a fetched audio when clicked.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class AudioManagerPlayTrigger {

	/**
	 * The trigger that needs to be clicked to play the fetched audio.
	 * 
	 * @type {HTMLButtonElement}
	 */
	trigger;

	/**
	 * The name of the audio to be played.
	 * 
	 * @type {string}
	 */
	audioName;

	/**
	 * Indicates whether to play the audio even when the audio manager is muted.
	 * 
	 * @type {boolean}
	 */
	forcePlay = false;

	/**
	 * Callback function that is called after the trigger has been initialized.
	 * 
	 * @type {function(AudioManagerPlayTrigger):void|null}
	 */
	initCallback = null;

	/**
	 * Creates an audio manager play trigger.
	 * 
	 * @param {Object} options
	 * @param {HTMLButtonElement} options.trigger - The trigger that needs to be clicked to play the fetched audio.
	 * @param {string} options.audioName - The name of the audio to be played.
	 * @param {boolean} options.forcePlay - Indicates whether to play the audio even when the audio manager is muted.
	 * @param {function(AudioManagerPlayTrigger):void|null} options.initCallback - Callback function that is called after the trigger has been initialized.
	 * @returns {AudioManagerPlayTrigger}
	 */
	constructor(options) {

		// Test required options
		if (!(options.trigger instanceof HTMLButtonElement)) {
			throw "Audio manager trigger \"trigger\" must be an `HTMLButtonElement`";
		}
		if (typeof options.audioName !== "string") {
			throw "Audio manager trigger \"audioName\" must be a string";
		}

		// Set fields from options
		this.trigger = options.trigger;
		this.audioName = options.audioName;
		if ("forcePlay" in options) this.forcePlay = options.forcePlay;
		if ("initCallback" in options) this.initCallback = options.initCallback;

		// Initialize the audio manager play trigger
		if (typeof(this.initCallback) == "function") this.initCallback(this);
	}
}

export { AudioManager, AudioManagerPlayTrigger };