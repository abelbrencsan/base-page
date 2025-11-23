/**
 * Quiz
 * This class is designed to create quizzes where questions can be answered and the results can be rated.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class Quiz {

	/**
	 * Represents the wrapper element that includes all the questions.
	 * 
	 * @type {HTMLElement}
	 */
	wrapper;

	/**
	 * List of questions.
	 * 
	 * @type {Array<QuizQuestion>}
	 */
	questions;

	/**
	 * Represents the trigger that jumps to the next question when clicked.
	 * 
	 * @type {HTMLButtonElement}
	 */
	nextTrigger;

	/**
	 * Represents the trigger buttons that start or restart the quiz when clicked.
	 * 
	 * @type {Array<HTMLButtonElement>}
	 */
	startTriggers = [];

	/**
	 * Represents an indicator where the current score is displayed.
	 * 
	 * @type {HTMLElement|null}
	 */
	scoreIndicator = null;

	/**
	 * Represents an indicator where the current and total number of questions are displayed.
	 * 
	 * @type {HTMLElement|null}
	 */
	questionCountIndicator = null;

	/**
	 * Represents an indicator where the elapsed seconds are displayed since the quiz started.
	 * 
	 * @type {HTMLElement|null}
	 */
	timerIndicator = null;

	/**
	 * Represents an indicator where the quiz completion progress is displayed.
	 * 
	 * @type {HTMLProgressElement|null}
	 */
	progressIndicator = null;

	/**
	 * The class that is added to the wrapper when the quiz has started and remains until it is completed.
	 * 
	 * @type {string}
	 */
	isActiveClass = "is-active";

	/**
	 * The class that is added to the wrapper after all questions have been answered.
	 * 
	 * @type {string}
	 */
	isCompletedClass = "is-completed";

	/**
	 * The format in which the question count is displayed within the indicator.
	 * 
	 * @type {function(number,number):string}
	 */
	questionCountFormat = (current, total) => `${current}/${total}`;

	/**
	 * The delay in milliseconds after the quiz is re-enabled after a missing or invalid answer.
	 * 
	 * @type {number}
	 */
	disableDelay = 400;

	/**
	 * Callback function that is called after the quiz has been initialized.
	 * 
	 * @type {function():void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called after the quiz has been started.
	 * 
	 * @type {function():void|null}
	 */
	startCallback = null;

	/**
	 * Callback function that is called after a question is answered.
	 * 
	 * @type {function(QuizQuestionResult):void|null}
	 */
	questionAnsweredCallback = null;

	/**
	 * Callback function that is called after a question is missing or invalid answer.
	 * 
	 * @type {function(QuizQuestion):void|null}
	 */
	questionErrorCallback = null;

	/**
	 * Callback function that is called after the quiz has been completed.
	 * 
	 * @type {function(number,number,Array<QuizQuestionResult>):void|null}
	 */
	completeCallback = null;

	/**
	 * Callback function that is called after the quiz has been destroyed.
	 * 
	 * @type {function():void|null}
	 */
	destroyCallback = null;

	/**
	 * List of results of the answered questions.
	 * 
	 * @type {Array<QuizQuestionResult>}
	 */
	questionResults = [];

	/**
	 * The currently active question.
	 * 
	 * @type {number|null}
	 */
	activeIndex = null;

	/**
	 * The elapsed seconds since the quiz started.
	 * 
	 * @type {number}
	 */
	timer = 0;

	/**
	 * The ID of the interval created to count the elapsed seconds since the start.
	 * 
	 * @type {number|null}
	 */
	intervalId = null;

	/**
	 * Indicates whether the timer is paused.
	 * 
	 * @type {boolean}
	 */
	isTimerPaused = false;

	/**
	 * Indicates whether the quiz is temporarily disabled.
	 * 
	 * @type {boolean}
	 */
	isDisabled = false;

	/**
	 * Creates a quiz.
	 * 
	 * @param {Object} options
	 * @param {HTMLElement} options.wrapper
	 * @param {Array<QuizQuestion>} options.questions
	 * @param {HTMLButtonElement} options.nextTrigger
	 * @param {Array<HTMLButtonElement>} options.startTriggers
	 * @param {HTMLElement|null} options.scoreIndicator
	 * @param {HTMLElement|null} options.questionCountIndicator
	 * @param {HTMLElement|null} options.timerIndicator
	 * @param {HTMLProgressElement|null} options.progressIndicator
	 * @param {string} options.isActiveClass
	 * @param {string} options.isCompletedClass
	 * @param {function(number,number):string} options.questionCountFormat
	 * @param {number} options.disableDelay
	 * @param {function():void} options.initCallback
	 * @param {function():void} options.startCallback
	 * @param {function(QuizQuestionResult):void|null} options.questionAnsweredCallback
	 * @param {function(QuizQuestion):void|null} options.questionErrorCallback
	 * @param {function(number,number,Array<QuizQuestionResult>):void} options.completeCallback
	 * @param {function():void} options.destroyCallback
	 * @returns {Quiz}
	 */
	constructor(options) {

		// Test required options
		if (!(options.wrapper instanceof HTMLElement)) {
			throw "Quiz \"wrapper\" must be an `HTMLElement`";
		}
		if (!(options.questions instanceof Array)) {
			throw 'Quiz \"questions\" must be an `array`';
		}
		if (options.questions.length == 0) {
			throw 'Quiz \"questions\" must include at least one question';
		}
		options.questions.forEach((question) => {
			if (!(question instanceof QuizQuestion)) {
				throw 'Quiz question must be a `QuizQuestion`';
			}
		});
		if (!(options.nextTrigger instanceof HTMLButtonElement)) {
			throw "Quiz \"nextTrigger\" must be an `HTMLButtonElement`";
		}

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}

		// Initialize the quiz
		this.handleEvent = (event) => this.#handleEvents(event);
		this.#addEvents();
		this.questions.forEach((question) => question.wrapper.setAttribute("tabindex", "0"));
		if (typeof(this.initCallback) == "function") this.initCallback();
	}

	/**
	 * Starts the quiz with the first question.
	 * 
	 * @returns {void}
	 */
	start() {
		if (this.isDisabled) return;
		this.reset();
		this.wrapper.classList.add(this.isActiveClass);
		this.#startTimer();
		this.#setQuestionAsActive(0);
		if (typeof(this.startCallback) == "function") this.startCallback();
	}

	/**
	 * Processes the current question and navigates to the next one or completes the quiz.
	 * 
	 * @returns {void}
	 */
	goToNextQuestion() {
		if (!this.isActive || this.isDisabled) return;
		let currentQuestion = this.getQuestionByIndex(this.activeIndex);
		if (currentQuestion) {
			currentQuestion.reset(true);
			let questionResult = this.#processQuestion(currentQuestion);
			if (questionResult) {
				this.questionResults.push(questionResult);
				if (typeof(this.questionAnsweredCallback) == "function") this.questionAnsweredCallback(questionResult);
				if (this.activeIndex + 1 < this.questions.length) {
					this.#setQuestionAsActive(this.activeIndex + 1);
				} else {
					this.#complete();
				}
			} else {
				currentQuestion.wrapper.focus();
				if (typeof(this.questionErrorCallback) == "function") this.questionErrorCallback(currentQuestion);
			}
		}
	}

	/**
	 * Retrieves the question at the specified index.
	 * 
	 * @returns {QuizQuestion|undefined}
	 */
	getQuestionByIndex(index) {
		return this.questions.find((question, i) => i == index);
	}

	/**
	 * Pauses the timer.
	 * 
	 * @returns {void}
	 */
	pauseTimer() {
		this.isTimerPaused = true;
	}

	/**
	 * Resumes the paused timer.
	 * 
	 * @returns {void}
	 */
	resumeTimer() {
		this.isTimerPaused = false;
	}

	/**
	 * Resets the quiz.
	 * 
	 * @returns {void}
	 */
	reset() {
		this.#resetState();
		this.wrapper.classList.remove(this.isActiveClass);
		this.wrapper.classList.remove(this.isCompletedClass);
		this.nextTrigger.removeAttribute("disabled");
		this.questions.forEach((question) => {
			question.reset();
			question.uncheckOptions();
		});
	}

	/**
	 * Destroys the quiz.
	 * 
	 * @returns {void}
	 */
	destroy() {
		this.reset();
		this.#removeEvents();
		this.questions.forEach((question) => question.wrapper.removeAttribute("tabindex"));
		this.questions.forEach((question) => question.destroy());
		if (typeof(this.destroyCallback) == "function") this.destroyCallback();
	}

	/**
	 * Indicates whether the quiz has started but has not been completed yet.
	 * 
	 * @returns {boolean}
	 */
	get isActive() {
		return this.activeIndex !== null && this.intervalId !== null;
	}

	/**
	 * Retireves the current score.
	 * 
	 * @type {number}
	 */
	get score() {
		return this.questionResults.reduce((acc, result) => result.points + acc, 0);
	}

	/**
	 * Processes the specified question if it is answered and valid.
	 * 
	 * @param {QuizQuestion} question
	 * @returns {QuizQuestionResult|undefined}
	 */
	#processQuestion(question) {
		if (question.checkedOptions.length) {
			let questionResult = this.#evaluateQuestion(question);
			if (questionResult) {
				question.isAnswered();
				return questionResult;
			} else {
				question.isAnswerInvalid();
				this.#disableTemporary(question);
			}
		} else {
			question.isAnswerMissing();
			this.#disableTemporary(question);
		}
	}

	/**
	 * Evaluates the specified question.
	 * 
	 * @param {QuizQuestion} question
	 * @returns {QuizQuestionResult|undefined}
	 */
	#evaluateQuestion(question) {
		if (question.points < question.requiredPoints) return;
		return new QuizQuestionResult({
			question: question,
			checkedOptions: question.checkedOptions
		});
	}

	/**
	 * Sets the question at the specified index as active.
	 * 
	 * @param {number} index
	 * @returns {void}
	 */
	#setQuestionAsActive(index) {
		this.questions.forEach((question, i) => {
			question.reset();
			if (i == index) {
				question.setAsActive();
				question.wrapper.focus();
				this.activeIndex = index;
				this.#updateIndicators();
			}
		});
	}

	/**
	 * Completes the quiz.
	 * 
	 * @returns {void}
	 */
	#complete() {
		this.wrapper.classList.remove(this.isActiveClass);
		this.wrapper.classList.add(this.isCompletedClass);
		this.questions.forEach((question) => question.reset());
		this.activeIndex = null;
		this.#updateIndicators();
		this.#stopTimer();
		if (typeof(this.completeCallback) == "function") this.completeCallback(this.score, this.timer, this.questionResults);
	}

	/**
	 * Disables the quiz temporary.
	 * 
	 * @param {QuizQuestion} question
	 * @returns {void}
	 */
	#disableTemporary(question) {
		this.isDisabled = true;
		this.nextTrigger.setAttribute("disabled", "disabled");
		setTimeout(() => {
			this.isDisabled = false;
			this.nextTrigger.removeAttribute("disabled");
			question.wrapper.classList.remove(question.isAnswerMissingClass);
			question.wrapper.classList.remove(question.isAnswerInvalidClass);
		}, this.disableDelay);
	}

	/**
	 * Starts the timer.
	 * 
	 * @returns {void}
	 */
	#startTimer() {
		if (this.intervalId) return;
		this.intervalId = setInterval(() => {
			if (!this.isTimerPaused) {
				this.timer++;
				this.#updateTimerIndicator();
			}
		}, 1000);
	}

	/**
	 * Stops the timer.
	 * 
	 * @returns {void}
	 */
	#stopTimer() {
		if (!this.intervalId) return;
		clearInterval(this.intervalId);
		this.intervalId = null;
		this.isTimerPaused = false;
	}

	/**
	 * Updates the indicators.
	 * 
	 * @returns {void}
	 */
	#updateIndicators() {
		this.#updateScoreIndicator();
		this.#updateQuestionCountIndicator();
		this.#updateTimerIndicator();
		this.#updateProgressIndicator();
	}

	/**
	 * Displays the current score within the score indicator.
	 * 
	 * @returns {void}
	 */
	#updateScoreIndicator() {
		if (!this.scoreIndicator) return;
		this.scoreIndicator.innerHTML = this.score;
	}

	/**
	 * Displays the current and the total number of questions within the question count indicator.
	 * 
	 * @returns {void}
	 */
	#updateQuestionCountIndicator() {
		if (!this.questionCountIndicator) return;
		this.questionCountIndicator.innerHTML = this.questionCountFormat(this.activeIndex + 1, this.questions.length);
	}

	/**
	 * Displays the current elapsed seconds since the quiz started.
	 * 
	 * @returns {void}
	 */
	#updateTimerIndicator() {
		if (!this.timerIndicator) return;
		this.timerIndicator.innerHTML = this.timer;
	}

	/**
	 * Displays the current quiz completion progress.
	 * 
	 * @returns {void}
	 */
	#updateProgressIndicator() {
		if (!this.progressIndicator) return;
		this.progressIndicator.value = this.questionResults.length;
		this.progressIndicator.max = this.questions.length;
	}

	/**
	 * Resets the current state of the quiz and stops the timer.
	 * 
	 * @returns {void}
	 */
	#resetState() {
		this.questionResults = [];
		this.activeIndex = null;
		this.timer = 0;
		this.isDisabled = false;
		this.isTimerPaused = false;
		this.#stopTimer();
		this.#updateIndicators();
	}

	/**
	 * Adds event listeners related to the quiz.
	 * 
	 * @returns {void}
	 */
	#addEvents() {
		this.nextTrigger.addEventListener("click", this);
		this.startTriggers.forEach((startTrigger) => {
			startTrigger.addEventListener("click", this);
		});
	}

	/**
	 * Removes event listeners related to the quiz.
	 * 
	 * @returns {void}
	 */
	#removeEvents() {
		this.nextTrigger.removeEventListener("click", this);
		this.startTriggers.forEach((startTrigger) => {
			startTrigger.removeEventListener("click", this);
		});
	}

	/**
	 * Handles events.
	 * 
	 * @param {Event} event
	 * @returns {void}
	 */
	#handleEvents(event) {
		switch (event.type) {
			case "click":
				if (this.nextTrigger == event.target) {
					this.goToNextQuestion();
				} else if (this.startTriggers.includes(event.target)) {
					this.start();
				}
				break;
		}
	}
}

