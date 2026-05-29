/**
 * Calendar
 * This class is designed to create dynamic calendars from which a date can be selected.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class Calendar {

	/**
	 * The wrapper element.
	 * 
	 * @type {HTMLElement}
	 */
	wrapper;

	/**
	 * The element to which day buttons are appended.
	 * 
	 * @type {HTMLElement}
	 */
	dayWrapper;

	/**
	 * The select element in which the active year can be changed.
	 * 
	 * @type {HTMLSelectElement}
	 */
	yearSelector;

	/**
	 * The select element in which the active month can be changed.
	 * 
	 * @type {HTMLSelectElement}
	 */
	monthSelector;

	/**
	 * The button element that sets the active year and month to the previous month when clicked.
	 * 
	 * @type {HTMLButtonElement}
	 */
	prevMonthTrigger;

	/**
	 * The button element that sets the active year and month to the next month when clicked.
	 * 
	 * @type {HTMLButtonElement}
	 */
	nextMonthTrigger;

	/**
	 * Included intervals during which the date can be selected.
	 * 
	 * @type {CalendarInterval[]}
	 */
	intervals;

	/**
	 * Excluded Intervals during which the date cannot be selected.
	 * 
	 * @type {CalendarInterval[]}
	 */
	excludedIntervals = [];

	/**
	 * The class that is added to the day buttons.
	 * 
	 * @type {string}
	 */
	dayButtonClass = "calendar-day";

	/**
	 * The class that is added to the day buttons for the trailing days of the previous month.
	 * 
	 * @type {string}
	 */
	isPrevMonthClass = "is-prev-month";

	/**
	 * The class that is added to the day buttons for the leading days of the next month.
	 * 
	 * @type {string}
	 */
	isNextMonthClass = "is-next-month";

	/**
	 * The class that is added to the day button for the current day.
	 * 
	 * @type {string}
	 */
	isTodayClass = "is-today";

	/**
	 * The class that is added to the day button for the selected date.
	 * 
	 * @type {string}
	 */
	isSelectedClass = "is-selected";

	/**
	 * The name of the attribute added to day buttons and whose value contains the date.
	 * 
	 * @type {string}
	 */
	dayButtonAttribute = "data-calendar-date";

	/**
	 * The button element that sets the active year and month to the current year and month when clicked.
	 * 
	 * @type {HTMLButtonElement|null}
	 */
	currentMonthTrigger = null;

	/**
	 * Callback function that is called after the calendar has been initialized.
	 * 
	 * @type {function():void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called after the date has been selected.
	 * 
	 * @type {function(Temporal.PlainDate):void|null}
	 */
	selectCallback = null;

	/**
	 * Callback function that is called after the selected date has been reset.
	 * 
	 * @type {function():void|null}
	 */
	resetCallback = null;

	/**
	 * The active year and month shown by the calendar.
	 * 
	 * @type {Temporal.PlainYearMonth}
	 */
	activeYearMonth;

	/**
	 * The selected date.
	 * 
	 * @type {Temporal.PlainDate|null}
	 */
	selectedDate = null;

	/**
	 * The x-coordinate of the swipe at start.
	 * 
	 * @type {number|null}
	 */
	#xDown = null;

	/**
	 * The y-coordinate of the swipe at start.
	 * 
	 * @type {number|null}
	 */
	#yDown = null;

	/**
	 * Retrieves the current date.
	 * 
	 * @type {Temporal.PlainDate}
	 */
	get today() {
		return Temporal.Now.plainDateISO();
	}

	/**
	 * Retrieves the year and month of the current date.
	 * 
	 * @type {Temporal.PlainYearMonth}
	 */
	get currentYearMonth() {
		return Temporal.Now.plainDateISO().toPlainYearMonth();
	}

	/**
	 * Retrieves the earliest date from the interval start dates.
	 * 
	 * @type {Temporal.PlainDate}
	 */
	get minDate() {
		return this.intervals.reduce((acc, interval) => {
			const isEarlier = Temporal.PlainDate.compare(interval.from, acc) < 0;
			return isEarlier ? interval.from : acc;
		}, this.intervals[0].from);
	}

	/**
	 * Retrieves the latest date from the interval end dates.
	 * 
	 * @type {Temporal.PlainDate}
	 */
	get maxDate() {
		return this.intervals.reduce((acc, interval) => {
			const isLater = Temporal.PlainDate.compare(interval.to, acc) > 0;
			return isLater ? interval.to : acc;
		}, this.intervals[0].to);
	}

	/**
	 * Creates a calendar.
	 * 
	 * @param {Object} options
	 * @param {HTMLElement} options.wrapper - The wrapper element.
	 * @param {HTMLElement} options.dayWrapper - The element to which day buttons are appended.
	 * @param {HTMLSelectElement} options.yearSelector - The select element in which the active year can be changed.
	 * @param {HTMLSelectElement} options.monthSelector - The select element in which the active month can be changed.
	 * @param {HTMLButtonElement} options.prevMonthTrigger - The button element that sets the active year and month to the previous month when clicked.
	 * @param {HTMLButtonElement} options.nextMonthTrigger - The button element that sets the active year and month to the next month when clicked.
	 * @param {CalendarInterval[]} options.intervals - Included intervals during which the date can be selected.
	 * @param {CalendarInterval[]} options.excludedIntervals - Excluded Intervals during which the date cannot be selected.
	 * @param {string} options.dayButtonClass - The class that is added to the day buttons.
	 * @param {string} options.isPrevMonthClass - The class that is added to the day buttons for the trailing days of the previous month.
	 * @param {string} options.isNextMonthClass - The class that is added to the day buttons for the leading days of the next month.
	 * @param {string} options.isTodayClass - The class that is added to the day button for the current day.
	 * @param {string} options.isSelectedClass - The class that is added to the day button for the selected date.
	 * @param {string} options.dayButtonAttribute - The name of the attribute added to day buttons and whose value contains the date.
	 * @param {HTMLButtonElement|null} options.currentMonthTrigger - The button element that sets the active year and month to the current year and month when clicked.
	 * @param {function():void} options.initCallback - Callback function that is called after the calendar has been initialized.
	 * @param {function(Temporal.PlainDate):void} options.selectCallback - Callback function that is called after the date has been selected.
	 * @param {function():void} options.resetCallback - Callback function that is called after the selected date has been reset.
	 * @returns {Calendar}
	 */
	constructor(options) {

		// Test required options
		if (!(options.wrapper instanceof HTMLElement)) {
			throw new Error("Calendar \"wrapper\" must be an `HTMLElement`");
		}
		if (!(options.dayWrapper instanceof HTMLElement)) {
			throw new Error("Calendar \"dayWrapper\" must be an `HTMLElement`");
		}
		if (!(options.yearSelector instanceof HTMLSelectElement)) {
			throw new Error("Calendar \"yearSelector\" must be an `HTMLSelectElement`");
		}
		if (!(options.monthSelector instanceof HTMLSelectElement)) {
			throw new Error("Calendar \"monthSelector\" must be an `HTMLSelectElement`");
		}
		if (!(options.prevMonthTrigger instanceof HTMLButtonElement)) {
			throw new Error("Calendar \"prevMonthTrigger\" must be an `HTMLButtonElement`");
		}
		if (!(options.nextMonthTrigger instanceof HTMLButtonElement)) {
			throw new Error("Calendar \"nextMonthTrigger\" must be an `HTMLButtonElement`");
		}
		if (!(options.intervals instanceof Array)) {
			throw new Error("Calendar \"intervals\" must be an `array`");
		}
		if (!options.intervals.length) {
			throw new Error("Calendar must include at least one interval.");
		}

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}

		// Initialize the calendar
		this.handleEvent = (event) => this.#handleEvents(event);
		this.#initCurrentMonthTriggerAvailability();
		this.#createYearMonthOptions();
		this.#addEvents();
		this.goToCurrentYearMonth();
		if (typeof(this.initCallback) == "function") this.initCallback();
	}

	/**
	 * Sets the calendar's active year and month to the current year and month.
	 * 
	 * @returns {void}
	 */
	goToCurrentYearMonth() {
		this.goToYearMonth(this.currentYearMonth);
	}

	/**
	 * Sets the calendar's active year and month to the selected date's year and month.
	 * 
	 * @returns {void}
	 */
	goToSelectedYearMonth() {
		const yearMonth = this.selectedDate.toPlainYearMonth();
		this.goToYearMonth(yearMonth);
	}

	/**
	 * Sets the calendar's active year and month to the previous month.
	 * 
	 * @returns {void}
	 */
	goToPrevMonth() {
		const yearMonth = this.activeYearMonth.subtract({ months: 1 });
		this.goToYearMonth(yearMonth);
	}

	/**
	 * Sets the calendar's active year and month to the next month.
	 * 
	 * @returns {void}
	 */
	goToNextMonth() {
		const yearMonth = this.activeYearMonth.add({ months: 1 });
		this.goToYearMonth(yearMonth);
	}

	/**
	 * Sets the calendar's active year and month to the specified year and month.
	 * 
	 * @param {Temporal.PlainYearMonth} yearMonth - The year and month to be set.
	 * @returns {void}
	 */
	goToYearMonth(yearMonth) {
		this.activeYearMonth = yearMonth;
		this.#clampActiveYearMonth();
		this.#updateMonthTriggersAvailability();
		this.#updateMonthOptionsAvailability();
		this.#syncYearMonthSelectors();
		this.#renderActiveYearMonth();
	}

	/**
	 * Sets the specified date as the selected date.
	 * 
	 * @param {Temporal.PlainDate} date - The date to be selected.
	 * @returns {void}
	 */
	selectDate(date) {
		this.#validateDate(date);
		this.selectedDate = date;
		this.goToSelectedYearMonth();
		if (typeof(this.selectCallback) == "function") this.selectCallback(this.selectedDate);
	}

	/**
	 * Resets the selected date.
	 * 
	 * @returns {void}
	 */
	resetSelectedDate() {
		this.selectedDate = null;
		this.#renderActiveYearMonth();
		if (typeof(this.resetCallback) == "function") this.resetCallback();
	}

	/**
	 * Clamps the active year and month to the range between the earliest and latest year and month.
	 * 
	 * @returns {void}
	 */
	#clampActiveYearMonth() {
		const minYearMonth = this.minDate.toPlainYearMonth();
		const maxYearMonth = this.maxDate.toPlainYearMonth();
		if (Temporal.PlainYearMonth.compare(maxYearMonth, this.activeYearMonth) < 0) {
			this.activeYearMonth = maxYearMonth;
		}
		else if (Temporal.PlainYearMonth.compare(minYearMonth, this.activeYearMonth) > 0) {
			this.activeYearMonth = minYearMonth;
		}
	}

	/**
	 * Validates that the specified date is between the minimum and maximum allowed selectable dates.
	 * 
	 * @param {Temporal.PlainDate} date - The date to be validated.
	 * @returns {void}
	 * @throws {Error} Thrown if the date is not between the minimum and maximum selectable dates.
	 */
	#validateDate(date) {
		const minDate = this.minDate;
		const maxDate = this.maxDate;
		if (Temporal.PlainDate.compare(maxDate, date) < 0) {
			throw new Error(`Selected date must be on ${maxDate} or earlier`);
		}
		if (Temporal.PlainDate.compare(minDate, date) > 0) {
			throw new Error(`Selected date must be on ${minDate} or later`);
		}
	}

	/**
	 * Disables or enables the next and previous month triggers according to the active year and month.
	 * 
	 * @returns {void}
	 */
	#updateMonthTriggersAvailability() {
		const minYearMonth = this.minDate.toPlainYearMonth();
		const maxYearMonth = this.maxDate.toPlainYearMonth();
		this.nextMonthTrigger.removeAttribute("disabled");
		this.prevMonthTrigger.removeAttribute("disabled");
		if (Temporal.PlainYearMonth.compare(maxYearMonth, this.activeYearMonth) <= 0) {
			this.nextMonthTrigger.setAttribute("disabled", "disabled");
		}
		if (Temporal.PlainYearMonth.compare(minYearMonth, this.activeYearMonth) >= 0) {
			this.prevMonthTrigger.setAttribute("disabled", "disabled");
		}
	}

	/**
	 * Disables or enables the month options according to the active year and month.
	 * 
	 * @returns {void}
	 */
	#updateMonthOptionsAvailability() {
		const minYearMonth = this.minDate.toPlainYearMonth();
		const maxYearMonth = this.maxDate.toPlainYearMonth();
		Array.from(this.monthSelector.options).forEach((option) => {
			const year = this.activeYearMonth.year;
			const month = parseInt(option.value);
			const yearMonth = new Temporal.PlainYearMonth(year, month);
			option.removeAttribute("disabled");
			if (Temporal.PlainYearMonth.compare(maxYearMonth, yearMonth) < 0) {
				option.setAttribute("disabled", "disabled");
			}
			if (Temporal.PlainYearMonth.compare(minYearMonth, yearMonth) > 0) {
				option.setAttribute("disabled", "disabled");
			}
		});
	}

	/**
	 * Synchronizes the year and month selectors to match the active year and month.
	 * 
	 * @returns {void}
	 */
	#syncYearMonthSelectors() {
		this.yearSelector.value = this.activeYearMonth.year;
		this.monthSelector.value = this.activeYearMonth.month;
	}

	/**
	 * Renders the calendar's active year and month.
	 * 
	 * @returns {void}
	 */
	#renderActiveYearMonth() {
		this.dayWrapper.replaceChildren();
		const firstDay = this.activeYearMonth.toPlainDate({ day: 1 });
		const lastDay = this.activeYearMonth.toPlainDate({ day: this.activeYearMonth.daysInMonth });
		const dateFrom = firstDay.subtract({ days: firstDay.dayOfWeek - 1 });
		const dateTo = lastDay.add({ days: 7 - lastDay.dayOfWeek });
		const dayCount = dateTo.since(dateFrom).days;
		for (let i = 0; i <= dayCount; i++) {
			const date = dateFrom.add({ days: i });
			const elem = this.#createDayButton(date);
			if (Temporal.PlainDate.compare(date, firstDay) == -1) {
				elem.classList.add(this.isPrevMonthClass);
			}
			if (Temporal.PlainDate.compare(date, lastDay) == 1) {
				elem.classList.add(this.isNextMonthClass);
			}
			this.dayWrapper.append(elem);
		}
	}

	/**
	 * Creates and retrieves a day button that represents the specified date.
	 * 
	 * @param {Temporal.PlainDate} date - The date to be represented.
	 * @returns {HTMLButtonElement} The created day button.
	 */
	#createDayButton(date) {
		const button = document.createElement("button");
		button.type = "button";
		button.innerText = this.#padValue(date.day);
		button.classList.add(this.dayButtonClass);
		button.setAttribute(this.dayButtonAttribute, date);
		button.setAttribute("aria-label", date);
		button.setAttribute("disabled", "disabled");
		this.#updateIntervalsAvailability(button, date);
		this.#updateExcludedIntervalsAvailability(button, date);
		if (Temporal.PlainDate.compare(date, this.today) == 0) {
			button.classList.add(this.isTodayClass);
		}
		if (this.selectedDate && this.selectedDate.equals(date)) {
			button.classList.add(this.isSelectedClass);
		}
		return button;
	}

	/**
	 * Disables the specified day button if the date is not within the available intervals.
	 * 
	 * @param {HTMLButtonElement} button - The day button to be disabled.
	 * @param {Temporal.PlainDate} date - The date represented by the button.
	 * @returns {void}
	 */
	#updateIntervalsAvailability(button, date) {
		this.intervals.forEach((interval) => {
			const fromComp = Temporal.PlainDate.compare(date, interval.from);
			const toComp = Temporal.PlainDate.compare(date, interval.to);
			if (fromComp >= 0 && toComp <= 0) {
				if (interval.weekdays.includes(date.dayOfWeek)) {
					button.removeAttribute("disabled");
				}
			}
		});
	}

	/**
	 * Disables the specified day button if the date is within an excluded interval.
	 * 
	 * @param {HTMLButtonElement} button - The day button to be disabled.
	 * @param {Temporal.PlainDate} date - The date represented by the button.
	 * @returns {void}
	 */
	#updateExcludedIntervalsAvailability(button, date) {
		this.excludedIntervals.forEach((excludedInterval) => {
			const fromComp = Temporal.PlainDate.compare(date, excludedInterval.from);
			const toComp = Temporal.PlainDate.compare(date, excludedInterval.to);
			if (fromComp >= 0 && toComp <= 0) {
				if (excludedInterval.weekdays.includes(date.dayOfWeek)) {
					button.setAttribute("disabled", "disabled");
				}
			}
		});
	}

	/**
	 * Sets the calendar's active year and month from the year and month selectors.
	 * 
	 * @returns {void}
	 */
	#goToYearMonthFromSelectors() {
		const year = parseInt(this.yearSelector.value);
		const month = parseInt(this.monthSelector.value);
		const yearMonth = new Temporal.PlainYearMonth(year, month);
		this.goToYearMonth(yearMonth);
	}

	/**
	 * Initializes the availability of the current month trigger.
	 * 
	 * @returns {void}
	 */
	#initCurrentMonthTriggerAvailability() {
		if (this.currentMonthTrigger === null) return;
		const firstDay = this.currentYearMonth.toPlainDate({ day: 1 });
		const lastDay = firstDay.add({ days: firstDay.daysInMonth - 1 });
		const isMinDateLater = Temporal.PlainDate.compare(this.minDate, lastDay) > 0;
		const isMaxDateEarlier = Temporal.PlainDate.compare(this.maxDate, firstDay) < 0;
		if (isMinDateLater || isMaxDateEarlier) {
			this.currentMonthTrigger.setAttribute("disabled", "disabled");
		}
	}

	/**
	 * Creates and appends the available year and month selector options.
	 * 
	 * @returns {void}
	 */
	#createYearMonthOptions() {
		this.#createYearOptions();
		this.#createMonthOptions();
	}

	/**
	 * Creates and appends the available year selector options.
	 * 
	 * @returns {void}
	 */
	#createYearOptions() {
		const minYear = this.minDate.year;
		const maxYear = this.maxDate.year;
		for (let i = maxYear; i >= minYear; i--) {
			this.yearSelector.append(this.#createOption(i, i));
		}
	}

	/**
	 * Creates and appends the available month selector options.
	 * 
	 * @returns {void}
	 */
	#createMonthOptions() {
		for (let i = 1; i <= 12; i++) {
			this.monthSelector.append(this.#createOption(i, this.#padValue(i)));
		}
	}

	/**
	 * Creates and retrieves a select option with the specified value and label.
	 * 
	 * @param {string} value - The value of the select option.
	 * @param {string} label - The label of the select option.
	 * @returns {HTMLOptionElement}
	 */
	#createOption(value, label) {
		const option = document.createElement("option");
		option.value = value;
		option.innerText = label;
		return option;
	}

	/**
	 * Selects the date represented by the specified event target if it is a day button.
	 * 
	 * @param {EventTarget|null} target - The event target from which to select the date.
	 * @returns {void}
	 */
	#selectDateFromElement(target) {
		if (!this.dayWrapper.contains(target) || !(target instanceof HTMLButtonElement)) return;
		try {
			const dateStr = target.getAttribute(this.dayButtonAttribute);
			const date = Temporal.PlainDate.from(dateStr);
			if (this.selectedDate !== null && this.selectedDate.equals(date)) {
				this.resetSelectedDate();
			} else {
				this.selectDate(date);
			}
		} catch (error) {
			console.error("Date could not be selected from the element.");
		}
	}

	/**
	 * Pads the specified number with leading zeros to reach the specified length.
	 * 
	 * @param {number} number - The number to be padded.
	 * @returns {string} The value as a string at the specified length.
	 */
	#padValue(number, length = 2) {
		return String(number).padStart(length, "0");
	}

	/**
	 * Initializes the starting coordinates of a swipe.
	 * 
	 * @param {TouchEvent} event - The touch event from which to get coordinates.
	 * @returns {void}
	 */
	#initSwipe(event) {
		this.#xDown = event.changedTouches[0].screenX;
		this.#yDown = event.changedTouches[0].screenY;
	}

	/**
	 * Sets the calendar's active year and month to the previous or next month according to swipe direction.
	 * 
	 * @param {TouchEvent} event - The touch event to detect the swipe direction.
	 * @returns {void}
	 */
	#swipeYearMonth(event) {
		if (this.#xDown === null || this.#yDown === null) return;
		const xUp = event.changedTouches[0].screenX;
		const yUp = event.changedTouches[0].screenY;
		const xDiff = this.#xDown - xUp;
		const yDiff = this.#yDown - yUp;
		if (Math.abs(xDiff) > Math.abs(yDiff) && Math.abs(xDiff) > 5) {
			event.preventDefault();
			if (xDiff > 0) {
				this.goToNextMonth();
			} else {
				this.goToPrevMonth();
			}
		}
		this.#xDown = null;
		this.#yDown = null;
	}

	/**
	 * Adds event listeners related to the calendar.
	 * 
	 * @returns {void}
	 */
	#addEvents() {
		this.yearSelector.addEventListener("input", this);
		this.monthSelector.addEventListener("input", this);
		this.prevMonthTrigger.addEventListener("click", this);
		this.nextMonthTrigger.addEventListener("click", this);
		this.dayWrapper.addEventListener("click", this);
		this.dayWrapper.addEventListener("touchstart", this);
		this.dayWrapper.addEventListener("touchmove", this);
		if (this.currentMonthTrigger !== null) {
			this.currentMonthTrigger.addEventListener("click", this);
		}
	}

	/**
	 * Handles events.
	 * 
	 * @param {Event} event
	 * @returns {void}
	 */
	#handleEvents(event) {
		switch (event.type) {
			case "touchstart":
				this.#initSwipe(event);
				break;
			case "touchmove":
				this.#swipeYearMonth(event);
				break;
			case "input":
				this.#goToYearMonthFromSelectors();
				break;
			case "click":
				if (event.target == this.currentMonthTrigger) {
					this.goToCurrentYearMonth();
				} else if (event.target == this.prevMonthTrigger) {
					this.goToPrevMonth();
				} else if (event.target == this.nextMonthTrigger) {
					this.goToNextMonth();
				} else {
					this.#selectDateFromElement(event.target);
				}
				break;
		}
	}
}

