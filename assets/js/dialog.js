/**
 * Dialog
 * This class is designed to handle pop-up windows for displaying various types of content, including images, HTML, YouTube videos, iframes, AJAX content, and general dialog messages.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class Dialog {

	/**
	 * Represents the type of the dialog.
	 * 
	 * @type {string}
	 */
	type;

	/**
	 * Represents the source of the dialog that is loaded.
	 * 
	 * @type {string}
	 */
	source;

	/**
	 * Represents an array of trigger elements that open the dialog on click.
	 * 
	 * @type {Array<HTMLElement>}
	 */
	triggers = [];

	/**
	 * The alternate text description added to the image.
	 * 
	 * @type {string}
	 */
	description = "";

	/**
	 * Indicates whether the dialog is cancellable.
	 * 
	 * @type {boolean}
	 */
	isCancellable = true;

	/**
	 * Indicates whether the dialog is closeable.
	 * 
	 * @type {boolean}
	 */
	isCloseable = true;

	/**
	 * Custom classes added to the dialog.
	 * 
	 * @type {Array<string>}
	 */
	customClasses = [];

	/**
	 * The class added to the dialog.
	 * 
	 * @type {string}
	 */
	dialogClass = "dialog";

	/**
	 * The class added to the trigger.
	 * 
	 * @type {string}
	 */
	triggerClass = "dialog-trigger";

	/**
	 * The class added to the dialog when its type is image.
	 * 
	 * @type {string}
	 */
	dialogImageClass = "dialog--image";

	/**
	 * The class added to the dialog when its type is video.
	 * 
	 * @type {string}
	 */
	dialogVideoClass = "dialog--video";

	/**
	 * The class added to the dialog when its type is YouTube.
	 * 
	 * @type {string}
	 */
	dialogYouTubeClass = "dialog--youtube";

	/**
	 * The class added to the dialog when its type is iframe.
	 * 
	 * @type {string}
	 */
	dialogIframeClass = "dialog--iframe";

	/**
	 * The class added to the dialog when its type is ajax.
	 * 
	 * @type {string}
	 */
	dialogAjaxClass = "dialog--ajax";

	/**
	 * The class added to the close form.
	 * 
	 * @type {string}
	 */
	closeFormClass = "dialog-close-form";

	/**
	 * The class added to the dialog after it is opened.
	 * 
	 * @type {string}
	 */
	isOpenedClass = "is-opened";

	/**
	 * The class added to the trigger while the dialog is loading.
	 * 
	 * @type {string}
	 */
	isDialogLoadingClass = "is-dialog-loading";

	/**
	 * The class added to the dialog if it is closeable.
	 * 
	 * @type {string}
	 */
	isCloseableClass = "is-closeable";

	/**
	 * The label added to the close form.
	 * 
	 * @type {string}
	 */
	closeFormLabel = "Close";

	/**
	 * Callback function that is called after the dialog has been initialized.
	 * 
	 * @type {function():void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called before the dialog has been opened.
	 * 
	 * @type {function():void|null}
	 */
	beforeOpenCallback = null;

	/**
	 * Callback function that is called after the dialog has been opened.
	 * 
	 * @type {function():void|null}
	 */
	openCallback = null;

	/**
	 * Callback function that is called after the dialog has been shown.
	 * 
	 * @type {function():void|null}
	 */
	showCallback = null;

	/**
	 * Callback function that is called after the dialog has been closed.
	 * 
	 * @type {function():void|null}
	 */
	closeCallback = null;

	/**
	 * Callback function that is called after the dialog has been cancelled.
	 * 
	 * @type {function():void|null}
	 */
	cancelCallback = null;

	/**
	 * Callback function that is called after the dialog has been destroyed.
	 * 
	 * @type {function():void|null}
	 */
	destroyCallback = null;

	/**
	 * The dialog element.
	 * 
	 * @type {HTMLDialogElement|null}
	 */
	dialog = null;

	/**
	 * Form element that handles closing the dialog manually.
	 * 
	 * @type {HTMLFormElement|null}
	 */
	closeForm = null;

	/**
	 * Available dialog types.
	 * 
	 * @type {Array<string>}
	 */
	static dialogTypes = ["image", "video", "youtube", "iframe", "ajax", "dialog"];

	/**
	 * The currently opened dialog instance.
	 * 
	 * @type {Dialog|null}
	 */
	static activeInstance = null;

	/**
	 * Creates a dialog.
	 * 
	 * @param {Object} options
	 * @param {string} options.type
	 * @param {string} options.source
	 * @param {Array<HTMLElement>} options.triggers
	 * @param {string} options.description
	 * @param {boolean} options.isCancellable
	 * @param {boolean} options.isCloseable
	 * @param {Array<string>} options.customClasses
	 * @param {string} options.dialogClass
	 * @param {string} options.triggerClass
	 * @param {string} options.dialogImageClass
	 * @param {string} options.dialogVideoClass
	 * @param {string} options.dialogYouTubeClass
	 * @param {string} options.dialogIframeClass
	 * @param {string} options.dialogAjaxClass
	 * @param {string} options.closeFormClass
	 * @param {string} options.isOpenedClass
	 * @param {string} options.isDialogLoadingClass
	 * @param {string} options.isCloseableClass
	 * @param {string} options.closeFormLabel
	 * @param {function():void} options.initCallback
	 * @param {function():void} options.beforeOpenCallback
	 * @param {function():void} options.openCallback
	 * @param {function():void} options.showCallback
	 * @param {function():void} options.closeCallback
	 * @param {function():void} options.cancelCallback
	 * @param {function():void} options.destroyCallback
	 * @returns {Dialog}
	 */
	constructor(options) {

		// Test required options
		if (typeof options.type !== "string") {
			throw "Dialog \"type\" option must be a string";
		}
		if (typeof options.source !== "string") {
			throw "Dialog \"source\" option must be a string";
		}
		if (Dialog.dialogTypes.indexOf(options.type) === -1) {
			throw "Dialog type is not supported";
		}

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}

		// Initialize the dialog
		this.handleEvent = function(event) {
			this.#handleEvents(event);
		};
		this.triggers.forEach((trigger) => {
			trigger.classList.add(this.triggerClass);
			trigger.addEventListener("click", this);
		});
		if (typeof(this.initCallback) == "function") this.initCallback();
	}

	/**
	 * Opens the dialog.
	 * 
	 * @returns {void}
	 */
	open() {
		if (this == Dialog.activeInstance) return;
		if (typeof(this.beforeOpenCallback) == "function") this.beforeOpenCallback();
		Dialog.closeActiveInstance();
		Dialog.activeInstance = this;
		this.triggers.forEach((trigger) => {
			trigger.classList.add(this.isDialogLoadingClass);
		});
		switch(this.type) {
			case "image":
				this.#openImage();
				break;
			case "video":
				this.#openVideo();
				break;
			case "youtube":
				this.#openYouTube();
				break;
			case "iframe":
				this.#openIframe();
				break;
			case "ajax":
				this.#openAjax();
				break;
			default:
				this.#openDialog();
				break;
		}
		if (typeof(this.openCallback) == "function") this.openCallback();
	}

	/**
	 * Closes the dialog.
	 * 
	 * @returns {void}
	 */
	close() {
		if (!this.dialog) return;
		this.dialog.close();
	}

	/**
	 * Adds the specified element as a trigger.
	 * 
	 * @param {HTMLElement} elem
	 * @returns {void}
	 */
	addTrigger(elem) {
		elem.classList.add(this.triggerClass);
		elem.addEventListener("click", this);
		this.triggers.push(elem);
	}

	/**
	 * Destroys the dialog.
	 * 
	 * @returns {void}
	 */
	destroy() {
		if (this.dialog) {
			if (this.dialog.open) {
				this.close();
				this.#isClosed();
			}
			this.#removeDialogEvents();
			switch(this.type) {
				case "image":
					this.#destroyImage();
					break;
				case "video":
					this.#destroyVideo();
					break;
				case "youtube":
					this.#destroyYouTube();
					break;
				case "iframe":
					this.#destroyIframe();
					break;
				case "ajax":
					this.#destroyAjax();
					break;
				default:
					this.#destroyDialog();
					break;
			}
			this.dialog = null;
			this.closeForm = null;
		}
		this.triggers.forEach((trigger) => {
			trigger.classList.remove(this.triggerClass);
			trigger.removeEventListener("click", this);
		});
		if (typeof(this.destroyCallback) == "function") this.destroyCallback();
	}

	/**
	 * Opens the dialog when the type is set to image.
	 * 
	 * @returns {void}
	 */
	#openImage() {
		if (!this.dialog) {
			let image = document.createElement("img");
			image.src = this.source;
			image.alt = this.description;
			image.onload = () => {
				image.setAttribute("width", image.width);
				image.setAttribute("height", image.height);
				this.dialog = document.createElement("dialog");
				this.dialog.classList.add(this.dialogClass);
				this.dialog.classList.add(this.dialogImageClass);
				this.dialog.setAttribute('data-dialog-uid', this.source);
				this.dialog.appendChild(image);
				document.body.appendChild(this.dialog);
				this.#addDialogEvents();
				this.#show();
			};
			image.onerror = () => {
				this.#hasOpenError();
			};
		} else {
			this.#show();
		}
	}

	/**
	 * Opens the dialog when the type is set to video.
	 * 
	 * @returns {void}
	 */
	#openVideo() {
		if (!this.dialog) {
			let video = document.createElement("video");
			video.src = this.source;
			video.controls = true;
			video.onloadedmetadata = () => {
				video.setAttribute("width", video.videoWidth);
				video.setAttribute("height", video.videoHeight);
				this.dialog = document.createElement("dialog");
				this.dialog.classList.add(this.dialogClass);
				this.dialog.classList.add(this.dialogVideoClass);
				this.dialog.setAttribute('data-dialog-uid', this.source);
				this.dialog.appendChild(video);
				document.body.appendChild(this.dialog);
				this.#addDialogEvents();
				video.play();
				this.#show();
			};
			video.onerror = () => {
				this.#hasOpenError();
			};
		} else {
			let video = this.dialog.firstElementChild;
			if (video instanceof HTMLVideoElement) video.play();
			this.#show();
		}
	}

	/**
	 * Opens the dialog when the type is set to YouTube.
	 * 
	 * @returns {void}
	 */
	#openYouTube() {
		if (!this.dialog) {
			let embedUrl = this.#getYouTubeEmbedUrl(this.source);
			if (embedUrl) {
				let iframe = document.createElement("iframe");
				iframe.src = embedUrl;
				iframe.setAttribute("allow", "autoplay");
				iframe.setAttribute("frameborder", "0");
				iframe.setAttribute("allowfullscreen", "");
				iframe.setAttribute("width", "1600");
				iframe.setAttribute("height", "900");
				this.dialog = document.createElement("dialog");
				this.dialog.classList.add(this.dialogClass);
				this.dialog.classList.add(this.dialogYouTubeClass);
				this.dialog.setAttribute('data-dialog-uid', this.source);
				this.dialog.appendChild(iframe);
				document.body.appendChild(this.dialog);
				this.#addDialogEvents();
				this.#show();
			} else {
				this.#hasOpenError();
			}
		} else {
			this.#playYouTubeVideo();
			this.#show();
		}
	}

	/**
	 * Opens the dialog when the type is set to iframe.
	 * 
	 * @returns {void}
	 */
	#openIframe() {
		if (!this.dialog) {
			let iframe = document.createElement("iframe");
			iframe.src = this.source;
			iframe.setAttribute("frameborder", "0");
			this.dialog = document.createElement("dialog");
			this.dialog.classList.add(this.dialogClass);
			this.dialog.classList.add(this.dialogIframeClass);
			this.dialog.setAttribute('data-dialog-uid', this.source);
			this.dialog.appendChild(iframe);
			document.body.appendChild(this.dialog);
			this.#addDialogEvents();
			this.#show();
		} else {
			this.#show();
		}
	}

	/**
	 * Opens the dialog when the type is set to ajax.
	 * 
	 * @returns {void}
	 */
	#openAjax() {
		if (!this.dialog) {
			let request = new Request(this.source);
			fetch(request)
				.then((response) => {
					if (response.status === 200) {
						return response.text();
					} else {
						this.#hasOpenError();
					}
				})
				.then((html) => {
					this.dialog = document.createElement("dialog");
					this.dialog.classList.add(this.dialogClass);
					this.dialog.classList.add(this.dialogAjaxClass);
					this.dialog.innerHTML = html;
					this.dialog.setAttribute('data-dialog-uid', this.source);
					document.body.appendChild(this.dialog);
					this.#addDialogEvents();
					this.#show();
				})
				.catch(() => {
					this.#hasOpenError();
				});
		} else {
			this.#show();
		}
	}

	/**
	 * Opens the dialog when the type is set to dialog.
	 * 
	 * @returns {void}
	 */
	#openDialog() {
		if (!this.dialog) {
			this.dialog = document.querySelector(this.source);
			if (this.dialog) {
				this.dialog.classList.add(this.dialogClass);
				this.dialog.setAttribute('data-dialog-uid', this.source);
				this.#addDialogEvents();
				this.#show();
			} else {
				this.#hasOpenError();
			}
		} else {
			this.#show();
		}
	}

	/**
	 * Displays the dialog as a modal.
	 * 
	 * @returns {void}
	 */
	#show() {
		if (!this.dialog) return;
		if (!this.closeForm && this.isCloseable) {
			this.#createCloseForm();
			this.dialog.classList.add(this.isCloseableClass);
		}
		this.triggers.forEach((trigger) => {
			trigger.classList.remove(this.isDialogLoadingClass);
		});
		this.#addCustomClasses();
		if (this == Dialog.activeInstance) {
			this.dialog.showModal();
			if (typeof(this.showCallback) == "function") this.showCallback();
		}
	}

	/**
	 * Executes after the dialog has been opened successfully.
	 * 
	 * @returns {void}
	 */
	#isOpened() {
		if (!this.dialog) return;
		this.dialog.classList.add(this.isOpenedClass);
	}

	/**
	 * Executes after the dialog could not been loaded.
	 * 
	 * @returns {void}
	 */
	#hasOpenError() {
		this.triggers.forEach((trigger) => {
			trigger.classList.remove(this.isDialogLoadingClass);
		});
		throw "Dialog could not be opened.";
	}

	/**
	 * Executes after the dialog has been closed.
	 * 
	 * @returns {void}
	 */
	#isClosed() {
		if (!this.dialog) return;
		this.dialog.classList.remove(this.isOpenedClass);
		this.#removeCustomClasses();
		Dialog.activeInstance = null;
		switch(this.type) {
			case "image":
				this.#isImageClosed();
				break;
			case "video":
				this.#isVideoClosed();
				break;
			case "youtube":
				this.#isYouTubeClosed();
				break;
			case "iframe":
				this.#isIframeClosed();
				break;
			case "ajax":
				this.#isAjaxClosed();
				break;
			default:
				this.#isDialogClosed();
				break;
		}
		if (typeof(this.closeCallback) == "function") this.closeCallback();
	}

	/**
	 * Executes after the dialog has been cancelled.
	 * 
	 * @returns {void}
	 */
	#isCancelled() {
		if (typeof(this.cancelCallback) == "function") this.cancelCallback();
	}

	/**
	 * Executes after the dialog with the image type has been closed.
	 * 
	 * @returns {void}
	 */
	#isImageClosed() {}

	/**
	 * Executes after the dialog with the video type has been closed.
	 * 
	 * @returns {void}
	 */
	#isVideoClosed() {
		if (!this.dialog) return;
		const video = this.dialog.firstElementChild;
		if (video instanceof HTMLVideoElement) video.pause();
	}

	/**
	 * Executes after the dialog with the YouTube type has been closed.
	 * 
	 * @returns {void}
	 */
	#isYouTubeClosed() {
		this.#pauseYouTubeVideo();
	}

	/**
	 * Executes after the dialog with the iframe type has been closed.
	 * 
	 * @returns {void}
	 */
	#isIframeClosed() {}

	/**
	 * Executes after the dialog with the ajax type has been closed.
	 * 
	 * @returns {void}
	 */
	#isAjaxClosed() {}

	/**
	 * Executes after the dialog with the dialog type has been closed.
	 * 
	 * @returns {void}
	 */
	#isDialogClosed() {}

	/**
	 * Retrieves the YouTube embed URL from the specified URL.
	 * 
	 * @param {string} url
	 * @returns {string|null}
	 */
	#getYouTubeEmbedUrl(url) {
		const host = "https://www.youtube.com/embed/";
		const params = "?enablejsapi=1&autoplay=1";
		const regex = /(youtube|youtu)\.(com|be)\/(watch\?v=([\w-]+)|([\w-]+))/;
		const match = url.match(regex);
		if (match) {
			const videoId = (match[1] === "youtube") ? match[4] : match[5];
			if (videoId) {
				return host + videoId + params;
			}
		}
	}

	/**
	 * Sends a command to the YouTube JS API to play the video.
	 * 
	 * @returns {void}
	 */
	#playYouTubeVideo() {
		if (!this.dialog) return;
		const iframe = this.dialog.firstElementChild;
		if (iframe instanceof HTMLIFrameElement) {
			iframe.contentWindow.postMessage(Dialog.#youTubePlayCommand, "*");
		}
	}

	/**
	 * Sends a command to the YouTube JS API to pause the video.
	 * 
	 * @returns {void}
	 */
	#pauseYouTubeVideo() {
		if (!this.dialog) return;
		const iframe = this.dialog.firstElementChild;
		if (iframe instanceof HTMLIFrameElement) {
			iframe.contentWindow.postMessage(Dialog.#youTubePauseCommand, "*");
		}
	}

	/**
	 * Creates the close form and appends it to the end of the dialog.
	 * 
	 * @returns {void}
	 */
	#createCloseForm() {
		if (!this.dialog) return;
		let closeButton = document.createElement("button");
		this.closeForm = document.createElement("form");
		this.closeForm.setAttribute("method", "dialog");
		this.closeForm.setAttribute("aria-label", this.closeFormLabel);
		this.closeForm.setAttribute("title", this.closeFormLabel);
		this.closeForm.classList.add(this.closeFormClass);
		this.closeForm.appendChild(closeButton);
		this.dialog.appendChild(this.closeForm);
	}

	/**
	 * Adds custom classes to the dialog element.
	 * 
	 * @returns {void}
	 */
	#addCustomClasses() {
		if (!this.dialog) return;
		this.dialog.classList.add(...this.customClasses);
	}

	/**
	 * Adds custom classes from the dialog element.
	 * 
	 * @returns {void}
	 */
	#removeCustomClasses() {
		if (!this.dialog) return;
		this.dialog.classList.remove(...this.customClasses);
	}

	/**
	 * Destroys the dialog when the type is set to image.
	 * 
	 * @returns {void}
	 */
	#destroyImage() {
		if (!this.dialog) return;
		this.dialog.remove();
	}

	/**
	 * Destroys the dialog when the type is set to video.
	 * 
	 * @returns {void}
	 */
	#destroyVideo() {
		if (!this.dialog) return;
		this.dialog.remove();
	}

	/**
	 * Destroys the dialog when the type is set to YouTube.
	 * 
	 * @returns {void}
	 */
	#destroyYouTube() {
		if (!this.dialog) return;
		this.dialog.remove();
	}

	/**
	 * Destroys the dialog when the type is set to iframe.
	 * 
	 * @returns {void}
	 */
	#destroyIframe() {
		if (!this.dialog) return;
		this.dialog.remove();
	}

	/**
	 * Destroys the dialog when the type is set to ajax.
	 * 
	 * @returns {void}
	 */
	#destroyAjax() {
		if (!this.dialog) return;
		this.dialog.remove();
	}

	/**
	 * Destroys the dialog when the type is set to dialog.
	 * 
	 * @returns {void}
	 */
	#destroyDialog() {
		if (!this.dialog) return;
		this.dialog.classList.remove(this.dialogClass);
		if (this.closeForm) {
			this.closeForm.remove();
			this.dialog.classList.remove(this.isCloseableClass);
		}
	}

	/**
	 * Adds event listeners related to the dialog element.
	 * 
	 * @returns {void}
	 */
	#addDialogEvents() {
		if (!this.dialog) return;
		this.dialog.addEventListener("cancel", this);
		this.dialog.addEventListener("close", this);
		this.dialog.addEventListener("animationend", this);
	}

	/**
	 * Adds event listeners related to the dialog element.
	 * 
	 * @returns {void}
	 */
	#removeDialogEvents() {
		if (!this.dialog) return;
		this.dialog.removeEventListener("cancel", this);
		this.dialog.removeEventListener("close", this);
		this.dialog.removeEventListener("animationend", this);
	}

	/**
	 * Handle events.
	 * 
	 * @param {Event} event
	 * @returns {void}
	 */
	#handleEvents(event) {
		switch (event.type) {
			case "click":
				this.triggers.forEach((trigger) => {
					if (trigger.contains(event.target)) {
						event.preventDefault();
						this.open();
					}
				});
				break;
			case "cancel":
				if (this.dialog && event.target == this.dialog) {
					if (!this.isCancellable) {
						event.preventDefault();
					} else {
						this.#isCancelled();
					}
				}
				break;
			case "close":
				if (this.dialog && event.target == this.dialog) {
					this.#isClosed();
				}
				break;
			case "animationend":
				if (this.dialog && event.target == this.dialog && this.dialog.open) {
					this.#isOpened();
				}
				break;
		}
	}

	/**
	 * Closes the currently opened dialog instance.
	 * 
	 * @returns {void}
	 */
	static closeActiveInstance() {
		const activeInstance = Dialog.activeInstance;
		if (activeInstance && activeInstance.dialog && activeInstance.dialog.open) {
			activeInstance.close();
		}
	}

	/**
	 * Parse classes from the attribute of the specified element.
	 * 
	 * @param {HTMLElement} elem
	 * @param {string} attribute
	 * @returns {Array<string>}
	 */
	static parseCustomClasses(elem, attribute) {
		let customclassesStr = elem.getAttribute(attribute);
		return customclassesStr ? customclassesStr.split(" ") : [];
	}

	/**
	 * Command to be invoked in the YouTube iframe to play a video.
	 * 
	 * @returns {string}
	 */
	static get #youTubePlayCommand() {
		return JSON.stringify({
			"event": "command",
			"func": "playVideo",
			"args": ""
		});
	}

	/**
	 * Command to be invoked in the YouTube iframe to pause a video.
	 * 
	 * @returns {string}
	 */
	static get #youTubePauseCommand() {
		return JSON.stringify({
			"event": "command",
			"func": "pauseVideo",
			"args": ""
		});
	}
};

export { Dialog };