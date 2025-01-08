"use strict";

var CABLES=CABLES||{};
CABLES.OPS=CABLES.OPS||{};

var Ops=Ops || {};
Ops.Gl=Ops.Gl || {};
Ops.Vars=Ops.Vars || {};
Ops.Array=Ops.Array || {};
Ops.Color=Ops.Color || {};
Ops.Trigger=Ops.Trigger || {};
Ops.Gl.Matrix=Ops.Gl.Matrix || {};
Ops.Gl.Meshes=Ops.Gl.Meshes || {};
Ops.Gl.Shader=Ops.Gl.Shader || {};
Ops.Gl.Textures=Ops.Gl.Textures || {};
Ops.Array.PointArray=Ops.Array.PointArray || {};



// **************************************************************
// 
// Ops.Array.ArrayGetTexture
// 
// **************************************************************

Ops.Array.ArrayGetTexture = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments=op.attachments={};
const
    array = op.inArray("array"),
    index = op.inValueInt("index"),
    value = op.outTexture("value");

let last = null;

array.ignoreValueSerialize = true;
value.ignoreValueSerialize = true;

index.onChange =
    array.onChange = update;

op.toWorkPortsNeedToBeLinked(array, value);

const emptyTex = CGL.Texture.getEmptyTexture(op.patch.cgl);

function update()
{
    const arr = array.get();
    let ind = index.get();
    if (ind < 0 || !arr || ind >= arr.length)
    {
        value.set(emptyTex);
        return;
    }

    if (arr[ind])
    {
        value.set(arr[ind] || emptyTex);
        last = arr[ind];
    }
    else
        value.set(emptyTex);
}


};

Ops.Array.ArrayGetTexture.prototype = new CABLES.Op();
CABLES.OPS["afea522b-ab72-4574-b721-5d37f5abaf77"]={f:Ops.Array.ArrayGetTexture,objName:"Ops.Array.ArrayGetTexture"};




// **************************************************************
// 
// Ops.Gl.Textures.TextureInfo_v2
// 
// **************************************************************

Ops.Gl.Textures.TextureInfo_v2 = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments=op.attachments={};
const
    inTex = op.inObject("Texture", null, "texture"),
    outName = op.outString("Name"),
    outPixelFormat = op.outString("PixelFormat"),
    outWidth = op.outNumber("Width"),
    outHeight = op.outNumber("Height"),
    outRatio = op.outNumber("Ratio"),
    outFilter = op.outNumber("Filter"),
    outWrap = op.outNumber("Wrap"),
    outFlipped = op.outBoolNum("Flipped"),
    outFp = op.outBoolNum("HDR"),
    outDefaultEmpty = op.outBoolNum("Is Empty Default Texture", false),
    outDefaultTex = op.outBoolNum("Is Default Texture", false),
    outCubemap = op.outBoolNum("Is Cubemap"),
    outId = op.outNumber("Id");

outFp.setUiAttribs({ "title": "Float Texture" });

const emptyTex = CGL.Texture.getEmptyTexture(op.patch.cgl);
const defaultTex = CGL.Texture.getTempTexture(op.patch.cgl);

inTex.onChange = function ()
{
    if (inTex.get())
    {
        outName.set(inTex.get().name);
        outWidth.set(inTex.get().width);
        outHeight.set(inTex.get().height);
        outRatio.set(inTex.get().width / inTex.get().height);

        let strFilter = "unknown";
        if (inTex.get().filter == CGL.Texture.FILTER_NEAREST)strFilter = "nearest";
        else if (inTex.get().filter == CGL.Texture.FILTER_LINEAR)strFilter = "linear";
        else if (inTex.get().filter == CGL.Texture.FILTER_MIPMAP)strFilter = "mipmap";

        outFilter.set(inTex.get().filter + " " + strFilter);

        let strWrap = "unknown";

        if (inTex.get().wrap == CGL.Texture.WRAP_CLAMP_TO_EDGE) strWrap = "clamp to edge";
        else if (inTex.get().wrap == CGL.Texture.WRAP_REPEAT) strWrap = "repeat";
        else if (inTex.get().wrap == CGL.Texture.WRAP_MIRRORED_REPEAT) strWrap = "mirrored repeat";

        outWrap.set(inTex.get().wrap + " " + strWrap);

        outPixelFormat.set(inTex.get().pixelFormat);
        outId.set(inTex.get().id);
        outFlipped.set(inTex.get().flipped);
        outFp.set(inTex.get().isFloatingPoint && inTex.get().isFloatingPoint());

        outCubemap.set(inTex.get().cubemap);
    }
    else
    {
        outName.set("no texture");
        outWidth.set(0);
        outHeight.set(0);
        outRatio.set(0);
        outFilter.set(null);
        outWrap.set(null);
        outId.set(null);
        outFlipped.set(false);
        outFp.set(false);
        outCubemap.set(false);
    }

    outDefaultEmpty.set(inTex.get() == emptyTex);
    outDefaultTex.set(inTex.get() == defaultTex);
};


};

Ops.Gl.Textures.TextureInfo_v2.prototype = new CABLES.Op();
CABLES.OPS["63d5ac1d-a21b-4449-ab93-1fae5c791cf2"]={f:Ops.Gl.Textures.TextureInfo_v2,objName:"Ops.Gl.Textures.TextureInfo_v2"};




// **************************************************************
// 
// Ops.Gl.MainLoop_v2
// 
// **************************************************************

Ops.Gl.MainLoop_v2 = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments=op.attachments={};
const
    hdpi = op.inFloat("Max Pixel Density (DPR)", 2),
    fpsLimit = op.inValue("FPS Limit", 0),
    reduceFocusFPS = op.inValueBool("Reduce FPS unfocussed", false),
    clear = op.inValueBool("Transparent", false),
    active = op.inValueBool("Active", 1),
    trigger = op.outTrigger("trigger"),
    width = op.outNumber("width"),
    height = op.outNumber("height"),
    outPixel = op.outNumber("Pixel Density");

op.onAnimFrame = render;
hdpi.onChange = updateHdpi;

const cgl = op.patch.cgl;
let rframes = 0;
let rframeStart = 0;
let timeOutTest = null;
let addedListener = false;
if (!op.patch.cgl) op.uiAttr({ "error": "No webgl cgl context" });

const identTranslate = vec3.create();
vec3.set(identTranslate, 0, 0, 0);
const identTranslateView = vec3.create();
vec3.set(identTranslateView, 0, 0, -2);

let fsElement = null;
let winhasFocus = true;
let winVisible = true;

window.addEventListener("blur", () => { winhasFocus = false; });
window.addEventListener("focus", () => { winhasFocus = true; });
document.addEventListener("visibilitychange", () => { winVisible = !document.hidden; });

testMultiMainloop();

op.patch.tempData.mainloopOp = this;

function updateHdpi()
{
    setPixelDensity();

    if (CABLES.UI)
    {
        if (hdpi.get() < 1)
            op.patch.cgl.canvas.style.imageRendering = "pixelated";
    }

    op.patch.cgl.updateSize();
    if (CABLES.UI) gui.setLayout();
}

active.onChange = function ()
{
    op.patch.removeOnAnimFrame(op);

    if (active.get())
    {
        op.setUiAttrib({ "extendTitle": "" });
        op.onAnimFrame = render;
        op.patch.addOnAnimFrame(op);
        op.log("adding again!");
    }
    else
    {
        op.setUiAttrib({ "extendTitle": "Inactive" });
    }
};

function getFpsLimit()
{
    if (reduceFocusFPS.get())
    {
        if (!winVisible) return 10;
        if (!winhasFocus) return 30;
    }

    return fpsLimit.get();
}

op.onDelete = function ()
{
    cgl.gl.clearColor(0, 0, 0.0, 0);
    cgl.gl.clear(cgl.gl.COLOR_BUFFER_BIT | cgl.gl.DEPTH_BUFFER_BIT);
};

function setPixelDensity()
{
    if (hdpi.get() != 0) op.patch.cgl.pixelDensity = Math.min(hdpi.get(), window.devicePixelRatio);
    else op.patch.cgl.pixelDensity = window.devicePixelRatio;
}

