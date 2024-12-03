let popUpWidget = null;
let popUpContent = null;
let timerComponent= null;

document.addEventListener("DOMContentLoaded", () => {
    popUpWidget = document.querySelector("#message-container custom-widget");
    popUpContent = popUpWidget.querySelector("pop-up-content");
    timerComponent = popUpContent.shadowRoot.querySelector("timer-component");

    popUpContent.addEventListener("popup-closed", () => {
        popUpWidget.style.display = "none";
    });

    popUpContent.addEventListener("timer-finished", () => {
        popUpWidget.style.display = "none";
    });
});

export function triggerPopUp(message, timerDuration = 20) {
    popUpWidget.style.display = "block";
    popUpContent.updateMessage(message);
    timerComponent.resetTimer(timerDuration);
}
