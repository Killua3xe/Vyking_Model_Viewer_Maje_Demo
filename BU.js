
// select viewer
const modelViewer = document.querySelector('model-viewer#vykingViewer');

//-------------READ ZIP FILE-------------------------------------------------------------------------

import * as zip from "https://deno.land/x/zipjs/index.js";

const fileURL = "./package.zip";
let selectedFile = new File([await (await fetch(fileURL)).blob()], fileURL)
console.log(selectedFile);

const model = (() => {

    return {
        getEntries(file) {
            return (new zip.ZipReader(new zip.BlobReader(file))).getEntries();
        },
        async getURL(entry) {
            return URL.createObjectURL(await entry.getData(new zip.BlobWriter()));
        }
    };
})();
//filenameEncoding = filenamesUTF8 ? "utf-8" : filenameEncoding || "cp437";
let entries = await model.getEntries(selectedFile);

if (entries && entries.length) {

    const filenamesUTF8 = Boolean(!entries.find(entry => !entry.filenameUTF8));
    console.log("files found!");


}


async function getURL(entry) {
    return URL.createObjectURL(await entry.getData(new zip.BlobWriter()));
     
}


function getBlobURL(entry) {
    return new Promise(async (resolve) => {
        var blobURL = await getURL(entry);
        var blobObject = {}
        blobObject['name'] = entry.filename;
        blobObject['blob'] = blobURL;
        resolve(blobObject);
    });


}

const promises = [];

entries.forEach((entry) => {
    promises.push(getBlobURL(entry));

});

let blobFiles = {}
let done = false;
await Promise.all(promises)
    .then((results) => {
        console.log("All done", results);
        results.forEach((entry) => {
            blobFiles[entry.name] = entry.blob;
        
        });
       
    })
    .catch((e) => {
        // Handle errors here
    });


console.log(blobFiles);

console.log("cachedFiles");


const glbBlob = blobFiles['model.glb'];
const envBlob = blobFiles['envMap.jpg'];
const jsonBlob = blobFiles['parameters.json'];
await new Promise(r => setTimeout(r, 2000));
console.log(jsonBlob.slice(5));
const res = await fetch(jsonBlob.slice(5));


//-------------LOAD AND PARSE ATTRIBUTES-------------------------------------------------------------------------
// get JSON data

let data =  JSON.parse (jsonBlob);
let attributes = data["viewerAttributes"];




// check if we are using dimensions, if yes add the dom elements needed
let useDimensions = attributes['useDimensions'];
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

// Set model source 
let objectURL = glbBlob;
modelViewer.setAttribute('src', objectURL);
// set environmetMap
let environmentURL = attributes['environmentMap']
modelViewer.setAttribute('environment-image', environmentURL);
// set exposure
let exposureValue = attributes['exposure']
modelViewer.setAttribute('exposure', exposureValue);
//set Anim values
let shouldAnimate = attributes['animation'];
// set shadow Intensity 
let shadowIntensity = attributes['shadowIntensity']
modelViewer.setAttribute('shadow-intensity', shadowIntensity);
// set shadow softness 
let shadowSoftness = attributes['shadowSoftness']
modelViewer.setAttribute('shadow-softness', shadowSoftness);
// check if fullscreen is enabled
let enableFullscreen = attributes['fullScreen']




//-------------INITIAL VIEWER SETUP------------------------------------------------------------------------------


