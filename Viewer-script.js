


var modelViewer = document.querySelector('model-viewer');
// check if we are using dimensions, if yes add the dom elements needed
let useDimensions = true;
if (useDimensions) modelViewer.insertAdjacentHTML('afterBegin', `<button slot="hotspot-dot+X-Y+Z" class="dot" data-position="1 -1 1" data-normal="1 0 0"></button>
<button slot="hotspot-dim+X-Y" class="dim" data-position="1 -1 0" data-normal="1 0 0"></button>
<button slot="hotspot-dot+X-Y-Z" class="dot" data-position="1 -1 -1" data-normal="1 0 0"></button>
<button slot="hotspot-dim+X-Z" class="dim" data-position="1 0 -1" data-normal="1 0 0"></button>
<button slot="hotspot-dot+X+Y-Z" class="dot" data-position="1 1 -1" data-normal="0 1 0"></button>
<button slot="hotspot-dim+Y-Z" class="dim" data-position="0 -1 -1" data-normal="0 1 0"></button>
<button slot="hotspot-dot-X+Y-Z" class="dot" data-position="-1 1 -1" data-normal="0 1 0"></button>
<button slot="hotspot-dim-X-Z" class="dim" data-position="-1 0 -1" data-normal="-1 0 0"></button>
<button slot="hotspot-dot-X-Y-Z" class="dot" data-position="-1 -1 -1" data-normal="-1 0 0"></button>
<button slot="hotspot-dim-X-Y" class="dim" data-position="-1 -1 0" data-normal="-1 0 0"></button>
<button slot="hotspot-dot-X-Y+Z" class="dot" data-position="-1 -1 1" data-normal="-1 0 0"></button>
<svg id="dimLines" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" class="dimensionLineContainer">
    <line class="dimensionLine hide"></line>
    <line class="dimensionLine hide"></line>
    <line class="dimensionLine hide"></line>
    <line class="dimensionLine hide"></line>
    <line class="dimensionLine hide"></line>
</svg>`);



// loading indicator
modelViewer.insertAdjacentHTML('afterbegin', `<div class="loading">
      <svg width="70" height="70" viewport="0 0 35 35">
          <circle fill="transparent" stroke-dasharray="207.35" stroke-dashoffset="0" cx="35" cy="35" r="33"></circle>
          <circle fill="transparent" stroke-dasharray="207.35" stroke-dashoffset="207.35" id="bar" cx="35" cy="35" r="33"></circle>
      </svg><br
      /><span style="color: #2C2C2C; font-size: 12px; line-height: 50px;">Loading 3D model</span><br
      /><span style="color: #828282; font-size: 10px;">Powered by</span><br
      /><img height="25" src="data:image/png;base64,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" />
      <!-- TODO upload the image to vyking.io or something -->
  </div>`);

let finishedLoading = false;
// Handles loading the events for <model-viewer>'s slotted progress bar
const onProgress = (event) => {
    const p = 0.1 + 0.9 * event.detail.totalProgress; 
    var circle = modelViewer.querySelector('div.loading svg #bar');
    var r = circle.getAttribute('r');
    var c = Math.PI * (r * 2);
    circle.style.strokeDashoffset = (1 - p) * c;


    if (event.detail.totalProgress === 1) {
        // hide loading indicator
        const loading = modelViewer.querySelector('div.loading');
        loading.style.opacity = 0;
        setTimeout(function () { loading.remove(); finishedLoading = true; }, 1000);

    }



};
document.querySelector('model-viewer').addEventListener('progress', onProgress);

//-------------ANIMATION AND DIMENSION LOGIC-----------------------------------------------------------------------

//update svg
function drawLine(svgLine, dotHotspot1, dotHotspot2, dimensionHotspot) {
    if (dotHotspot1 && dotHotspot1) {
        svgLine.setAttribute('x1', dotHotspot1.canvasPosition.x);
        svgLine.setAttribute('y1', dotHotspot1.canvasPosition.y);
        svgLine.setAttribute('x2', dotHotspot2.canvasPosition.x);
        svgLine.setAttribute('y2', dotHotspot2.canvasPosition.y);

        // use provided optional hotspot to tie visibility of this svg line to
        if (dimensionHotspot && !dimensionHotspot.facingCamera || !finishedLoading) {
            svgLine.classList.add('hide');
        }
        else {
            svgLine.classList.remove('hide');
        }
    }
}

const dimLines = modelViewer.querySelectorAll('line');