function render(time)
{
    if (!active.get()) return;
    if (cgl.aborted || cgl.canvas.clientWidth === 0 || cgl.canvas.clientHeight === 0) return;

    op.patch.cg = cgl;

    setPixelDensity();

    // if (hdpi.get())op.patch.cgl.pixelDensity = window.devicePixelRatio;

    const startTime = performance.now();

    op.patch.config.fpsLimit = getFpsLimit();

    if (cgl.canvasWidth == -1)
    {
        cgl.setCanvas(op.patch.config.glCanvasId);
        return;
    }

    if (cgl.canvasWidth != width.get() || cgl.canvasHeight != height.get())
    {
        width.set(cgl.canvasWidth / 1);
        height.set(cgl.canvasHeight / 1);
    }

    if (CABLES.now() - rframeStart > 1000)
    {
        CGL.fpsReport = CGL.fpsReport || [];
        if (op.patch.loading.getProgress() >= 1.0 && rframeStart !== 0)CGL.fpsReport.push(rframes);
        rframes = 0;
        rframeStart = CABLES.now();
    }
    CGL.MESH.lastShader = null;
    CGL.MESH.lastMesh = null;

    cgl.renderStart(cgl, identTranslate, identTranslateView);

    if (!clear.get()) cgl.gl.clearColor(0, 0, 0, 1);
    else cgl.gl.clearColor(0, 0, 0, 0);

    cgl.gl.clear(cgl.gl.COLOR_BUFFER_BIT | cgl.gl.DEPTH_BUFFER_BIT);

    trigger.trigger();

    if (CGL.MESH.lastMesh)CGL.MESH.lastMesh.unBind();

    if (CGL.Texture.previewTexture)
    {
        if (!CGL.Texture.texturePreviewer) CGL.Texture.texturePreviewer = new CGL.Texture.texturePreview(cgl);
        CGL.Texture.texturePreviewer.render(CGL.Texture.previewTexture);
    }
    cgl.renderEnd(cgl);

    op.patch.cg = null;

    if (!clear.get())
    {
        cgl.gl.clearColor(1, 1, 1, 1);
        cgl.gl.colorMask(false, false, false, true);
        cgl.gl.clear(cgl.gl.COLOR_BUFFER_BIT);
        cgl.gl.colorMask(true, true, true, true);
    }

    if (!cgl.tempData.phong)cgl.tempData.phong = {};
    rframes++;

    outPixel.set(op.patch.cgl.pixelDensity);
    op.patch.cgl.profileData.profileMainloopMs = performance.now() - startTime;
}

function testMultiMainloop()
{
    clearTimeout(timeOutTest);
    timeOutTest = setTimeout(
        () =>
        {
            if (op.patch.getOpsByObjName(op.name).length > 1)
            {
                op.setUiError("multimainloop", "there should only be one mainloop op!");
                if (!addedListener)addedListener = op.patch.addEventListener("onOpDelete", testMultiMainloop);
            }
            else op.setUiError("multimainloop", null, 1);
        }, 500);
}


};

Ops.Gl.MainLoop_v2.prototype = new CABLES.Op();
CABLES.OPS["f1029550-d877-42da-9b1e-63a5163a0350"]={f:Ops.Gl.MainLoop_v2,objName:"Ops.Gl.MainLoop_v2"};




// **************************************************************
// 
// Ops.Gl.Matrix.OrbitControls_v3
// 
// **************************************************************

Ops.Gl.Matrix.OrbitControls_v3 = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments=op.attachments={};
const
    render = op.inTrigger("render"),
    minDist = op.inValueFloat("min distance", 1),
    maxDist = op.inValueFloat("max distance", 999999),

    minRotY = op.inValue("min rot y", 0),
    maxRotY = op.inValue("max rot y", 0),

    initialRadius = op.inValue("initial radius", 2),
    initialAxis = op.inValueSlider("initial axis y", 0.5),
    initialX = op.inValueSlider("initial axis x", 0.25),

    smoothness = op.inValueSlider("Smoothness", 1.0),
    speedX = op.inValue("Speed X", 1),
    speedY = op.inValue("Speed Y", 1),

    active = op.inValueBool("Active", true),

    allowPanning = op.inValueBool("Allow Panning", true),
    allowZooming = op.inValueBool("Allow Zooming", true),
    allowRotation = op.inValueBool("Allow Rotation", true),
    restricted = op.inValueBool("restricted", true),
    inIdentity = op.inBool("Identity", true),
    inReset = op.inTriggerButton("Reset"),

    trigger = op.outTrigger("trigger"),
    outRadius = op.outNumber("radius"),
    outXDeg = op.outNumber("Rot X"),
    outYDeg = op.outNumber("Rot Y");
    // outCoords = op.outArray("Eye/Target Pos");

op.setPortGroup("Initial Values", [initialAxis, initialX, initialRadius]);
op.setPortGroup("Interaction", [smoothness, speedX, speedY]);
op.setPortGroup("Boundaries", [minRotY, maxRotY, minDist, maxDist]);

const halfCircle = Math.PI;
const fullCircle = Math.PI * 2;

const
    vUp = vec3.create(),
    vCenter = vec3.create(),
    viewMatrix = mat4.create(),
    tempViewMatrix = mat4.create(),
    vOffset = vec3.create(),
    finalEyeAbs = vec3.create(),
    tempEye = vec3.create(),
    finalEye = vec3.create(),
    tempCenter = vec3.create(),
    finalCenter = vec3.create();

let eye = vec3.create(),
    mouseDown = false,
    radius = 5,
    lastMouseX = 0, lastMouseY = 0,
    percX = 0, percY = 0,
    px = 0,
    py = 0,
    divisor = 1,
    element = null,
    initializing = true,
    eyeTargetCoord = [0, 0, 0, 0, 0, 0],
    lastPy = 0;

op.onDelete = unbind;
smoothness.onChange = updateSmoothness;
initialRadius.onChange =
    inReset.onTriggered = reset;

eye = circlePos(0);
vec3.set(vCenter, 0, 0, 0);
vec3.set(vUp, 0, 1, 0);
updateSmoothness();
reset();

function reset()
{
    let off = 0;

    if (px % fullCircle < -halfCircle)
    {
        off = -fullCircle;
        px %= -fullCircle;
    }
    else
    if (px % fullCircle > halfCircle)
    {
        off = fullCircle;
        px %= fullCircle;
    }
    else px %= fullCircle;

    py %= (Math.PI);

    vec3.set(vOffset, 0, 0, 0);
    vec3.set(vCenter, 0, 0, 0);
    vec3.set(vUp, 0, 1, 0);

    percX = (initialX.get() * Math.PI * 2 + off);
    percY = (initialAxis.get() - 0.5);

    radius = initialRadius.get();
    eye = circlePos(percY);
}

function updateSmoothness()
{
    divisor = smoothness.get() * 10 + 1;
}

function ip(val, goal)
{
    if (initializing) return goal;
    return val + (goal - val) / divisor;
}

render.onTriggered = function ()
{
    const cgl = op.patch.cg;
    if (!cgl) return;

    if (!element)
    {
        setElement(cgl.canvas);
        bind();
    }

    cgl.pushViewMatrix();

    px = ip(px, percX);
    py = ip(py, percY);

    let degY = (py + 0.5) * 180;

    if (minRotY.get() !== 0 && degY < minRotY.get())
    {
        degY = minRotY.get();
        py = lastPy;
    }
    else if (maxRotY.get() !== 0 && degY > maxRotY.get())
    {
        degY = maxRotY.get();
        py = lastPy;
    }
    else
    {
        lastPy = py;
    }

    const degX = (px) * CGL.RAD2DEG;

    outYDeg.set(degY);
    outXDeg.set(degX);

    circlePosi(eye, py);

    vec3.add(tempEye, eye, vOffset);
    vec3.add(tempCenter, vCenter, vOffset);

    finalEye[0] = ip(finalEye[0], tempEye[0]);
    finalEye[1] = ip(finalEye[1], tempEye[1]);
    finalEye[2] = ip(finalEye[2], tempEye[2]);

    finalCenter[0] = ip(finalCenter[0], tempCenter[0]);
    finalCenter[1] = ip(finalCenter[1], tempCenter[1]);
    finalCenter[2] = ip(finalCenter[2], tempCenter[2]);

    // eyeTargetCoord[0] = finalEye[0];
    // eyeTargetCoord[1] = finalEye[1];
    // eyeTargetCoord[2] = finalEye[2];
    // eyeTargetCoord[3] = finalCenter[0];
    // eyeTargetCoord[4] = finalCenter[1];
    // eyeTargetCoord[5] = finalCenter[2];
    // outCoords.setRef(eyeTargetCoord);

    const empty = vec3.create();

    if (inIdentity.get()) mat4.identity(cgl.vMatrix);

    mat4.lookAt(viewMatrix, finalEye, finalCenter, vUp);
    mat4.rotate(viewMatrix, viewMatrix, px, vUp);

    // finaly multiply current scene viewmatrix
    mat4.multiply(cgl.vMatrix, cgl.vMatrix, viewMatrix);

    trigger.trigger();
    cgl.popViewMatrix();
    initializing = false;
};