if (enableFullscreen) {
    //add fullscreen Buttons to the viewer
    modelViewer.insertAdjacentHTML('beforeend', `<svg class="fs" width="25" height="25"  viewBox="0 0 25 25" fill="none"><g>
<g style="transform: translate(0.5px,0.5px)2 visibility = "visible">
         <path d="M7.21187 2.63731C7.51497 2.63731 7.80566 2.5169 8.01999 2.30257C8.23432 2.08824 8.35473 1.79755 8.35473 1.49444C8.35473 1.19134 8.23432 0.900647 8.01999 0.686318C7.80566 0.471991 7.51497 0.351582 7.21186 0.351583L1.49438 0.351582C1.19127 0.351582 0.900584 0.471991 0.686256 0.686319C0.471928 0.900647 0.351518 1.19134 0.35152 1.49444L0.35152 7.21132C0.351518 7.51443 0.471927 7.80573 0.686255 8.02005C0.900583 8.23438 1.19127 8.35479 1.49438 8.35479C1.79749 8.35479 2.08818 8.23438 2.30251 8.02005C2.51683 7.80572 2.63724 7.51503 2.63724 7.21193L2.63724 2.6373L7.21187 2.63731Z" fill="#111827"/>
         <path d="M9.57557 7.95934L2.30245 0.68622C1.85613 0.239905 1.13257 0.240004 0.686256 0.686319C0.239941 1.13263 0.239881 1.85615 0.686197 2.30247L7.95932 9.57559C8.40564 10.0219 9.12926 10.0219 9.57557 9.57559C10.0219 9.12928 10.0219 8.40566 9.57557 7.95934Z" fill="#111827"/>
         <path d="M21.3627 21.3628L16.7881 21.3628C16.485 21.3628 16.1943 21.4832 15.9799 21.6975C15.7656 21.9118 15.6452 22.2025 15.6452 22.5056C15.6452 22.8087 15.7656 23.0994 15.9799 23.3137C16.1943 23.5281 16.485 23.6485 16.7881 23.6485L22.5055 23.6485C23.1367 23.6485 23.6484 23.1368 23.6484 22.5056L23.6484 16.7881C23.6484 16.485 23.528 16.1943 23.3137 15.98C23.3007 15.9671 23.2875 15.9544 23.2739 15.9421C23.0636 15.7511 22.7897 15.6453 22.5055 15.6453C22.2024 15.6453 21.9118 15.7657 21.6974 15.98C21.4831 16.1943 21.3627 16.485 21.3627 16.7881L21.3627 21.3628Z" fill="#111827"/>
         <path d="M14.4243 16.0406L21.6974 23.3137C22.1438 23.76 22.8674 23.76 23.3137 23.3137C23.76 22.8674 23.76 22.1438 23.3137 21.6975L16.0406 14.4243C15.5943 13.978 14.8706 13.978 14.4243 14.4243C13.978 14.8707 13.978 15.5943 14.4243 16.0406Z" fill="#111827"/>
         <path d="M21.3629 7.2267C21.3667 7.52466 21.4868 7.80933 21.6975 8.02003C21.9119 8.23436 22.2025 8.35477 22.5056 8.35477L22.5195 8.35468C22.8175 8.35083 23.1031 8.23074 23.3138 8.02003L23.3182 8.01555C23.5298 7.8016 23.6485 7.51282 23.6485 7.21191L23.6485 1.49442C23.6485 0.863239 23.1368 0.351564 22.5056 0.351563L16.7887 0.351563C16.4856 0.351562 16.1944 0.471972 15.98 0.686299C15.9661 0.700245 15.9525 0.714546 15.9393 0.729195C15.75 0.939137 15.6453 1.21177 15.6453 1.49442C15.6453 1.79753 15.7657 2.08822 15.98 2.30255C16.1944 2.51688 16.4851 2.63728 16.7882 2.63728L21.3628 2.63729L21.3628 7.21191L21.3629 7.2267Z" fill="#111827"/>
         <path d="M16.0406 9.57559L23.3137 2.30247C23.76 1.85616 23.76 1.13254 23.3137 0.686221C22.8674 0.239906 22.1438 0.239905 21.6974 0.68622L14.4243 7.95934C13.978 8.40566 13.978 9.12928 14.4243 9.57559C14.8706 10.0219 15.5943 10.0219 16.0406 9.57559Z" fill="#111827"/>
         <path d="M2.63724 16.7888C2.63724 16.4857 2.51683 16.1944 2.3025 15.9801C2.28956 15.9671 2.2763 15.9545 2.26275 15.9422C2.05243 15.7512 1.7785 15.6453 1.49438 15.6453C1.19127 15.6453 0.900584 15.7658 0.686256 15.9801C0.471927 16.1944 0.351516 16.4851 0.351518 16.7882L0.351518 22.5057C0.351519 22.8088 0.471925 23.0995 0.686254 23.3138C0.900582 23.5281 1.19127 23.6486 1.49438 23.6486L7.21186 23.6486C7.51497 23.6486 7.80566 23.5281 8.01999 23.3138C8.23432 23.0995 8.35473 22.8088 8.35473 22.5057C8.35472 22.2026 8.23432 21.9119 8.01999 21.6976C7.80566 21.4832 7.51497 21.3628 7.21186 21.3628L2.63724 21.3628L2.63724 16.7888Z" fill="#111827"/>
         <path d="M7.95932 14.4243L0.686196 21.6975C0.23988 22.1438 0.239938 22.8675 0.686254 23.3138C1.13257 23.7601 1.85613 23.76 2.30245 23.3137L9.57557 16.0406C10.0219 15.5943 10.0219 14.8707 9.57557 14.4243C9.12926 13.978 8.40564 13.978 7.95932 14.4243Z" fill="#111827"/>
     </g>
     <g style="transform: translateY(0)" visibility = "hidden">
         <path d="M3.67732 8.25206C3.37422 8.25206 3.08353 8.37247 2.8692 8.5868C2.65487 8.80112 2.53446 9.09181 2.53446 9.39492C2.53446 9.69803 2.65487 9.98872 2.8692 10.203C3.08353 10.4174 3.37422 10.5378 3.67732 10.5378L9.39481 10.5378C9.69792 10.5378 9.9886 10.4174 10.2029 10.203C10.4173 9.98872 10.5377 9.69803 10.5377 9.39492L10.5377 3.67804C10.5377 3.37494 10.4173 3.08364 10.2029 2.86931C9.98861 2.65498 9.69792 2.53457 9.39481 2.53457C9.0917 2.53457 8.80101 2.65498 8.58668 2.86931C8.37235 3.08364 8.25195 3.37433 8.25195 3.67744L8.25195 8.25206L3.67732 8.25206Z" fill="#111827"/>
         <path d="M1.31362 2.93002L8.58674 10.2031C9.03306 10.6495 9.75662 10.6494 10.2029 10.203C10.6492 9.75673 10.6493 9.03321 10.203 8.58689L2.92987 1.31377C2.48355 0.867453 1.75993 0.867454 1.31362 1.31377C0.867301 1.76008 0.867301 2.4837 1.31362 2.93002Z" fill="#111827"/>
         <path d="M17.0027 17.0028L21.5773 17.0028C21.8804 17.0028 22.1711 16.8824 22.3855 16.6681C22.5998 16.4538 22.7202 16.1631 22.7202 15.86C22.7202 15.5569 22.5998 15.2662 22.3855 15.0518C22.1711 14.8375 21.8804 14.7171 21.5773 14.7171L15.8599 14.7171C15.2287 14.7171 14.717 15.2288 14.717 15.86L14.717 21.5775C14.717 21.8806 14.8374 22.1713 15.0517 22.3856C15.0647 22.3985 15.0779 22.4112 15.0915 22.4235C15.3018 22.6145 15.5757 22.7203 15.8599 22.7203C16.163 22.7203 16.4537 22.5999 16.668 22.3856C16.8823 22.1713 17.0027 21.8806 17.0027 21.5775L17.0027 17.0028Z" fill="#111827"/>
         <path d="M23.9411 22.325L16.668 15.0519C16.2216 14.6055 15.498 14.6056 15.0517 15.0519C14.6054 15.4982 14.6054 16.2218 15.0517 16.6681L22.3248 23.9412C22.7711 24.3876 23.4948 24.3876 23.9411 23.9412C24.3874 23.4949 24.3874 22.7713 23.9411 22.325Z" fill="#111827"/>
         <path d="M17.0026 3.66261C16.9987 3.36466 16.8787 3.07999 16.668 2.86928C16.4536 2.65495 16.1629 2.53455 15.8598 2.53455L15.846 2.53463C15.548 2.53849 15.2624 2.65858 15.0517 2.86928L15.0473 2.87376C14.8357 3.08772 14.717 3.37649 14.717 3.67741L14.717 9.39489C14.717 10.0261 15.2287 10.5378 15.8598 10.5378L21.5768 10.5378C21.8799 10.5378 22.1711 10.4173 22.3854 10.203C22.3994 10.1891 22.413 10.1748 22.4262 10.1601C22.6154 9.95018 22.7202 9.67755 22.7202 9.39489C22.7202 9.09179 22.5998 8.8011 22.3854 8.58677C22.1711 8.37244 21.8804 8.25203 21.5773 8.25203L17.0027 8.25203L17.0027 3.67741L17.0026 3.66261Z" fill="#111827"/>
         <path d="M22.3249 1.31372L15.0518 8.58685C14.6055 9.03316 14.6055 9.75678 15.0518 10.2031C15.4981 10.6494 16.2217 10.6494 16.668 10.2031L23.9412 2.92997C24.3875 2.48366 24.3875 1.76004 23.9412 1.31372C23.4948 0.867406 22.7712 0.867405 22.3249 1.31372Z" fill="#111827"/>
         <path d="M8.25194 21.5768C8.25194 21.88 8.37236 22.1713 8.58668 22.3856C8.59963 22.3985 8.61288 22.4112 8.62644 22.4235C8.83676 22.6145 9.11069 22.7203 9.39481 22.7203C9.69791 22.7203 9.9886 22.5999 10.2029 22.3856C10.4173 22.1713 10.5377 21.8806 10.5377 21.5775L10.5377 15.86C10.5377 15.5569 10.4173 15.2662 10.2029 15.0518C9.9886 14.8375 9.69791 14.7171 9.39481 14.7171L3.67732 14.7171C3.37422 14.7171 3.08352 14.8375 2.8692 15.0518C2.65487 15.2662 2.53446 15.5569 2.53446 15.86C2.53446 16.1631 2.65487 16.4538 2.8692 16.6681C3.08353 16.8824 3.37422 17.0028 3.67732 17.0028L8.25195 17.0028L8.25194 21.5768Z" fill="#111827"/>
         <path d="M2.92987 23.9413L10.203 16.6682C10.6493 16.2219 10.6492 15.4982 10.2029 15.0518C9.75662 14.6055 9.03306 14.6056 8.58674 15.0519L1.31362 22.3251C0.8673 22.7714 0.8673 23.495 1.31362 23.9413C1.75993 24.3876 2.48355 24.3876 2.92987 23.9413Z" fill="#111827"/>
     </g>
    
 </g></svg>`);
    // cache fullscereen Button
    const fullScreenGraphic = document.querySelector('svg.fs');
    // Add fullscreen functionality
    var is_fullscreen = false;
    modelViewer.querySelector('svg.fs').onclick = function () {

        var gs = document.getElementsByTagName("g");


        if (!is_fullscreen) {

            modelViewer.classList.add('fullscreen');

            gs[2].setAttribute('visibility', 'visible')
            gs[1].setAttribute('visibility', 'hidden')

            is_fullscreen = true;

        } else if (is_fullscreen) {

            modelViewer.classList.remove('fullscreen');
            gs[1].setAttribute('visibility', 'visible')
            gs[2].setAttribute('visibility', 'hidden')
            is_fullscreen = false
        }
    };
}


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

// update svg
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

let start, previousTimeStamp;
let animSpeed = 0.1;
let yawVal = 0;

function animate(timestamp) {
    if (start === undefined) {
        start = timestamp;
    }
    if (previousTimeStamp !== timestamp) {
        yawVal += animSpeed;
        modelViewer.orientation = `0deg 0deg ${yawVal}deg`;
    }

    window.requestAnimationFrame(animate);
    if (showDimensions) renderSVG();
}

if (shouldAnimate) window.requestAnimationFrame(animate);


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





