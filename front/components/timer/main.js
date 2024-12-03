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
        clearInterval(this.interval);
        this.interval = setInterval(() => {
            if (this.timeLeft <= 0) {
                clearInterval(this.interval);
                this.dispatchEvent(new Event('timer-finished', { bubbles: true, composed: true }));
            } else {
                this.timeLeft -= 1;
                this.shadowRoot.getElementById('timer').textContent = this.timeLeft;
            }
        }, 1000);
    }

    resetTimer(duration = 20) {
        clearInterval(this.interval);
        this.timeLeft = duration;
        this.render();
        this.startTimer();
    }
}

customElements.define('timer-component', TimerComponent);