function circlePosi(vec, perc)
{
    if (radius < minDist.get()) radius = minDist.get();
    if (radius > maxDist.get()) radius = maxDist.get();

    outRadius.set(radius);

    let i = 0, degInRad = 0;

    degInRad = 360 * perc / 2 * CGL.DEG2RAD;
    vec3.set(vec,
        Math.cos(degInRad) * radius,
        Math.sin(degInRad) * radius,
        0);
    return vec;
}

function circlePos(perc)
{
    if (radius < minDist.get())radius = minDist.get();
    if (radius > maxDist.get())radius = maxDist.get();

    outRadius.set(radius);

    let i = 0, degInRad = 0;
    const vec = vec3.create();
    degInRad = 360 * perc / 2 * CGL.DEG2RAD;
    vec3.set(vec,
        Math.cos(degInRad) * radius,
        Math.sin(degInRad) * radius,
        0);
    return vec;
}

function onmousemove(event)
{
    if (!mouseDown) return;

    const x = event.clientX;
    const y = event.clientY;

    let movementX = (x - lastMouseX);
    let movementY = (y - lastMouseY);

    movementX *= speedX.get();
    movementY *= speedY.get();

    if (event.buttons == 2 && allowPanning.get())
    {
        vOffset[2] += movementX * 0.01;
        vOffset[1] += movementY * 0.01;
    }
    else
    if (event.buttons == 4 && allowZooming.get())
    {
        radius += movementY * 0.05;
        eye = circlePos(percY);
    }
    else
    {
        if (allowRotation.get())
        {
            percX += movementX * 0.003;
            percY += movementY * 0.002;

            if (restricted.get())
            {
                if (percY > 0.5)percY = 0.5;
                if (percY < -0.5)percY = -0.5;
            }
        }
    }

    lastMouseX = x;
    lastMouseY = y;
}

function onMouseDown(event)
{
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
    mouseDown = true;

    try { element.setPointerCapture(event.pointerId); }
    catch (e) {}
}

function onMouseUp(e)
{
    mouseDown = false;

    try { element.releasePointerCapture(e.pointerId); }
    catch (e) {}
}

function lockChange()
{
    const el = op.patch.cg.canvas;

    if (document.pointerLockElement === el || document.mozPointerLockElement === el || document.webkitPointerLockElement === el)
        document.addEventListener("mousemove", onmousemove, false);
}

function onMouseEnter(e)
{
}

initialX.onChange = function ()
{
    px = percX = (initialX.get() * Math.PI * 2);
};

initialAxis.onChange = function ()
{
    py = percY = (initialAxis.get() - 0.5);
    eye = circlePos(percY);
};

const onMouseWheel = function (event)
{
    if (allowZooming.get())
    {
        const delta = CGL.getWheelSpeed(event) * 0.06;
        radius += (parseFloat(delta)) * 1.2;
        eye = circlePos(percY);
    }
};

const ontouchstart = function (event)
{
    if (event.touches && event.touches.length > 0) onMouseDown(event.touches[0]);
};

const ontouchend = function (event)
{
    onMouseUp();
};

const ontouchmove = function (event)
{
    if (event.touches && event.touches.length > 0) onmousemove(event.touches[0]);
};

active.onChange = function ()
{
    if (active.get())bind();
    else unbind();
};

function setElement(ele)
{
    unbind();
    element = ele;
    bind();
}

function bind()
{
    if (!element) return;
    if (!active.get()) return unbind();

    element.addEventListener("pointermove", onmousemove);
    element.addEventListener("pointerdown", onMouseDown);
    element.addEventListener("pointerup", onMouseUp);
    element.addEventListener("pointerleave", onMouseUp);
    element.addEventListener("pointerenter", onMouseEnter);
    element.addEventListener("contextmenu", function (e) { e.preventDefault(); });
    element.addEventListener("wheel", onMouseWheel, { "passive": true });
}

function unbind()
{
    if (!element) return;

    element.removeEventListener("pointermove", onmousemove);
    element.removeEventListener("pointerdown", onMouseDown);
    element.removeEventListener("pointerup", onMouseUp);
    element.removeEventListener("pointerleave", onMouseUp);
    element.removeEventListener("pointerenter", onMouseUp);
    element.removeEventListener("wheel", onMouseWheel);
}


};

Ops.Gl.Matrix.OrbitControls_v3.prototype = new CABLES.Op();
CABLES.OPS["0655b098-d2a8-4ce2-a0b9-ecb2c78f873a"]={f:Ops.Gl.Matrix.OrbitControls_v3,objName:"Ops.Gl.Matrix.OrbitControls_v3"};




// **************************************************************
// 
// Ops.Gl.Meshes.RectangleRounded_v2
// 
// **************************************************************

Ops.Gl.Meshes.RectangleRounded_v2 = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments=op.attachments={};
const render = op.inTrigger("render");
const inSegments = op.inValueInt("Segments", 24);
const trigger = op.outTrigger("trigger");
const sizeW = op.inValueFloat("width", 1);
const sizeH = op.inValueFloat("height", 1);
const borderRadius = op.inValueSlider("border radius", 0.5);

const geom = new CGL.Geometry("triangle");
const geomOut = op.outObject("geometry");

geomOut.ignoreValueSerialize = true;

op.toWorkPortsNeedToBeLinked(render);
op.setPortGroup("Size", [sizeW, sizeH, borderRadius, inSegments]);

const inTopLeftCorner = op.inValueBool("Top Left", true);
const inTopRightCorner = op.inValueBool("Top Right", true);
const inBottomLeftCorner = op.inValueBool("Bottom Left", true);
const inBottomRightCorner = op.inValueBool("Bottom Right", true);
const CORNER_PORTS = [inTopLeftCorner, inTopRightCorner, inBottomLeftCorner, inBottomRightCorner];
CORNER_PORTS.forEach((port) =>
{
    port.onChange = create;
});

op.setPortGroup("Round Corner", CORNER_PORTS);

const draw = op.inValueBool("Draw", true);
op.setPortGroup("Draw", [draw]);

const cgl = op.patch.cgl;
let mesh = null;
sizeW.onChange = create;
sizeH.onChange = create;
borderRadius.onChange = create;
inSegments.onChange = create;

create();

render.onTriggered = function ()
{
    if (draw.get()) mesh.render(cgl.getShader());
    trigger.trigger();
};