/**
 * Calendar Interval
 * This class is designed to define an interval within a calendar.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class CalendarInterval {

	/**
	 * The date at which the interval starts.
	 * 
	 * @type {Temporal.PlainDate}
	 */
	from;

	/**
	 * The date at which the interval ends.
	 * 
	 * @type {Temporal.PlainDate}
	 */
	to;

	/**
	 * The weekdays on which the interval applies.
	 * 
	 * @type {number[]}
	 */
	weekdays = [1, 2, 3, 4, 5, 6, 7];

	/**
	 * Callback function that is called after the calendar interval has been initialized.
	 * 
	 * @type {function():void|null}
	 */
	initCallback = null;

	/**
	 * Creates a calendar interval.
	 * 
	 * @param {Object} options
	 * @param {Temporal.PlainDate} options.from - The date at which the interval starts.
	 * @param {Temporal.PlainDate} options.to - The date at which the interval ends.
	 * @param {number[]} options.weekdays - The weekdays on which the interval applies.
	 * @param {function():void} options.initCallback - Callback function that is called after the calendar interval has been initialized.
	 * @returns {CalendarInterval}
	 */
	constructor(options) {

		// Test required options
		if (!(options.from instanceof Temporal.PlainDate)) {
			throw "Calendar interval \"from\" must be a `Temporal.PlainDate`";
		}
		if (!(options.to instanceof Temporal.PlainDate)) {
			throw "Calendar interval \"to\" must be a `Temporal.PlainDate`";
		}
		if (Temporal.PlainDate.compare(options.to, options.from) < 0) {
			throw new Error("Calendar interval end date must be later than start date.");
		}

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}

		// Initialize the calendar interval.
		if (typeof(this.initCallback) == "function") this.initCallback();
	}
}

export { Calendar, CalendarInterval };