/**
 * Quiz question
 * This class is designed to create a question within a quiz.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class QuizQuestion {

	/**
	 * Represents the wrapper element that includes the options for the question.
	 * 
	 * @type {HTMLElement}
	 */
	wrapper;

	/**
	 * List of options for the question.
	 * 
	 * @type {Array<QuizQuestionOption>}
	 */
	options;

	/**
	 * The minimum points required to pass the question; otherwise, it becomes invalid.
	 * 
	 * @type {number}
	 */
	requiredPoints = 0;

	/**
	 * The class that is added to the question wrapper when it is active.
	 * 
	 * @type {string}
	 */
	isActiveClass = "is-active";

	/**
	 * The class that is added to the wrapper when the question is processed and no option is selected as the answer.
	 * 
	 * @type {string}
	 */
	isAnswerMissingClass = "is-missing";

	/**
	 * The class added to the wrapper when the question is processed and the points are below the required threshold.
	 * 
	 * @type {string}
	 */
	isAnswerInvalidClass = "is-invalid";

	/**
	 * Callback function that is called after the question has been initialized.
	 * 
	 * @type {function():void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called after the question has been answered.
	 * 
	 * @type {function(QuizQuestionResult):void|null}
	 */
	answeredCallback = null;

	/**
	 * Callback function that is called after the question is processed and no option is selected as the answer.
	 * 
	 * @type {function():void|null}
	 */
	missingAnswerCallback = null;

	/**
	 * Callback function that is called after the question is processed and the points are below the required threshold.
	 * 
	 * @type {function():void|null}
	 */
	invalidAnswerCallback = null;

	/**
	 * Callback function that is called after the question has been destroyed.
	 * 
	 * @type {function():void|null}
	 */
	destroyCallback = null;

	/**
	 * Creates a quiz question.
	 * 
	 * @param {Object} options
	 * @param {HTMLElement} options.wrapper
	 * @param {Array<QuizQuestionOption>} options.options
	 * @param {number} options.requiredPoints
	 * @param {string} options.isActiveClass
	 * @param {string} options.isAnswerMissingClass
	 * @param {string} options.isAnswerInvalidClass
	 * @param {function():void} options.initCallback
	 * @param {function(QuizQuestionResult):void|null} options.answeredCallback
	 * @param {function():void} options.missingAnswerCallback
	 * @param {function():void} options.invalidAnswerCallback
	 * @param {function():void} options.destroyCallback
	 * @returns {QuizQuestion}
	 */
	constructor(options) {

		// Test required options
		if (!(options.wrapper instanceof HTMLElement)) {
			throw "Quiz question \"wrapper\" must be an `HTMLElement`";
		}
		if (!(options.options instanceof Array)) {
			throw 'Quiz question \"options\" must be an `array`';
		}
		if (options.options.length == 0) {
			throw 'Quiz question \"options\" must include at least one option';
		}
		options.options.forEach((option) => {
			if (!(option instanceof QuizQuestionOption)) {
				throw 'Quiz question must be a `QuizQuestionOption`';
			}
		});

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}

		// Initialize the quiz question
		if (typeof(this.initCallback) == "function") this.initCallback();
	}

	/**
	 * Sets the question as active.
	 * 
	 * @returns {void}
	 */
	setAsActive() {
		this.wrapper.classList.add(this.isActiveClass);
	}

	/**
	 * Unchecks all options within the question.
	 * 
	 * @returns {void}
	 */
	uncheckOptions() {
		this.options.forEach((option) => option.uncheck());
	}

	/**
	 * Executes when the question is processed and answered.
	 * 
	 * @returns {void}
	 */
	isAnswered() {
		if (typeof(this.answeredCallback) == "function") this.answeredCallback();
	}

	/**
	 * Executes when the question is processed and no option is selected as the answer.
	 * 
	 * @returns {void}
	 */
	isAnswerMissing() {
		this.wrapper.classList.add(this.isAnswerMissingClass);
		if (typeof(this.missingAnswerCallback) == "function") this.missingAnswerCallback();
	}

	/**
	 * Executes when the question is processed and the points are below the required threshold.
	 * 
	 * @returns {void}
	 */
	isAnswerInvalid() {
		this.wrapper.classList.add(this.isAnswerInvalidClass);
		if (typeof(this.invalidAnswerCallback) == "function") this.invalidAnswerCallback();
	}

	/**
	 * Resets the question.
	 * 
	 * @param {boolean} keepActive
	 * @returns {void}
	 */
	reset(keepActive = false) {
		if (!keepActive) this.wrapper.classList.remove(this.isActiveClass);
		this.wrapper.classList.remove(this.isAnswerMissingClass);
		this.wrapper.classList.remove(this.isAnswerInvalidClass);
	}

	/**
	 * Destroys the question.
	 * 
	 * @returns {void}
	 */
	destroy() {
		this.reset();
		this.options.forEach((option) => option.destroy());
		if (typeof(this.destroyCallback) == "function") this.destroyCallback();
	}

	/**
	 * Retrieves the checked options.
	 * 
	 * @returns {Array<QuizQuestionOption>}
	 */
	get checkedOptions() {
		return this.options.filter((option) => option.input.checked);
	}

	/**
	 * Retrieves the total points for the checked options.
	 * 
	 * @returns {number}
	 */
	get points() {
		return this.checkedOptions.reduce((acc, option) => option.points + acc, 0);
	}
}