function create()
{
    const w = Math.abs(sizeW.get());
    const h = Math.abs(sizeH.get());

    const r = w < h ? (borderRadius.get() * w) / 2 : (borderRadius.get() * h) / 2;

    const wi = w - 2 * r;
    const hi = h - 2 * r;
    const wiHalf = wi / 2;
    const hiHalf = hi / 2;

    const segments = Math.abs(inSegments.get() || 1);

    const topLeftCircleMiddle = [-1 * wiHalf, hiHalf, 0];
    const bottomLeftCircleMiddle = [-1 * wiHalf, -1 * hiHalf, 0];
    const topRightCircleMiddle = [wiHalf, hiHalf, 0];
    const bottomRightCircleMiddle = [wiHalf, -1 * hiHalf, 0];

    const circleVerts = [];
    let lastX = 0;
    let lastY = 0;

    // top left circle
    if (inTopLeftCorner.get())
    {
        for (let i = 0; i <= segments; i += 1)
        {
            const x = topLeftCircleMiddle[0] + (0 - r * Math.cos((i * Math.PI) / 2 / segments));
            const y = topLeftCircleMiddle[1] + r * Math.sin((i * Math.PI) / 2 / segments);

            circleVerts.push(x, y, 0);

            if (i > 1)
            {
                circleVerts.push(lastX, lastY, 0);
            }

            if (i <= segments - 1) circleVerts.push(...topLeftCircleMiddle);

            lastX = x;
            lastY = y;
        }
    }
    else
    {
        circleVerts.push(...topLeftCircleMiddle);
        circleVerts.push(-wiHalf, hiHalf + r, 0);
        circleVerts.push(-wiHalf - r, hiHalf + r, 0);

        circleVerts.push(...topLeftCircleMiddle);
        circleVerts.push(-wiHalf - r, hiHalf + r, 0);
        circleVerts.push(-wiHalf - r, hiHalf, 0);
    }

    if (inTopRightCorner.get())
    {
    // top right circle
        for (let i = 0; i <= segments; i += 1)
        {
            const x = topRightCircleMiddle[0] + r * Math.cos((i * Math.PI) / 2 / segments);
            const y = topRightCircleMiddle[1] + r * Math.sin((i * Math.PI) / 2 / segments);

            if (i > 1)
            {
                circleVerts.push(...topRightCircleMiddle, lastX, lastY, 0);
            }

            circleVerts.push(x, y, 0);

            if (i === segments - 1) circleVerts.push(...topRightCircleMiddle);

            lastX = x;
            lastY = y;
        }
    }
    else
    {
        circleVerts.push(...topRightCircleMiddle);
        circleVerts.push(wiHalf + r, hiHalf, 0);
        circleVerts.push(wiHalf + r, hiHalf + r, 0);

        circleVerts.push(...topRightCircleMiddle);
        circleVerts.push(wiHalf + r, hiHalf + r, 0);
        circleVerts.push(wiHalf, hiHalf + r, 0);
    }

    if (inBottomRightCorner.get())
    {
    // bottom right circle
        for (let i = 0; i <= segments; i += 1)
        {
            const x = bottomRightCircleMiddle[0] + r * Math.cos((i * Math.PI) / 2 / segments);
            const y = bottomRightCircleMiddle[1] + r * -1 * Math.sin((i * Math.PI) / 2 / segments);

            circleVerts.push(x, y, 0);

            if (i > 1)
            {
                circleVerts.push(lastX, lastY, 0);
            }

            if (i <= segments - 1) circleVerts.push(...bottomRightCircleMiddle);

            lastX = x;
            lastY = y;
        }
    }
    else
    {
        circleVerts.push(...bottomRightCircleMiddle);
        circleVerts.push(wiHalf + r, -hiHalf - r, 0);
        circleVerts.push(wiHalf + r, -hiHalf, 0);

        circleVerts.push(...bottomRightCircleMiddle);
        circleVerts.push(wiHalf, -hiHalf - r, 0);
        circleVerts.push(wiHalf + r, -hiHalf - r, 0);
    }

    if (inBottomLeftCorner.get())
    {
    // bottom left circle
        for (let i = 0; i <= segments; i += 1)
        {
            const x = bottomLeftCircleMiddle[0] + r * -1 * Math.cos((i * Math.PI) / 2 / segments);
            const y = bottomLeftCircleMiddle[1] + r * -1 * Math.sin((i * Math.PI) / 2 / segments);

            if (i > 1)
            {
                circleVerts.push(lastX, lastY, 0);
            }

            circleVerts.push(x, y, 0);

            if (i <= segments - 1) circleVerts.push(...bottomLeftCircleMiddle);

            lastX = x;
            lastY = y;
        }
    }
    else
    {
        circleVerts.push(...bottomLeftCircleMiddle);
        circleVerts.push(-wiHalf - r, -hiHalf - r, 0);
        circleVerts.push(-wiHalf, -hiHalf - r, 0);

        circleVerts.push(...bottomLeftCircleMiddle);
        circleVerts.push(-wiHalf - r, -hiHalf, 0);
        circleVerts.push(-wiHalf - r, -hiHalf - r, 0);
    }

    geom.vertices = [
        // inner rectangle

        -1 * wiHalf, -hiHalf, 0,
        wiHalf, hiHalf, 0,
        -1 * wiHalf, hiHalf, 0,

        -1 * wiHalf, -1 * hiHalf, 0,
        wiHalf, -1 * hiHalf, 0,
        wiHalf, hiHalf, 0,

        // left rectangle

        -1 * wiHalf - r, -1 * hiHalf, 0,
        -1 * wiHalf, -1 * hiHalf, 0,
        -1 * wiHalf - r, hiHalf, 0,

        -1 * wiHalf - r, hiHalf, 0,
        -1 * wiHalf, -1 * hiHalf, 0,
        -1 * wiHalf, hiHalf, 0,

        // top rectangle

        -1 * wiHalf, hiHalf, 0,
        wiHalf, hiHalf + r, 0,
        -1 * wiHalf, hiHalf + r, 0,

        wiHalf, hiHalf + r, 0,
        -1 * wiHalf, hiHalf, 0,
        wiHalf, hiHalf, 0,

        // bottom rectangle
        -1 * wiHalf, -1 * hiHalf, 0,
        -1 * wiHalf, -1 * hiHalf - r, 0,
        wiHalf, -1 * hiHalf - r, 0,

        wiHalf, -1 * hiHalf, 0,
        -1 * wiHalf, -1 * hiHalf, 0,
        wiHalf, -1 * hiHalf - r, 0,

        // right rectangle

        wiHalf + r, hiHalf, 0,
        wiHalf, hiHalf, 0,
        wiHalf + r, -1 * hiHalf, 0,

        wiHalf + r, -1 * hiHalf, 0,
        wiHalf, hiHalf, 0,
        wiHalf, -1 * hiHalf, 0,
        ...circleVerts
    ];

    geom.texCoords = [];
    const wAbs = Math.abs(w);
    const hAbs = Math.abs(h);

    for (let i = 0; i < geom.vertices.length; i += 3)
    {
        geom.texCoords[(i / 3) * 2 + 0] = Math.abs(geom.vertices[i + 0] / -wAbs - 0.5);
        geom.texCoords[(i / 3) * 2 + 1] = Math.abs(geom.vertices[i + 1] / hAbs - 0.5);
    }

    geom.vertexNormals = geom.vertices.map((vert, i) => { return (i % 3 === 2 ? 1.0 : 0.0); });
    geom.tangents = geom.vertices.map((vert, i) => { return (i % 3 === 0 ? -1.0 : 0.0); });
    geom.biTangents = geom.vertices.map((vert, i) => { return (i % 3 === 1 ? -1.0 : 0.0); });

    if (geom.vertices.length == 0) return;
    if (mesh) mesh.dispose();
    mesh = null;
    mesh = new CGL.Mesh(cgl, geom);
    geomOut.set(null);
    geomOut.set(geom);
}


};

Ops.Gl.Meshes.RectangleRounded_v2.prototype = new CABLES.Op();
CABLES.OPS["86c99074-4929-44d0-a826-49e7f8bdf5c4"]={f:Ops.Gl.Meshes.RectangleRounded_v2,objName:"Ops.Gl.Meshes.RectangleRounded_v2"};




// **************************************************************
// 
// Ops.Gl.Shader.BasicMaterial_v3
// 
// **************************************************************

Ops.Gl.Shader.BasicMaterial_v3 = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments=op.attachments={"basicmaterial_frag":"{{MODULES_HEAD}}\n\nIN vec2 texCoord;\n\n#ifdef VERTEX_COLORS\nIN vec4 vertCol;\n#endif\n\n#ifdef HAS_TEXTURES\n    IN vec2 texCoordOrig;\n    #ifdef HAS_TEXTURE_DIFFUSE\n        UNI sampler2D tex;\n    #endif\n    #ifdef HAS_TEXTURE_OPACITY\n        UNI sampler2D texOpacity;\n   #endif\n#endif\n\n\n\nvoid main()\n{\n    {{MODULE_BEGIN_FRAG}}\n    vec4 col=color;\n\n\n    #ifdef HAS_TEXTURES\n        vec2 uv=texCoord;\n\n        #ifdef CROP_TEXCOORDS\n            if(uv.x<0.0 || uv.x>1.0 || uv.y<0.0 || uv.y>1.0) discard;\n        #endif\n\n        #ifdef HAS_TEXTURE_DIFFUSE\n            col=texture(tex,uv);\n\n            #ifdef COLORIZE_TEXTURE\n                col.r*=color.r;\n                col.g*=color.g;\n                col.b*=color.b;\n            #endif\n        #endif\n        col.a*=color.a;\n        #ifdef HAS_TEXTURE_OPACITY\n            #ifdef TRANSFORMALPHATEXCOORDS\n                uv=texCoordOrig;\n            #endif\n            #ifdef ALPHA_MASK_IR\n                col.a*=1.0-texture(texOpacity,uv).r;\n            #endif\n            #ifdef ALPHA_MASK_IALPHA\n                col.a*=1.0-texture(texOpacity,uv).a;\n            #endif\n            #ifdef ALPHA_MASK_ALPHA\n                col.a*=texture(texOpacity,uv).a;\n            #endif\n            #ifdef ALPHA_MASK_LUMI\n                col.a*=dot(vec3(0.2126,0.7152,0.0722), texture(texOpacity,uv).rgb);\n            #endif\n            #ifdef ALPHA_MASK_R\n                col.a*=texture(texOpacity,uv).r;\n            #endif\n            #ifdef ALPHA_MASK_G\n                col.a*=texture(texOpacity,uv).g;\n            #endif\n            #ifdef ALPHA_MASK_B\n                col.a*=texture(texOpacity,uv).b;\n            #endif\n            // #endif\n        #endif\n    #endif\n\n    {{MODULE_COLOR}}\n\n    #ifdef DISCARDTRANS\n        if(col.a<0.2) discard;\n    #endif\n\n    #ifdef VERTEX_COLORS\n        col*=vertCol;\n    #endif\n\n    outColor = col;\n}\n","basicmaterial_vert":"\n{{MODULES_HEAD}}\n\nOUT vec2 texCoord;\nOUT vec2 texCoordOrig;\n\nUNI mat4 projMatrix;\nUNI mat4 modelMatrix;\nUNI mat4 viewMatrix;\n\n#ifdef HAS_TEXTURES\n    UNI float diffuseRepeatX;\n    UNI float diffuseRepeatY;\n    UNI float texOffsetX;\n    UNI float texOffsetY;\n#endif\n\n#ifdef VERTEX_COLORS\n    in vec4 attrVertColor;\n    out vec4 vertCol;\n\n#endif\n\n\nvoid main()\n{\n    mat4 mMatrix=modelMatrix;\n    mat4 modelViewMatrix;\n\n    norm=attrVertNormal;\n    texCoordOrig=attrTexCoord;\n    texCoord=attrTexCoord;\n    #ifdef HAS_TEXTURES\n        texCoord.x=texCoord.x*diffuseRepeatX+texOffsetX;\n        texCoord.y=(1.0-texCoord.y)*diffuseRepeatY+texOffsetY;\n    #endif\n\n    #ifdef VERTEX_COLORS\n        vertCol=attrVertColor;\n    #endif\n\n    vec4 pos = vec4(vPosition, 1.0);\n\n    #ifdef BILLBOARD\n       vec3 position=vPosition;\n       modelViewMatrix=viewMatrix*modelMatrix;\n\n       gl_Position = projMatrix * modelViewMatrix * vec4((\n           position.x * vec3(\n               modelViewMatrix[0][0],\n               modelViewMatrix[1][0],\n               modelViewMatrix[2][0] ) +\n           position.y * vec3(\n               modelViewMatrix[0][1],\n               modelViewMatrix[1][1],\n               modelViewMatrix[2][1]) ), 1.0);\n    #endif\n\n    {{MODULE_VERTEX_POSITION}}\n\n    #ifndef BILLBOARD\n        modelViewMatrix=viewMatrix * mMatrix;\n\n        {{MODULE_VERTEX_MODELVIEW}}\n\n    #endif\n\n    // mat4 modelViewMatrix=viewMatrix*mMatrix;\n\n    #ifndef BILLBOARD\n        // gl_Position = projMatrix * viewMatrix * modelMatrix * pos;\n        gl_Position = projMatrix * modelViewMatrix * pos;\n    #endif\n}\n",};
const render = op.inTrigger("render");
const trigger = op.outTrigger("trigger");
const shaderOut = op.outObject("shader", null, "shader");

