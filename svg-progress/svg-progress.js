/************** https://marian-caikovski.medium.com/drawing-sectors-and-pie-charts-with-svg-paths-b99b5b6bf7bd */
function getD(radius, startAngle, endAngle) {
    const isCircle = endAngle - startAngle === 360;
    if (isCircle) {
        endAngle--;
    }
    const start = polarToCartesian(radius, startAngle);
    const end = polarToCartesian(radius, endAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
    const d = [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y];
    if (isCircle) {
        d.push("Z");
    } else {
        d.push("L", radius, radius,
            "L", start.x, start.y,
            "Z");
    }
    const o = d.join(" ");
    return o;
}

function polarToCartesian(radius, angleInDegrees) {
    var radians = (angleInDegrees - 90) * Math.PI / 180;
    return {
        x: round(radius + (radius * Math.cos(radians))),
        y: round(radius + (radius * Math.sin(radians)))
    };
}

function round(n) {
    return Math.round(n * 10) / 10;
}

/************************************************************************* CHARLES STUFF */
const SVG_VB_SIZE = 100;
const PATH_ID = 'svg-progress-path';
const UPDATE_RATE_MS = 1000; // 1 Hz
const TEST_START_MS = 0; // Datetime start of the Activity
const TEST_END_MS = 3 * 60 * 1000; // Datetime end of the Activity
const DURATION = TEST_END_MS - TEST_START_MS;
const TEST_NOW_MS = 1.3 * 60 * 1000; // Current "now"
const UPDATE_PER_CYCLE = 100 / (DURATION / UPDATE_RATE_MS);
let curProgressPercent = 0;
let progressIntervalId;

function progToDegrees(progVal) {
    return progVal / 100 * 360;
}

function renderProgress(val) {
    document.getElementById(PATH_ID).setAttribute('d', getD(SVG_VB_SIZE / 2, 0, progToDegrees(val)));
}

function progressAnimate() {
    renderProgress(curProgressPercent);

    if (curProgressPercent < 100) {
        // If the remaining percent is less than UPDATE_PER_CYCLE, round up to 100%.
        // Otherwise, increment by UPDATE_PER_CYCLE.
        curProgressPercent = ((100 - curProgressPercent) < UPDATE_PER_CYCLE) ? 100 : curProgressPercent += UPDATE_PER_CYCLE;
    } else {
        clearInterval(progressIntervalId);
    }
}

function main() {
    if (TEST_NOW_MS > TEST_START_MS) {
        // Now is after activity start datetime
        curProgressPercent = (1 - ((TEST_END_MS - TEST_NOW_MS) / DURATION)) * 100;
    }
    progressAnimate();
    progressIntervalId = setInterval('progressAnimate()', UPDATE_RATE_MS);
}

document.addEventListener("DOMContentLoaded", main);