const renderSVG = () => {
    drawLine(dimLines[0], modelViewer.queryHotspot('hotspot-dot+X-Y+Z'), modelViewer.queryHotspot('hotspot-dot+X-Y-Z'), modelViewer.queryHotspot('hotspot-dim+X-Y'));
    drawLine(dimLines[1], modelViewer.queryHotspot('hotspot-dot+X-Y-Z'), modelViewer.queryHotspot('hotspot-dot+X+Y-Z'), modelViewer.queryHotspot('hotspot-dim+X-Z'));
    drawLine(dimLines[2], modelViewer.queryHotspot('hotspot-dot+X+Y-Z'), modelViewer.queryHotspot('hotspot-dot-X+Y-Z'), modelViewer.queryHotspot('hotspot-dim+Y-Z'));
    drawLine(dimLines[3], modelViewer.queryHotspot('hotspot-dot-X+Y-Z'), modelViewer.queryHotspot('hotspot-dot-X-Y-Z'), modelViewer.queryHotspot('hotspot-dim-X-Z'));
    drawLine(dimLines[4], modelViewer.queryHotspot('hotspot-dot-X-Y-Z'), modelViewer.queryHotspot('hotspot-dot-X-Y+Z'), modelViewer.queryHotspot('hotspot-dim-X-Y'));
};

modelViewer.addEventListener('camera-change', renderSVG);
//utility
function setVisibility(element, show) {
    if (show) {
        element.classList.remove('hide');
    } else {
        element.classList.add('hide');
    }
}

modelViewer.addEventListener('ar-status', (event) => {
    if (event.detail.status == 'session-started') {
        setVisibility(modelViewer.querySelector('#dimLines'), false);
        modelViewer.querySelectorAll('button').forEach((hotspot) => {
            setVisibility(hotspot, false);
        });
    }else if (event.detail.status == 'not-presenting') {
        setVisibility(modelViewer.querySelector('#dimLines'), true);
        modelViewer.querySelectorAll('button').forEach((hotspot) => {
            setVisibility(hotspot, true);
        });
    }
});



function handleHotSpot() {
    const center = modelViewer.getBoundingBoxCenter();
    const size = modelViewer.getDimensions();
    const x2 = size.x / 2;
    const y2 = size.y / 2;
    const z2 = size.z / 2;

    modelViewer.updateHotspot({
        name: 'hotspot-dot+X-Y+Z',
        position: `${center.x + x2} ${center.y - y2} ${center.z + z2}`
    });

    modelViewer.updateHotspot({
        name: 'hotspot-dim+X-Y',
        position: `${center.x + x2 * 1.2} ${center.y - y2 * 1.1} ${center.z}`
    });
    modelViewer.querySelector('button[slot="hotspot-dim+X-Y"]').textContent =
        `${(size.z * 100).toFixed(0)} cm`;

    modelViewer.updateHotspot({
        name: 'hotspot-dot+X-Y-Z',
        position: `${center.x + x2} ${center.y - y2} ${center.z - z2}`
    });

    modelViewer.updateHotspot({
        name: 'hotspot-dim+X-Z',
        position: `${center.x + x2 * 1.2} ${center.y} ${center.z - z2 * 1.2}`
    });
    modelViewer.querySelector('button[slot="hotspot-dim+X-Z"]').textContent =
        `${(size.y * 100).toFixed(0)} cm`;

    modelViewer.updateHotspot({
        name: 'hotspot-dot+X+Y-Z',
        position: `${center.x + x2} ${center.y + y2} ${center.z - z2}`
    });

    modelViewer.updateHotspot({
        name: 'hotspot-dim+Y-Z',
        position: `${center.x} ${center.y + y2 * 1.1} ${center.z - z2 * 1.1}`
    });
    modelViewer.querySelector('button[slot="hotspot-dim+Y-Z"]').textContent =
        `${(size.x * 100).toFixed(0)} cm`;

    modelViewer.updateHotspot({
        name: 'hotspot-dot-X+Y-Z',
        position: `${center.x - x2} ${center.y + y2} ${center.z - z2}`
    });

    modelViewer.updateHotspot({
        name: 'hotspot-dim-X-Z',
        position: `${center.x - x2 * 1.2} ${center.y} ${center.z - z2 * 1.2}`
    });
    modelViewer.querySelector('button[slot="hotspot-dim-X-Z"]').textContent =
        `${(size.y * 100).toFixed(0)} cm`;

    modelViewer.updateHotspot({
        name: 'hotspot-dot-X-Y-Z',
        position: `${center.x - x2} ${center.y - y2} ${center.z - z2}`
    });

    modelViewer.updateHotspot({
        name: 'hotspot-dim-X-Y',
        position: `${center.x - x2 * 1.2} ${center.y - y2 * 1.1} ${center.z}`
    });
    modelViewer.querySelector('button[slot="hotspot-dim-X-Y"]').textContent =
        `${(size.z * 100).toFixed(0)} cm`;

    modelViewer.updateHotspot({
        name: 'hotspot-dot-X-Y+Z',
        position: `${center.x - x2} ${center.y - y2} ${center.z + z2}`
    });

    renderSVG();
}

modelViewer.addEventListener('load', () => {
    handleHotSpot();
});





