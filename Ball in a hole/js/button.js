export default class RestartButton {
    constructor(callback) {
        this.class = 'restart'
        this.button = document.createElement('button');
        this.button.innerText = "JESZCZE RAZ";
        this.button.classList.add(this.class);
        this.button.addEventListener('click', callback.restart)
        return this.button
    }
}