/**
 * Quiz question option
 * This class is designed to create an option for a question within a quiz.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class QuizQuestionOption {

	/**
	 * Represents the checkbox or radio input whose value is added to the score when the question is processed.
	 * 
	 * @type {HTMLInputElement}
	 */
	input;

	/**
	 * Callback function that is called after the option has been initialized.
	 * 
	 * @type {function():void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called after the option has been destroyed.
	 * 
	 * @type {function():void|null}
	 */
	destroyCallback = null;

	/**
	 * Creates a quiz question option.
	 * 
	 * @param {Object} options
	 * @param {HTMLInputElement} options.input
	 * @param {function():void} options.initCallback
	 * @param {function():void} options.destroyCallback
	 * @returns {QuizQuestionOption}
	 */
	constructor(options) {

		// Test required options
		if (!(options.input instanceof HTMLInputElement)) {
			throw "Quiz question option \"input\" must be an `HTMLInputElement`";
		}

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}

		// Initialize the quiz question option
		if (typeof(this.initCallback) == "function") this.initCallback();
	}

	/**
	 * Unchecks the checkbox or radio input.
	 * 
	 * @returns {void}
	 */
	uncheck() {
		this.input.checked = false;
	}

	/**
	 * Destroys the option.
	 * 
	 * @returns {void}
	 */
	destroy() {
		if (typeof(this.destroyCallback) == "function") this.destroyCallback();
	}

	/**
	 * Retrieves the points for the option.
	 * 
	 * @returns {number}
	 */
	get points() {
		return parseFloat(this.input.value);
	}
}

