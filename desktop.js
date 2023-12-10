var container = document.querySelector("#unity-container");
var canvas_desktop = document.querySelector("#unity-canvas-desktop");
var canvas_mobile = document.querySelector("#unity-canvas-mobile");
var loadingBar = document.querySelector("#unity-loading-bar");
var progressBarFull = document.querySelector("#unity-progress-bar-full");
// var fullscreenButton = document.querySelector("#unity-fullscreen-button");
var warningBanner = document.querySelector("#unity-warning");

// Shows a temporary message banner/ribbon for a few seconds, or
// a permanent error message on top of the canvas if type=='error'.
// If type=='warning', a yellow highlight color is used.
// Modify or remove this function to customize the visually presented
// way that non-critical warnings and error messages are presented to the
// user.
function unityShowBanner(msg, type) {
    function updateBannerVisibility() {
        warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
    }
    var div = document.createElement('div');
    div.innerHTML = msg;
    warningBanner.appendChild(div);
    if (type == 'error') div.style = 'background: red; padding: 10px;';
    else {
        if (type == 'warning') div.style = 'background: yellow; padding: 10px;';
        setTimeout(function () {
            warningBanner.removeChild(div);
            updateBannerVisibility();
        }, 5000);
    }
    updateBannerVisibility();
}

var buildUrl = "Build";
var loaderUrl_desktop = buildUrl + "/Desktop.loader.js";
var config_desktop = {
    dataUrl: buildUrl + "/Desktop.data",
    frameworkUrl: buildUrl + "/Desktop.framework.js",
    codeUrl: buildUrl + "/Desktop.wasm",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "DefaultCompany",
    productName: "Runtime Editor",
    productVersion: "1.0.0",
    showBanner: unityShowBanner,
};

// By default Unity keeps WebGL canvas render target size matched with
// the DOM size of the canvas element (scaled by window.devicePixelRatio)
// Set this to false if you want to decouple this synchronization from
// happening inside the engine, and you would instead like to size up
// the canvas DOM size and WebGL render target sizes yourself.
// config.matchWebGLToCanvasSize = false;

if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    container.className = "unity-mobile";
    // Avoid draining fillrate performance on mobile devices,
    // and default/override low DPI mode on mobile browsers.
    config_mobile.devicePixelRatio = 1;
    unityShowBanner('WebGL builds are not supported on mobile devices.');
} else {

    const w = $(window).width() - 20 + 'px';
    const h = $(window).height() - 40 + 'px';

    canvas_desktop.style.width = w;
    canvas_desktop.style.height = h;
}
loadingBar.style.display = "block";

var script = document.createElement("script");
script.src = loaderUrl_desktop;
script.onload = () => {
    createUnityInstance(canvas_desktop, config_desktop, (progress) => {
        progressBarFull.style.width = 100 * progress + "%";
    }).then((unityInstance) => {
        loadingBar.style.display = "none";
        // fullscreenButton.onclick = () => {
        //     unityInstance.SetFullscreen(1);
        // };
    }).catch((message) => {
        alert(message);
    });
};
document.body.appendChild(script);

//on window resize event
$(window).resize(function () {
    const w = $(window).width() - 20 + 'px';
    const h = $(window).height() - 40 + 'px';

    canvas_desktop.style.width = w;
    canvas_desktop.style.height = h;
});
