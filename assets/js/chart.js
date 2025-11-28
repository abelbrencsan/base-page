/**
 * Chart
 * This class is designed to create bar, line, and pie charts from the specified datasets.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class Chart {

	/**
	 * The type of the chart, which can be "bar", "line", or "pie".
	 * 
	 * @type {string}
	 */
	type;

	/**
	 * Represents the wrapper SVG element to which the chart is appended.
	 * 
	 * @type {SVGElement}
	 */
	wrapper;

	/**
	 * The datasets to be visualized within the chart, where each inner array represents a dataset.
	 * 
	 * @type {Array<Array<number>>}
	 */
	datasets;

	/**
	 * The SVG viewport width of the chart. If the `width` attribute is defined for the SVG, that value will be used.
	 * 
	 * @type {number}
	 */
	width = 400;

	/**
	 * The SVG viewport width of the chart. If the `height` attribute is defined for the SVG, that value will be used.
	 * 
	 * @type {number}
	 */
	height = 200;

	/**
	 * The gap used to separate datasets within the bar chart, relative to the chart size, ranging from 0 to 1.
	 * 
	 * @type {number}
	 */
	gap = 0.05;

	/**
	 * The thickness of the bar within the bar chart, relative to the column size, ranging from 0 to 1.
	 * 
	 * @type {number}
	 */
	barThickness = 0.75;

	/**
	 * The roundness of the bars within the bar chart, ranging from 0 to 1.
	 * 
	 * @type {boolean}
	 */
	roundness = 0.25;

	/**
	 * The size of the markers within the line chart, relative to the viewport.
	 * 
	 * @type {boolean}
	 */
	markerSize = 4;

	/**
	 * Indicates whether the areas of the lines within the line chart are shown.
	 * 
	 * @type {boolean}
	 */
	showArea = true;
	
	/**
	 * Indicates whether the pie chart is displayed as a donut chart.
	 * 
	 * @type {boolean}
	 */
	isDonut = false;

	/**
	 * Indicates whether the pie chart is displayed as a gauge chart.
	 * 
	 * @type {boolean}
	 */
	isGauge = false;

	/**
	 * The class that is added to the chart when its type is bar.
	 * 
	 * @type {string}
	 */
	chartBarClass = "chart-plot--bar";

	/**
	 * The class that is added to the chart when its type is line.
	 * 
	 * @type {string}
	 */
	chartLineClass = "chart-plot--line";

	/**
	 * The class that is added to the chart when its type is pie.
	 * 
	 * @type {string}
	 */
	chartPieClass = "chart-plot--pie";

	/**
	 * The class that is added to the dataset groups within the chart.
	 * 
	 * @type {string}
	 */
	datasetClass = "chart-plot-dataset";

	/**
	 * The class that is added to the data within the datasets.
	 * 
	 * @type {string}
	 */
	datasetDataClass = "chart-plot-dataset-data";

	/**
	 * The class that is added to the areas within the line chart.
	 * 
	 * @type {string}
	 */
	datasetAreaClass = "chart-plot-dataset-area";

	/**
	 * The class that is added to the line within the line chart.
	 * 
	 * @type {string}
	 */
	datasetLineClass = "chart-plot-dataset-line";

	/**
	 * The class that is added to the donut within the pie chart.
	 * 
	 * @type {string}
	 */
	datasetDonutClass = "chart-plot-dataset-donut";

	/**
	 * The format in which the class that defines the grid lines is added to the chart.
	 * 
	 * @type {function(number):string}
	 */
	gridLineClass = (gridLineCount) => `chart-plot--${gridLineCount}`

	/**
	 * The format in which an index-based custom class is added to each dataset.
	 * 
	 * @type {function(number):string}
	 */
	datasetItemClass = (datasetIndex) => `chart-plot-dataset--${datasetIndex}`;

	/**
	 * The format in which an index-based custom class is added to each data within a dataset.
	 * 
	 * @type {function(number):string}
	 */
	datasetDataItemClass = (dataIndex) => `chart-plot-dataset-data--${dataIndex}`;

	/**
	 * The name of the attribute added to each data with its value from the dataset.
	 * 
	 * @type {string}
	 */
	datasetDataAttribute = "data-chart-dataset-data";

	/**
	 * The factor by which the highest data point is multiplied to calculate the X-axis value.
	 * 
	 * @type {number}
	 */
	AxisMultiplier = 1;

	/**
	 * Callback function that is called after the chart has been initialized.
	 * 
	 * @type {function(Chart):void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called after the chart has been updated.
	 * 
	 * @type {function(Chart):void|null}
	 */
	updateCallback = null;

	/**
	 * Callback function that is called after the chart has been destroyed.
	 * 
	 * @type {function(Chart):void|null}
	 */
	destroyCallback = null;

	/**
	 * Available chart types.
	 * 
	 * @type {Array<string>}
	 */
	static types = ["bar", "line", "pie"];

	/**
	 * Creates a chart.
	 * 
	 * @param {Object} options
	 * @param {string} options.type
	 * @param {SVGElement} options.wrapper
	 * @param {Array<Array<number>>} options.datasets
	 * @param {number} options.width
	 * @param {number} options.height
	 * @param {number} options.barThickness
	 * @param {number} options.roundness
	 * @param {boolean} options.showArea
	 * @param {boolean} options.isDonut
	 * @param {boolean} options.isGauge
	 * @param {string} options.chartBarClass
	 * @param {string} options.chartLineClass
	 * @param {string} options.chartPieClass
	 * @param {string} options.datasetClass
	 * @param {string} options.datasetDataClass
	 * @param {string} options.datasetAreaClass
	 * @param {string} options.datasetLineClass
	 * @param {string} options.datasetDonutClass
	 * @param {function(number):string} options.gridLineClass
	 * @param {function(number):string} options.datasetItemClass
	 * @param {function(number):string} options.datasetDataItemClass
	 * @param {string} options.datasetDataAttribute
	 * @param {number} options.AxisMultiplier
	 * @param {function(Chart):void} options.initCallback
	 * @param {function(Chart):void} options.updateCallback
	 * @param {function(Chart):void} options.destroyCallback
	 * @returns {Chart}
	 */
	constructor(options) {

		// Test required options
		if (typeof options.type !== "string") {
			throw "Chart \"type\" must be a `string`";
		}
		if (!Chart.types.includes(options.type)) {
			throw "Chart type is not supported";
		}
		if (!(options.wrapper instanceof SVGElement)) {
			throw "Chart \"wrapper\" must be an `SVGElement`";
		}
		if (!(options.datasets instanceof Array)) {
			throw "Chart \"datasets\" must be an `array`";
		}
		options.datasets.forEach((dataset) => {
			if (!(dataset instanceof Array)) {
				throw "Chart \"dataset\" must be an `array`";
			}
			dataset.forEach((data) => {
				if (typeof data !== "number") {
					throw "Chart \"data\" must be a `number`";
				}
			})
		});

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}

		// Initialize the chart
		this.#setViewport();
		this.update();
		if (typeof(this.initCallback) == "function") this.initCallback(this);
	}

	/**
	 * Updates the chart.
	 * 
	 * @returns {void}
	 */
	update() {
		this.wrapper.replaceChildren();
		this.#drawChart();
		if (typeof(this.updateCallback) == "function") this.updateCallback(this);
	}

	/**
	 * Destroys the chart.
	 * 
	 * @returns {void}
	 */
	destroy() {
		this.wrapper.replaceChildren();
		this.wrapper.classList.remove(this.chartBarClass);
		this.wrapper.classList.remove(this.chartLineClass);
		this.wrapper.classList.remove(this.chartPieClass);
		this.wrapper.removeAttribute("viewBox");
		if (typeof(this.destroyCallback) == "function") this.destroyCallback(this);
	}

	/**
	 * Retrieves the size of the first dataset.
	 * 
	 * @returns {number}
	 */
	get datasetSize() {
		if (!this.datasets.length) return 0;
		return this.datasets[0].length;
	}

	/**
	 * Retrieves the highest value from the datasets.
	 * 
	 * @returns {number}
	 */
	get highestData() {
		if (!this.datasets.length) return 0;
		return Math.max(...[].concat(...this.datasets)) * this.AxisMultiplier;
	}

	/**
	 * Retrieves the lowest value from the datasets.
	 * 
	 * @returns {number}
	 */
	get lowestData() {
		if (!this.datasets.length) return 0;
		return Math.min(...[].concat(...this.datasets));
	}

	/**
	 * Retrieves the labels between zero and the highest value.
	 * 
	 * @returns {Array<number>}
	 */
	get labels() {
		let labels = [];
		let highestData = this.highestData;
		let digits = Math.ceil(Math.log10(highestData));
		let factor = Math.pow(10, digits - 1);
		let roundedHighestData = Math.ceil(highestData / factor) * factor;
		while (roundedHighestData / factor < 6) factor = factor / 2;
		for (let val = 0; val <= roundedHighestData; val += factor) {
			labels.push(val);
		}
		return labels.reverse();
	}

	/**
	 * Retrieves whether the chart is a gauge pie chart.
	 * 
	 * @returns {boolean}
	 */
	get isPieGauge() {
		return this.type == "pie" && this.isGauge
	}

	/**
	 * Draws the chart by type.
	 * 
	 * @returns {void}
	 */
	#drawChart() {
		switch(this.type) {
			case "bar":
				this.#drawBarChart();
				break;
			case "line":
				this.#drawLineChart();
				break;
			case "pie":
				this.#drawPieChart();
				break;
		}
	}

	/**
	 * Draws the bar chart.
	 * 
	 * @returns {void}
	 */
	#drawBarChart() {
		const scaledDatasets = this.#getScaledDatasets(this.height);
		const groupGap = this.width * this.gap;
		const groupWidth = this.width / this.datasets.length;
		const colWidth = (groupWidth - groupGap) / this.datasetSize;
		const barWidth = colWidth * this.barThickness;
		this.wrapper.classList.add(this.chartBarClass);
		this.#setChartGridLinesClass();
		scaledDatasets.forEach((scaledDataset, index) => {
			const groupOffset = (groupGap * 0.5) + (index * groupWidth);
			this.#drawBars(scaledDataset, barWidth, colWidth, groupOffset, index);
		})
	}

	/**
	 * Draws the bars within the bar chart.
	 * 
	 * @param {Array<number>} scaledDataset
	 * @param {number} barWidth
	 * @param {number} colWidth
	 * @param {number} groupOffset
	 * @param {number} datasetIndex
	 * @returns {void}
	 */
	#drawBars(scaledDataset, barWidth, colWidth, groupOffset, datasetIndex) {
		const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
		const bars = this.#createBars(scaledDataset, barWidth, colWidth, groupOffset, datasetIndex);
		group.append(...bars);
		group.classList.add(this.datasetClass);
		group.classList.add(this.datasetItemClass(datasetIndex));
		this.wrapper.append(group);
	}

	/**
	 * Creates the bars within the bar chart.
	 * 
	 * @param {Array<number>} scaledDataset
	 * @param {number} barWidth
	 * @param {number} colWidth
	 * @param {number} groupOffset
	 * @param {number} datasetIndex
	 * @returns {Array<SVGRectElement>}
	 */
	#createBars(scaledDataset, barWidth, colWidth, groupOffset, datasetIndex) {
		const startOffset = ((colWidth - barWidth) * 0.5) - colWidth;
		return scaledDataset.map((scaledData, index) => {
			const colOffset = (index + 1) * colWidth;
			const offset = groupOffset + startOffset + colOffset;
			return this.#createBar(offset, scaledData, barWidth, datasetIndex, index);
		});
	}

	/**
	 * Creates a bar within the bar chart.
	 * 
	 * @param {number} groupOffset
	 * @param {number} scaledData
	 * @param {number} barWidth
	 * @param {number} datasetIndex
	 * @param {number} dataIndex
	 * @returns {SVGRectElement}
	 */
	#createBar(groupOffset, scaledData, barWidth, datasetIndex, dataIndex) {
		const roundness = (barWidth * 0.5) * this.roundness;
		let bar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		bar.setAttribute("x", groupOffset);
		bar.setAttribute("y", this.height - scaledData);
		bar.setAttribute("height", scaledData);
		bar.setAttribute("width", barWidth);
		if (roundness) {
			bar.setAttribute("ry", roundness);
			bar.setAttribute("rx", roundness);
		}
		bar.classList.add(this.datasetDataClass);
		bar.classList.add(this.datasetDataItemClass(dataIndex));
		bar.setAttribute(this.datasetDataAttribute, this.datasets[datasetIndex][dataIndex]);
		return bar;
	}

	/**
	 * Draws the line chart.
	 * 
	 * @returns {void}
	 */
	#drawLineChart() {
		const scaledDatasets = this.#getScaledDatasets(this.height);
		this.wrapper.classList.add(this.chartLineClass);
		this.#setChartGridLinesClass();
		scaledDatasets.forEach((scaledDataset, index) => {
			this.#drawLine(scaledDataset, index);
		})
	}

	/**
	 * Draws a line within the line chart.
	 * 
	 * @param {Array<number>} scaledDataset
	 * @param {number} datasetIndex
	 * @returns {void}
	 */
	#drawLine(scaledDataset, datasetIndex) {
		const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
		const line = this.#createLine(scaledDataset);
		const area = this.#createLineArea(scaledDataset);
		const markers = this.#createLineMarkers(scaledDataset, datasetIndex);
		if (area) group.append(area);
		group.append(line);
		group.append(...markers);
		group.classList.add(this.datasetClass);
		group.classList.add(this.datasetItemClass(datasetIndex));
		this.wrapper.append(group);
	}

	/**
	 * Creates a line within the line chart.
	 * 
	 * @param {Array<number>} scaledDataset
	 * @returns {SVGPolylineElement}
	 */
	#createLine(scaledDataset) {
		let points = this.#getLineChartPoints(scaledDataset);
		let line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
		line.setAttribute("points", points.join(" "));
		line.classList.add(this.datasetLineClass);
		return line;
	}

	/**
	 * Creates the area for a line within the line chart.
	 * 
	 * @param {Array<number>} scaledDataset
	 * @returns {SVGPolylineElement|null}
	 */
	#createLineArea(scaledDataset) {
		if (!this.showArea) return null;
		let points = this.#getLineChartPoints(scaledDataset);
		let area = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
		points.push(`${this.width},${this.height}`);
		points.push(`0,${this.height}`);
		area.setAttribute("points", points.join(" "));
		area.classList.add(this.datasetAreaClass);
		return area;
	}

	/**
	 * Creates the markers for a line within the line chart.
	 * 
	 * @param {Array<number>} scaledDataset
	 * @param {number} datasetIndex
	 * @returns {Array<SVGCircleElement>}
	 */
	#createLineMarkers(scaledDataset, datasetIndex) {
		const points = this.#getLineChartPoints(scaledDataset);
		return points.map((point, index) => {
			const [x, y] = point.split(",");
			let marker = document.createElementNS("http://www.w3.org/2000/svg", "circle");
			marker.setAttribute("cx", x);
			marker.setAttribute("cy", y);
			marker.setAttribute("r", this.markerSize);
			marker.classList.add(this.datasetDataClass);
			marker.classList.add(this.datasetDataItemClass(index));
			marker.setAttribute(this.datasetDataAttribute, this.datasets[datasetIndex][index]);
			return marker;
		});
	}

	/**
	 * Retrieves the point coordinates for the line chart.
	 * 
	 * @param {Array<number>} scaledDataset
	 * @returns {array<string>}
	 */
	#getLineChartPoints(scaledDataset) {
		const offset = this.width / (this.datasetSize - 1);
		return scaledDataset.map((data, index) => {
			const x = index * offset;
			const y = this.height - data;
			return [x, y].join(",");
		});
	}

	/**
	 * Draws the pie chart.
	 * 
	 * @returns {void}
	 */
	#drawPieChart() {
		const diameter = this.isPieGauge ? this.height * 2 : this.height;
		const offsetStep = this.width / this.datasets.length;
		let offset = (offsetStep - diameter) * 0.5;
		this.wrapper.classList.add(this.chartPieClass);
		this.datasets.forEach((dataset, index) => {
			this.#drawPie(dataset, offset, index);
			offset += offsetStep;
		})	
	}

	/**
	 * Draws a pie within the pie chart.
	 * 
	 * @param {Array<number>} dataset
	 * @param {number} offset
	 * @param {number} datasetIndex
	 * @returns {void}
	 */
	#drawPie(dataset, offset, datasetIndex) {
		let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
		let slices = this.#createPieSlices(dataset, datasetIndex);
		let donut = this.#createDonut();
		group.append(...slices);
		if (donut) group.append(donut); 
		group.classList.add(this.datasetClass);
		group.classList.add(this.datasetItemClass(datasetIndex));
		group.setAttribute("transform", `translate(${offset} 0)`);
		this.wrapper.append(group);
	}

	/**
	 * Creates the slices of a pie within the pie chart.
	 * 
	 * @param {Array<number>} dataset
	 * @param {number} datasetIndex
	 * @returns {Array<SVGPolylineElement>}
	 */
	#createPieSlices(dataset, datasetIndex) {
		const angles = this.#getPieSliceAngles(dataset);
		let currentAngle = 0;
		return angles.map((angle, index) => {
			let startAngle = currentAngle;
			currentAngle += angle;
			return this.#createPieSlice(startAngle, currentAngle, datasetIndex, index);
		})
	}

	/**
	 * Creates a slice of a pie within the pie chart.
	 * 
	 * @param {number} startAngle
	 * @param {number} endAngle
	 * @param {number} datasetIndex
	 * @param {number} dataIndex
	 * @returns {SVGPolylineElement}
	 */
	#createPieSlice(startAngle, endAngle, datasetIndex, dataIndex) {
		const radius = this.isPieGauge ? this.height : this.height / 2;
		const path = this.#getPieSlicePath(radius, startAngle, endAngle);
		let slice = document.createElementNS("http://www.w3.org/2000/svg", "path");
		slice.setAttribute("d", path);
		slice.setAttribute("stroke-linejoin", "bevel");
		slice.classList.add(this.datasetDataClass);
		slice.classList.add(this.datasetDataItemClass(dataIndex));
		slice.setAttribute(this.datasetDataAttribute, this.datasets[datasetIndex][dataIndex]);
		return slice;
	}

	/**
	 * Retrieves the path of the pie slice.
	 * 
	 * @param {number} radius
	 * @param {number} startAngle
	 * @param {number} endAngle
	 * @returns {string}
	 */
	#getPieSlicePath(radius, startAngle, endAngle) {
		const offsetAngle = this.isPieGauge ? 180 : 90;
		const isCircle = (endAngle - startAngle === 360);
		if (isCircle) endAngle--;
		const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
		const startCoords = Chart.polarToCartesian(radius, startAngle, offsetAngle);
		const endCoords = Chart.polarToCartesian(radius, endAngle, offsetAngle);
		return this.#generatePieSlicePathShape(startCoords, endCoords, radius, largeArcFlag, isCircle);
	}

	/**
	 * Retrieves the shape of the pie slice path.
	 * 
	 * @param {{x:number,y:number}} startCoords
	 * @param {{x:number,y:number}} endCoords
	 * @param {number} radius
	 * @param {0|1} largeArcFlag
	 * @param {boolean} isCircle
	 * @returns {string}
	 */
	#generatePieSlicePathShape(startCoords, endCoords, radius, largeArcFlag, isCircle) {
		let d = ["M", startCoords.x, startCoords.y, "A", radius, radius, 0, largeArcFlag, 1, endCoords.x, endCoords.y];
		if (isCircle) {
			d.push("Z");
		}
		else {
			d.push("L", radius, radius, "L", startCoords.x, startCoords.y, "Z");
		}
		return d.join(" ");
	}

	/**
	 * Creates the donut for a pie within the pie chart.
	 * 
	 * @returns {SVGCircleElement|null}
	 */
	#createDonut() {
		if (!this.isDonut) return null;
		const diameter = this.isPieGauge ? this.height : this.height / 2;
		let donut = document.createElementNS("http://www.w3.org/2000/svg", "circle");
		donut.setAttribute("cx", diameter);
		donut.setAttribute("cy", diameter);
		donut.setAttribute("r", diameter * 0.5);
		donut.classList.add(this.datasetDonutClass);
		return donut;
	}

	/**
	 * Sets the SVG viewport.
	 * 
	 * @returns {void}
	 */
	#setViewport() {
		this.width = this.wrapper.attributes.width ? parseInt(this.wrapper.attributes.width.value) : this.width;
		this.height = this.wrapper.attributes.height ? parseInt(this.wrapper.attributes.height.value) : this.height;
		const coords = [0, 0, this.width, this.height].join(" ");
		this.wrapper.setAttribute("viewBox", coords);
	}

	/**
	 * Sets the grid line class based on the number of grid lines.
	 * 
	 * @returns {void}
	 */
	#setChartGridLinesClass() {
		this.wrapper.classList.add(this.gridLineClass(this.labels.length - 1));
	}

	/**
	 * Retrieves the modified datasets where values are scaled to the specified value.
	 * The highest value equals the scale value.
	 * 
	 * @param {number} scale
	 * @returns {Array<Array<number>>}
	 */
	#getScaledDatasets(scale) {
		const labels = this.labels;
		const roundedHighestData = labels.length ? labels[0] : 0;
		return this.datasets.map((dataset) => {
			return dataset.map((value) => ((value / roundedHighestData) * scale));
		});
	}

	/**
	 * Retrieves the pie slice angles of the specified dataset.
	 * 
	 * @param {Array<number>} dataset
	 * @returns {Array<number>}
	 */
	#getPieSliceAngles(dataset) {
		let sum = dataset.reduce((total, current) => (total + current), 0);
		return dataset.map((data) => ((data / sum) * (this.isPieGauge ? 180 : 360)));
	}

	/**
	 * Converts the specified polar coordinates to cartesian coordinates.
	 * 
	 * @param {number} radius
	 * @param {number} angle
	 * @param {number} offsetAngle
	 * @returns {{x:number,y:number}}
	 */
	static polarToCartesian(radius, angle, offsetAngle = 90) {
		let radians = (angle - offsetAngle) * Math.PI / 180;
		return {
			x: radius + (radius * Math.cos(radians)),
			y: radius + (radius * Math.sin(radians))
		};
	}
}

export { Chart };