shaderOut.ignoreValueSerialize = true;

op.toWorkPortsNeedToBeLinked(render);
op.toWorkShouldNotBeChild("Ops.Gl.TextureEffects.ImageCompose", CABLES.OP_PORT_TYPE_FUNCTION);

const cgl = op.patch.cgl;
const shader = new CGL.Shader(cgl, "basicmaterialnew", this);
shader.addAttribute({ "type": "vec3", "name": "vPosition" });
shader.addAttribute({ "type": "vec2", "name": "attrTexCoord" });
shader.addAttribute({ "type": "vec3", "name": "attrVertNormal", "nameFrag": "norm" });
shader.addAttribute({ "type": "float", "name": "attrVertIndex" });

shader.setModules(["MODULE_VERTEX_POSITION", "MODULE_COLOR", "MODULE_BEGIN_FRAG", "MODULE_VERTEX_MODELVIEW"]);

shader.setSource(attachments.basicmaterial_vert, attachments.basicmaterial_frag);

shaderOut.setRef(shader);

render.onTriggered = doRender;

// rgba colors
const r = op.inValueSlider("r", Math.random());
const g = op.inValueSlider("g", Math.random());
const b = op.inValueSlider("b", Math.random());
const a = op.inValueSlider("a", 1);
r.setUiAttribs({ "colorPick": true });

// const uniColor=new CGL.Uniform(shader,'4f','color',r,g,b,a);
const colUni = shader.addUniformFrag("4f", "color", r, g, b, a);

shader.uniformColorDiffuse = colUni;

// diffuse outTexture

const diffuseTexture = op.inTexture("texture");
let diffuseTextureUniform = null;
diffuseTexture.onChange = updateDiffuseTexture;

const colorizeTexture = op.inValueBool("colorizeTexture", false);
const vertexColors = op.inValueBool("Vertex Colors", false);

// opacity texture
const textureOpacity = op.inTexture("textureOpacity");
let textureOpacityUniform = null;

const alphaMaskSource = op.inSwitch("Alpha Mask Source", ["Luminance", "R", "G", "B", "A", "1-A", "1-R"], "Luminance");
alphaMaskSource.setUiAttribs({ "greyout": true });
textureOpacity.onChange = updateOpacity;

const texCoordAlpha = op.inValueBool("Opacity TexCoords Transform", false);
const discardTransPxl = op.inValueBool("Discard Transparent Pixels");

// texture coords
const
    diffuseRepeatX = op.inValue("diffuseRepeatX", 1),
    diffuseRepeatY = op.inValue("diffuseRepeatY", 1),
    diffuseOffsetX = op.inValue("Tex Offset X", 0),
    diffuseOffsetY = op.inValue("Tex Offset Y", 0),
    cropRepeat = op.inBool("Crop TexCoords", false);

shader.addUniformFrag("f", "diffuseRepeatX", diffuseRepeatX);
shader.addUniformFrag("f", "diffuseRepeatY", diffuseRepeatY);
shader.addUniformFrag("f", "texOffsetX", diffuseOffsetX);
shader.addUniformFrag("f", "texOffsetY", diffuseOffsetY);

const doBillboard = op.inValueBool("billboard", false);

alphaMaskSource.onChange =
    doBillboard.onChange =
    discardTransPxl.onChange =
    texCoordAlpha.onChange =
    cropRepeat.onChange =
    vertexColors.onChange =
    colorizeTexture.onChange = updateDefines;

op.setPortGroup("Color", [r, g, b, a]);
op.setPortGroup("Color Texture", [diffuseTexture, vertexColors, colorizeTexture]);
op.setPortGroup("Opacity", [textureOpacity, alphaMaskSource, discardTransPxl, texCoordAlpha]);
op.setPortGroup("Texture Transform", [diffuseRepeatX, diffuseRepeatY, diffuseOffsetX, diffuseOffsetY, cropRepeat]);

updateOpacity();
updateDiffuseTexture();

op.preRender = function ()
{
    shader.bind();
    doRender();
};

function doRender()
{
    if (!shader) return;

    cgl.pushShader(shader);
    shader.popTextures();

    if (diffuseTextureUniform && diffuseTexture.get()) shader.pushTexture(diffuseTextureUniform, diffuseTexture.get());
    if (textureOpacityUniform && textureOpacity.get()) shader.pushTexture(textureOpacityUniform, textureOpacity.get());

    trigger.trigger();

    cgl.popShader();
}

function updateOpacity()
{
    if (textureOpacity.get())
    {
        if (textureOpacityUniform !== null) return;
        shader.removeUniform("texOpacity");
        shader.define("HAS_TEXTURE_OPACITY");
        if (!textureOpacityUniform)textureOpacityUniform = new CGL.Uniform(shader, "t", "texOpacity");
    }
    else
    {
        shader.removeUniform("texOpacity");
        shader.removeDefine("HAS_TEXTURE_OPACITY");
        textureOpacityUniform = null;
    }

    updateDefines();
}

function updateDiffuseTexture()
{
    if (diffuseTexture.get())
    {
        if (!shader.hasDefine("HAS_TEXTURE_DIFFUSE"))shader.define("HAS_TEXTURE_DIFFUSE");
        if (!diffuseTextureUniform)diffuseTextureUniform = new CGL.Uniform(shader, "t", "texDiffuse");
    }
    else
    {
        shader.removeUniform("texDiffuse");
        shader.removeDefine("HAS_TEXTURE_DIFFUSE");
        diffuseTextureUniform = null;
    }
    updateUi();
}

function updateUi()
{
    const hasTexture = diffuseTexture.isLinked() || textureOpacity.isLinked();
    diffuseRepeatX.setUiAttribs({ "greyout": !hasTexture });
    diffuseRepeatY.setUiAttribs({ "greyout": !hasTexture });
    diffuseOffsetX.setUiAttribs({ "greyout": !hasTexture });
    diffuseOffsetY.setUiAttribs({ "greyout": !hasTexture });
    colorizeTexture.setUiAttribs({ "greyout": !hasTexture });

    alphaMaskSource.setUiAttribs({ "greyout": !textureOpacity.get() });
    texCoordAlpha.setUiAttribs({ "greyout": !textureOpacity.get() });

    let notUsingColor = true;
    notUsingColor = diffuseTexture.get() && !colorizeTexture.get();
    r.setUiAttribs({ "greyout": notUsingColor });
    g.setUiAttribs({ "greyout": notUsingColor });
    b.setUiAttribs({ "greyout": notUsingColor });
}