/**
 * Quiz question result
 * This class is designed to represent the result of a question within a quiz.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class QuizQuestionResult {

	/**
	 * The question which is answered.
	 * 
	 * @type {QuizQuestion}
	 */
	question;

	/**
	 * The options that were checked when the question was processed.
	 * 
	 * @type {Array<QuizQuestionOption>}
	 */
	checkedOptions;

	/**
	 * Creates a quiz question result.
	 * 
	 * @param {Object} options
	 * @param {QuizQuestion} options.question
	 * @param {Array<QuizQuestionOption>} options.checkedOptions
	 * @returns {QuizQuestionResult}
	 */
	constructor(options) {

		// Test required options
		if (!(options.question instanceof QuizQuestion)) {
			throw 'Quiz question result \"question\" must be a `QuizQuestion`';
		}
		if (!(options.checkedOptions instanceof Array)) {
			throw 'Quiz question result \"checkedOptions\" must be an `array`';
		}
		if (options.checkedOptions.length == 0) {
			throw 'Quiz question result \"checkedOptions\" must include at least one option';
		}
		options.checkedOptions.forEach((option, index) => {
			if (!(option instanceof QuizQuestionOption)) {
				throw 'Quiz question result option must be a `QuizQuestionOption`';
			}
		});

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}
	}

	/**
	 * Retrieves the total points for the checked options.
	 * 
	 * @returns {number}
	 */
	get points() {
		return this.checkedOptions.reduce((acc, option) => option.points + acc, 0);
	}
}

export { Quiz, QuizQuestion, QuizQuestionOption, QuizQuestionResult };