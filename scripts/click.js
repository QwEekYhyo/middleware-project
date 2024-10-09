const image = document.getElementById("clicked-position");

const clickHandler = (event) => {
    console.log("x: %d, y: %d", event.clientX, event.clientY);
    const clickedElement = event.target;
    if (clickedElement.id === "map-view" || clickedElement.tagName === "MAIN") {
        image.style.visibility = "visible";
        image.style.left = event.clientX - 15 + "px";
        image.style.top = event.clientY - 15 + "px";
    } else {
        image.style.visibility = "hidden";
    }
};

const body = document.body;
body.addEventListener("click", clickHandler);