function updateDefines()
{
    shader.toggleDefine("VERTEX_COLORS", vertexColors.get());
    shader.toggleDefine("CROP_TEXCOORDS", cropRepeat.get());
    shader.toggleDefine("COLORIZE_TEXTURE", colorizeTexture.get());
    shader.toggleDefine("TRANSFORMALPHATEXCOORDS", texCoordAlpha.get());
    shader.toggleDefine("DISCARDTRANS", discardTransPxl.get());
    shader.toggleDefine("BILLBOARD", doBillboard.get());

    shader.toggleDefine("ALPHA_MASK_ALPHA", alphaMaskSource.get() == "A");
    shader.toggleDefine("ALPHA_MASK_IALPHA", alphaMaskSource.get() == "1-A");
    shader.toggleDefine("ALPHA_MASK_IR", alphaMaskSource.get() == "1-R");
    shader.toggleDefine("ALPHA_MASK_LUMI", alphaMaskSource.get() == "Luminance");
    shader.toggleDefine("ALPHA_MASK_R", alphaMaskSource.get() == "R");
    shader.toggleDefine("ALPHA_MASK_G", alphaMaskSource.get() == "G");
    shader.toggleDefine("ALPHA_MASK_B", alphaMaskSource.get() == "B");
    updateUi();
}


};

Ops.Gl.Shader.BasicMaterial_v3.prototype = new CABLES.Op();
CABLES.OPS["ec55d252-3843-41b1-b731-0482dbd9e72b"]={f:Ops.Gl.Shader.BasicMaterial_v3,objName:"Ops.Gl.Shader.BasicMaterial_v3"};




// **************************************************************
// 
// Ops.Trigger.Repeat_v2
// 
// **************************************************************

Ops.Trigger.Repeat_v2 = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments=op.attachments={};
const
    exe=op.inTrigger("Execute"),
    num=op.inValueInt("Repeats",5),
    dir=op.inSwitch("Direction",['Forward','Backward'],'Forward'),
    next=op.outTrigger("Next"),
    idx=op.addOutPort(new CABLES.Port(op,"index"));

dir.onChange=updateDir;
updateDir();

function updateDir()
{
    if(dir.get()=="Forward") exe.onTriggered=forward;
    else exe.onTriggered=backward;
}

function forward()
{
    const max=Math.floor(num.get());

    for(var i=0;i<max;i++)
    {
        idx.set(i);
        next.trigger();
    }
}

function backward()
{
    const numi=Math.floor(num.get());
    for(var i=numi-1;i>-1;i--)
    {
        idx.set(i);
        next.trigger();
    }
}


};

Ops.Trigger.Repeat_v2.prototype = new CABLES.Op();
CABLES.OPS["a4deea80-db97-478f-ad1a-5ee30f2f47cc"]={f:Ops.Trigger.Repeat_v2,objName:"Ops.Trigger.Repeat_v2"};




// **************************************************************
// 
// Ops.Array.PointArray.PointsSphereRandom
// 
// **************************************************************

Ops.Array.PointArray.PointsSphereRandom = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments=op.attachments={};
const
    num = op.inValueInt("Amount of points", 100),
    size = op.inValue("Sphere size", 1),
    seed = op.inValue("Random seed", 0),
    distRand = op.inValueSlider("Random distance from sphere", 0),
    distrib = op.inValueSelect("Distribution", ["Uniform", "Poles", "Half"], "Uniform"),
    outArray = op.outArray("Array out", 3),
    totalPointsOut = op.outNumber("Total points"),
    arrayLengthOut = op.outNumber("Array length");

let newArr = [];
outArray.set(newArr);

seed.onChange =
    num.onChange =
    size.onChange =
    distrib.onChange =
    distRand.onChange =
    outArray.onLinkChanged = generate;

generate();

function generate()
{
    const verts = [];
    verts.length = Math.max(0, Math.round(num.get()) * 3);

    Math.randomSeed = seed.get();

    let rndq = quat.create();
    let tempv = vec3.create();

    let dist = 0;
    if (distrib.get() == "Poles")dist = 1;
    if (distrib.get() == "Half")dist = 2;

    let dRand = distRand.get();

    for (let i = 0; i < num.get(); i++)
    {
        if (dist == 1 || dist == 2)
        {
            rndq[0] = Math.seededRandom();
            rndq[1] = Math.seededRandom();
            rndq[2] = Math.seededRandom();
            rndq[3] = Math.seededRandom();
        }
        else
        {
            rndq[0] = Math.seededRandom() * 2.0 - 1.0;
            rndq[1] = Math.seededRandom() * 2.0 - 1.0;
            rndq[2] = Math.seededRandom() * 2.0 - 1.0;
            rndq[3] = Math.seededRandom() * 2.0 - 1.0;
        }

        quat.normalize(rndq, rndq);

        if (dist == 2)
        {
            tempv[0] = size.get();
        }
        else
        {
            if (i % 2 === 0) tempv[0] = -size.get();
            else tempv[0] = size.get();
        }

        tempv[1] = 0;
        tempv[2] = 0;

        if (dRand !== 0) tempv[0] -= Math.random() * dRand;

        vec3.transformQuat(tempv, tempv, rndq);
        verts[i * 3] = tempv[0];
        verts[i * 3 + 1] = tempv[1];
        verts[i * 3 + 2] = tempv[2];
    }

    outArray.set(null);
    outArray.set(verts);
    totalPointsOut.set(verts.length / 3);
    arrayLengthOut.set(verts.length);
}


};

Ops.Array.PointArray.PointsSphereRandom.prototype = new CABLES.Op();
CABLES.OPS["1ea17de7-adad-4053-943a-4874bccf54e9"]={f:Ops.Array.PointArray.PointsSphereRandom,objName:"Ops.Array.PointArray.PointsSphereRandom"};




// **************************************************************
// 
// Ops.Array.Array3GetNumbers
// 
// **************************************************************

Ops.Array.Array3GetNumbers = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments=op.attachments={};
const
    pArr = op.inArray("Array", 3),
    pIndex = op.inValueInt("Index"),
    outX = op.outNumber("X"),
    outY = op.outNumber("Y"),
    outZ = op.outNumber("Z");

pArr.onChange =
    pIndex.onChange = update;

function update()
{
    let arr = pArr.get();
    if (!arr)
    {
        outX.set(0);
        outY.set(0);
        outZ.set(0);
        return;
    }
    let ind = Math.min(arr.length - 3, pIndex.get() * 3);
    if (arr)
    {
        outX.set(arr[ind + 0]);
        outY.set(arr[ind + 1]);
        outZ.set(arr[ind + 2]);
    }
}


};

Ops.Array.Array3GetNumbers.prototype = new CABLES.Op();
CABLES.OPS["56882cc4-c40d-4dc0-bf7c-db1b5a7acad0"]={f:Ops.Array.Array3GetNumbers,objName:"Ops.Array.Array3GetNumbers"};




// **************************************************************
// 
// Ops.Gl.Matrix.Transform
// 
// **************************************************************

Ops.Gl.Matrix.Transform = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments=op.attachments={};
const
    render = op.inTrigger("render"),
    posX = op.inValue("posX", 0),
    posY = op.inValue("posY", 0),
    posZ = op.inValue("posZ", 0),
    scale = op.inValue("scale", 1),
    rotX = op.inValue("rotX", 0),
    rotY = op.inValue("rotY", 0),
    rotZ = op.inValue("rotZ", 0),
    trigger = op.outTrigger("trigger");

op.setPortGroup("Rotation", [rotX, rotY, rotZ]);
op.setPortGroup("Position", [posX, posY, posZ]);
op.setPortGroup("Scale", [scale]);
op.setUiAxisPorts(posX, posY, posZ);

op.toWorkPortsNeedToBeLinked(render, trigger);

const vPos = vec3.create();
const vScale = vec3.create();
const transMatrix = mat4.create();
mat4.identity(transMatrix);

let
    doScale = false,
    doTranslate = false,
    translationChanged = true,
    scaleChanged = true,
    rotChanged = true;

rotX.onChange = rotY.onChange = rotZ.onChange = setRotChanged;
posX.onChange = posY.onChange = posZ.onChange = setTranslateChanged;
scale.onChange = setScaleChanged;

