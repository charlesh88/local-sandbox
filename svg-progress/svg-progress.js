// https://marian-caikovski.medium.com/drawing-sectors-and-pie-charts-with-svg-paths-b99b5b6bf7bd

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
    return d.join(" ");
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

function pie(radius, ...vals) {
    const total = vals.reduce((a, b) => a + b, 0);
    console.log(total);
    const data = vals.map((val) => ({val, degrees: (val / total) * 360}));
    console.log(data);
    data.forEach((o, i, ar) => {
        if (!i) {
            o.from = 0;
            o.to = o.degrees;
        } else {
            o.from = ar[i - 1].to;
            o.to = o.from + o.degrees;
        }
        o.path = path(getD(radius, o.from, o.to), i);
    });
    return svg(radius * 2, data.map((o) => o.path).join(""));
}

function svg(width, content) {
    return `<svg viewBox="0 0 ${width} ${width}"><g class='sectors'>${content}</g></svg>`;
}

function path(d, idx) {
    return `<path d='${d}' class='type${idx}'/>`;
}

/************************************************************************* MY STUFF */
let curProg = 0;
let progId;

function progToDegrees(progVal) {
    return progVal/100 * 360;
}

function progressSvg(size, content) {
    return `<svg viewBox="0 0 ${size} ${size}"><g class='sectors'>${content}</g></svg>`;
}

function progressPath(d) {
    return `<path d='${d}'/>`;
}

function progress(val) {
    // Val is a integer percentage of 100, e.g. 0 to 100
    const svgDim = 100;
    // Convert val to degrees
    const path = progressPath(getD(svgDim / 2, 0, progToDegrees(val)));
    document.getElementById('progress-holder').innerHTML = progressSvg(svgDim, path);
}

function progress2(val) {
    const svgDim = 100;
    const pPath = document.getElementById('progress-path');
    pPath.setAttribute('d', getD(svgDim / 2, 0, progToDegrees(val)));
}

function progressAnimate() {
    if (curProg <= 100) {
        progress2(curProg++);
    } else {
        clearInterval(progId);
    }
}

function main() {
    // progress2(86);
    const updateMs = 100;
    progId = setInterval('progressAnimate()',updateMs);
}

document.addEventListener("DOMContentLoaded", main);
