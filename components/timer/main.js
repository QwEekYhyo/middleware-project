class TimerComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.timeLeft = 20;
        this.render();
        this.startTimer();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <div id="timer">${this.timeLeft}</div>
        `;
    }

    startTimer() {
        this.interval = setInterval(() => {
            if (this.timeLeft <= 0) {
                clearInterval(this.interval);
                this.parentElement.style.display = 'none';
            } else {
                this.timeLeft -= 1;
                this.shadowRoot.getElementById('timer').textContent = this.timeLeft;
            }
        }, 1000);
    }
}

customElements.define('timer-component', TimerComponent);