render.onTriggered = function ()
{
    // if(!CGL.TextureEffect.checkOpNotInTextureEffect(op)) return;

    let updateMatrix = false;
    if (translationChanged)
    {
        updateTranslation();
        updateMatrix = true;
    }
    if (scaleChanged)
    {
        updateScale();
        updateMatrix = true;
    }
    if (rotChanged) updateMatrix = true;

    if (updateMatrix) doUpdateMatrix();

    const cg = op.patch.cg || op.patch.cgl;
    cg.pushModelMatrix();
    mat4.multiply(cg.mMatrix, cg.mMatrix, transMatrix);

    trigger.trigger();
    cg.popModelMatrix();

    if (CABLES.UI)
    {
        if (!posX.isLinked() && !posY.isLinked() && !posZ.isLinked())
        {
            gui.setTransform(op.id, posX.get(), posY.get(), posZ.get());

            if (op.isCurrentUiOp())
                gui.setTransformGizmo(
                    {
                        "posX": posX,
                        "posY": posY,
                        "posZ": posZ,
                    });
        }
    }
};

// op.transform3d = function ()
// {
//     return { "pos": [posX, posY, posZ] };
// };

function doUpdateMatrix()
{
    mat4.identity(transMatrix);
    if (doTranslate)mat4.translate(transMatrix, transMatrix, vPos);

    if (rotX.get() !== 0)mat4.rotateX(transMatrix, transMatrix, rotX.get() * CGL.DEG2RAD);
    if (rotY.get() !== 0)mat4.rotateY(transMatrix, transMatrix, rotY.get() * CGL.DEG2RAD);
    if (rotZ.get() !== 0)mat4.rotateZ(transMatrix, transMatrix, rotZ.get() * CGL.DEG2RAD);

    if (doScale)mat4.scale(transMatrix, transMatrix, vScale);
    rotChanged = false;
}

function updateTranslation()
{
    doTranslate = false;
    if (posX.get() !== 0.0 || posY.get() !== 0.0 || posZ.get() !== 0.0) doTranslate = true;
    vec3.set(vPos, posX.get(), posY.get(), posZ.get());
    translationChanged = false;
}

function updateScale()
{
    // doScale=false;
    // if(scale.get()!==0.0)
    doScale = true;
    vec3.set(vScale, scale.get(), scale.get(), scale.get());
    scaleChanged = false;
}

function setTranslateChanged()
{
    translationChanged = true;
}

function setScaleChanged()
{
    scaleChanged = true;
}

function setRotChanged()
{
    rotChanged = true;
}

doUpdateMatrix();


};

Ops.Gl.Matrix.Transform.prototype = new CABLES.Op();
CABLES.OPS["650baeb1-db2d-4781-9af6-ab4e9d4277be"]={f:Ops.Gl.Matrix.Transform,objName:"Ops.Gl.Matrix.Transform"};




// **************************************************************
// 
// Ops.Array.ArrayLength_v2
// 
// **************************************************************

Ops.Array.ArrayLength_v2 = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments=op.attachments={};
const
    array = op.inArray("array"),
    outLength = op.outNumber("length");

outLength.ignoreValueSerialize = true;

function update()
{
    let l = 0;
    if (array.get()) l = array.get().length;
    outLength.set(l);
}

array.onChange = update;


};

Ops.Array.ArrayLength_v2.prototype = new CABLES.Op();
CABLES.OPS["6f665caa-96ed-45d8-8620-e34f0f8e062c"]={f:Ops.Array.ArrayLength_v2,objName:"Ops.Array.ArrayLength_v2"};




// **************************************************************
// 
// Ops.Vars.VarSetNumber_v2
// 
// **************************************************************

Ops.Vars.VarSetNumber_v2 = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments=op.attachments={};
const val = op.inValueFloat("Value", 0);
op.varName = op.inDropDown("Variable", [], "", true);

new CABLES.VarSetOpWrapper(op, "number", val, op.varName);


};

Ops.Vars.VarSetNumber_v2.prototype = new CABLES.Op();
CABLES.OPS["b5249226-6095-4828-8a1c-080654e192fa"]={f:Ops.Vars.VarSetNumber_v2,objName:"Ops.Vars.VarSetNumber_v2"};




// **************************************************************
// 
// Ops.Vars.VarGetNumber_v2
// 
// **************************************************************

Ops.Vars.VarGetNumber_v2 = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments=op.attachments={};
const val = op.outNumber("Value");
op.varName = op.inValueSelect("Variable", [], "", true);

new CABLES.VarGetOpWrapper(op, "number", op.varName, val);


};

Ops.Vars.VarGetNumber_v2.prototype = new CABLES.Op();
CABLES.OPS["421f5b52-c0fa-47c4-8b7a-012b9e1c864a"]={f:Ops.Vars.VarGetNumber_v2,objName:"Ops.Vars.VarGetNumber_v2"};




// **************************************************************
// 
// Ops.Gl.ClearDepth
// 
// **************************************************************

Ops.Gl.ClearDepth = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments=op.attachments={};

const
    render=op.inTrigger('render'),
    trigger=op.outTrigger('trigger'),
    cgl=op.patch.cgl;

render.onTriggered=function()
{
    cgl.gl.clear(cgl.gl.DEPTH_BUFFER_BIT);
    trigger.trigger();
};




};

Ops.Gl.ClearDepth.prototype = new CABLES.Op();
CABLES.OPS["9e8a4b73-4ba7-4c4f-b266-81c5f9db9b7a"]={f:Ops.Gl.ClearDepth,objName:"Ops.Gl.ClearDepth"};




// **************************************************************
// 
// Ops.Array.StringToArray_v2
// 
// **************************************************************

Ops.Array.StringToArray_v2 = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments=op.attachments={};
const text = op.inStringEditor("text", "1,2,3"),
    separator = op.inString("separator", ","),
    toNumber = op.inValueBool("Numbers", true),
    trim = op.inValueBool("Trim", true),
    splitNewLines = op.inBool("Split Lines", false),
    arr = op.outArray("array"),
    parsed = op.outTrigger("Parsed"),
    len = op.outNumber("length");

text.setUiAttribs({ "ignoreBigPort": true });

text.onChange = separator.onChange = toNumber.onChange = trim.onChange = parse;

splitNewLines.onChange = () =>
{
    separator.setUiAttribs({ "greyout": splitNewLines.get() });
    parse();
};

parse();

function parse()
{
    if (!text.get())
    {
        arr.set(null);
        arr.set([]);
        len.set(0);
        return;
    }

    let textInput = text.get();
    if (trim.get() && textInput)
    {
        textInput = textInput.replace(/^\s+|\s+$/g, "");
        textInput = textInput.trim();
    }

    let r;
    let sep = separator.get();
    if (separator.get() === "\\n") sep = "\n";
    if (splitNewLines.get()) r = textInput.split("\n");
    else r = textInput.split(sep);

    if (r[r.length - 1] === "") r.length -= 1;

    len.set(r.length);

    if (trim.get())
    {
        for (let i = 0; i < r.length; i++)
        {
            r[i] = r[i].replace(/^\s+|\s+$/g, "");
            r[i] = r[i].trim();
        }
    }

    op.setUiError("notnum", null);
    if (toNumber.get())
    {
        let hasStrings = false;
        for (let i = 0; i < r.length; i++)
        {
            r[i] = Number(r[i]);
            if (!CABLES.UTILS.isNumeric(r[i]))
            {
                hasStrings = true;
            }
        }
        if (hasStrings)
        {
            op.setUiError("notnum", "Parse Error / Not all values numerical!", 1);
        }
    }

    arr.setRef(r);
    parsed.trigger();
}


};

Ops.Array.StringToArray_v2.prototype = new CABLES.Op();
CABLES.OPS["c974de41-4ce4-4432-b94d-724741109c71"]={f:Ops.Array.StringToArray_v2,objName:"Ops.Array.StringToArray_v2"};




// **************************************************************
// 
// Ops.Gl.TextureArrayLoaderFromArray_v2
// 
// **************************************************************

Ops.Gl.TextureArrayLoaderFromArray_v2 = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments=op.attachments={};
const
    filenames = op.inArray("urls"),
    tfilter = op.inDropDown("filter", ["nearest", "linear", "mipmap"], "linear"),
    wrap = op.inDropDown("wrap", ["repeat", "mirrored repeat", "clamp to edge"], "repeat"),
    flip = op.inBool("Flip", false),
    unpackAlpha = op.inBool("unpackPreMultipliedAlpha", false),
    inCaching = op.inBool("Caching", false),
    inPatchAsset = op.inBool("Asset in patch", false),
    arrOut = op.outArray("TextureArray"),
    width = op.outNumber("width"),
    height = op.outNumber("height"),
    loading = op.outBoolNum("loading"),
    ratio = op.outNumber("Aspect Ratio");

op.toWorkPortsNeedToBeLinked(filenames);

const cgl = op.patch.cgl;
const arr = [];
let cgl_filter = CGL.Texture.FILTER_LINEAR;
let cgl_wrap = CGL.Texture.WRAP_MIRRORED_REPEAT;
let loadingId = null;
let timedLoader = 0;
arrOut.set(arr);

inPatchAsset.onChange =
    flip.onChange =
    unpackAlpha.onChange =
    filenames.onChange = reload;

tfilter.onChange = onFilterChange;
wrap.onChange = onWrapChange;

function reload(nocache)
{
    if (!filenames.isLinked())
    {
        arrOut.setRef(null);
        return;
    }
    clearTimeout(timedLoader);
    timedLoader = setTimeout(function ()
    {
        realReload(nocache);
    }, 30);
}

function loadImage(_i, _url, nocache, cb)
{
    let url = _url;
    const i = _i;
    if (!url) return;

    if (inPatchAsset.get())
    {
        let patchId = null;
        if (op.storage && op.storage.blueprint && op.storage.blueprint.patchId)
        {
            patchId = op.storage.blueprint.patchId;
        }
        url = op.patch.getAssetPath(patchId) + url;
    }

    url = op.patch.getFilePath(url);

    if (!inCaching.get()) if (nocache)url += "?rnd=" + CABLES.generateUUID();

    let tex = CGL.Texture.load(cgl, url,
        function (err)
        {
            if (err)
            {
                const errMsg = "could not load texture \"" + url + "\"";
                op.uiAttr({ "error": errMsg });
                op.warn("[TextureArrayLoader] " + errMsg);
                if (cb)cb();
                return;
            }
            else op.uiAttr({ "error": null });

            width.set(tex.width);
            height.set(tex.height);
            ratio.set(tex.width / tex.height);

            arr[i] = tex;

            arrOut.setRef(arr);
            if (cb)cb();
        }, {
            "wrap": cgl_wrap,
            "flip": flip.get(),
            "unpackAlpha": unpackAlpha.get(),
            "filter": cgl_filter
        });
}

function realReload(nocache)
{
    const files = filenames.get();

    if (!files || files.length == 0) return;

    if (loadingId)cgl.patch.loading.finished(loadingId);

    loadingId = cgl.patch.loading.start("texturearray", CABLES.uuid(), op);
    loading.set(true);

    for (let i = 0; i < files.length; i++)
    {
        arr[i] = CGL.Texture.getEmptyTexture(cgl);
        let cb = null;
        if (i == files.length - 1)
        {
            cb = () =>
            {
                loading.set(false);
                cgl.patch.loading.finished(loadingId);
            };
        }

        if (!files[i]) { if (cb) cb(); }
        else loadImage(i, files[i], nocache, cb);
    }
}

function onFilterChange()
{
    if (tfilter.get() == "nearest") cgl_filter = CGL.Texture.FILTER_NEAREST;
    if (tfilter.get() == "linear") cgl_filter = CGL.Texture.FILTER_LINEAR;
    if (tfilter.get() == "mipmap") cgl_filter = CGL.Texture.FILTER_MIPMAP;

    reload();
}

function onWrapChange()
{
    if (wrap.get() == "repeat") cgl_wrap = CGL.Texture.WRAP_REPEAT;
    if (wrap.get() == "mirrored repeat") cgl_wrap = CGL.Texture.WRAP_MIRRORED_REPEAT;
    if (wrap.get() == "clamp to edge") cgl_wrap = CGL.Texture.WRAP_CLAMP_TO_EDGE;

    reload();
}

op.onFileChanged = function (fn)
{
    // should reload changed files that are used in the array
};


};

Ops.Gl.TextureArrayLoaderFromArray_v2.prototype = new CABLES.Op();
CABLES.OPS["f994015c-72ab-42f4-9ef7-a6409a9efb9b"]={f:Ops.Gl.TextureArrayLoaderFromArray_v2,objName:"Ops.Gl.TextureArrayLoaderFromArray_v2"};




// **************************************************************
// 
// Ops.Gl.ClearColor
// 
// **************************************************************

Ops.Gl.ClearColor = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments=op.attachments={};
const
    render = op.inTrigger("render"),
    trigger = op.outTrigger("trigger"),
    r = op.inFloatSlider("r", 0.1),
    g = op.inFloatSlider("g", 0.1),
    b = op.inFloatSlider("b", 0.1),
    a = op.inFloatSlider("a", 1);

r.setUiAttribs({ "colorPick": true });

const cgl = op.patch.cgl;

render.onTriggered = function ()
{
    cgl.gl.clearColor(r.get(), g.get(), b.get(), a.get());
    cgl.gl.clear(cgl.gl.COLOR_BUFFER_BIT | cgl.gl.DEPTH_BUFFER_BIT);
    trigger.trigger();
};


};

Ops.Gl.ClearColor.prototype = new CABLES.Op();
CABLES.OPS["19b441eb-9f63-4f35-ba08-b87841517c4d"]={f:Ops.Gl.ClearColor,objName:"Ops.Gl.ClearColor"};




// **************************************************************
// 
// Ops.Vars.VarSetString_v2
// 
// **************************************************************

Ops.Vars.VarSetString_v2 = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments=op.attachments={};
const val=op.inString("Value","New String");
op.varName=op.inDropDown("Variable",[],"",true);

new CABLES.VarSetOpWrapper(op,"string",val,op.varName);




};

Ops.Vars.VarSetString_v2.prototype = new CABLES.Op();
CABLES.OPS["0b4d9229-8024-4a30-9cc0-f6653942c2e4"]={f:Ops.Vars.VarSetString_v2,objName:"Ops.Vars.VarSetString_v2"};




// **************************************************************
// 
// Ops.Vars.VarGetString
// 
// **************************************************************

Ops.Vars.VarGetString = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments=op.attachments={};
var val=op.outString("Value");
op.varName=op.inValueSelect("Variable",[],"",true);

new CABLES.VarGetOpWrapper(op,"string",op.varName,val);


};

Ops.Vars.VarGetString.prototype = new CABLES.Op();
CABLES.OPS["3ad08cfc-bce6-4175-9746-fef2817a3b12"]={f:Ops.Vars.VarGetString,objName:"Ops.Vars.VarGetString"};




// **************************************************************
// 
// Ops.Color.HexToRGB_v2
// 
// **************************************************************

Ops.Color.HexToRGB_v2 = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments=op.attachments={};
const
    hex = op.inString("Hex", "#ff0000"),
    asBytes = op.inValueBool("Bytes"),
    outR = op.outNumber("R"),
    outG = op.outNumber("G"),
    outB = op.outNumber("B");

function hexToR(h)
{
    return parseInt((cutHex(h)).substring(0, 2), 16) || 0;
}

function hexToG(h)
{
    return parseInt((cutHex(h)).substring(2, 4), 16) || 0;
}

function hexToB(h)
{
    return parseInt((cutHex(h)).substring(4, 6), 16) || 0;
}

function cutHex(h = "")
{
    return (h.charAt(0) == "#") ? h.substring(1, 7) : h;
}

hex.onChange = parse;
asBytes.onChange = parse;

function parse()
{
    let str = hex.get() || "";
    let r = hexToR(str);
    let g = hexToG(str);
    let b = hexToB(str);

    if (!asBytes.get())
    {
        r /= 255;
        g /= 255;
        b /= 255;
    }

    outR.set(r);
    outB.set(b);
    outG.set(g);
}


};

Ops.Color.HexToRGB_v2.prototype = new CABLES.Op();
CABLES.OPS["9877f198-8dac-48e5-9310-244ef1a8dec5"]={f:Ops.Color.HexToRGB_v2,objName:"Ops.Color.HexToRGB_v2"};




// **************************************************************
// 
// Ops.Gl.Matrix.Billboard
// 
// **************************************************************

Ops.Gl.Matrix.Billboard = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments=op.attachments={};
const exec = op.inTrigger("Exec");
const next = op.outTrigger("Next");

const cgl = op.patch.cgl;

let mm = mat4.create();
let mv = mat4.create();
let m = mat4.create();
let mempty = mat4.create();

exec.onTriggered = function ()
{
    mat4.invert(mm, cgl.mMatrix);
    mat4.invert(mv, cgl.vMatrix);

    mat4.mul(mm, mm, mv);

    mm[12] = 0;
    mm[13] = 0;
    mm[14] = 0;

    cgl.pushModelMatrix();
    cgl.pushViewMatrix();
    mat4.mul(cgl.mMatrix, cgl.mMatrix, mm);
    next.trigger();
    cgl.popViewMatrix();
    cgl.popModelMatrix();
};


};

Ops.Gl.Matrix.Billboard.prototype = new CABLES.Op();
CABLES.OPS["d41e676e-d8a7-4a1e-8abf-f1bddfc982d5"]={f:Ops.Gl.Matrix.Billboard,objName:"Ops.Gl.Matrix.Billboard"};



window.addEventListener('load', function(event) {
CABLES.jsLoaded=new Event('CABLES.jsLoaded');
document.dispatchEvent(CABLES.jsLoaded);
});
