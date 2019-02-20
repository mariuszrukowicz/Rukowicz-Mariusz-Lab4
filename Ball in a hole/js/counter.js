/* Dziura-cel*/
export default class Counter {
    constructor({
        endGame,
        score = _ => {}
    } = {}) {
        this.placeToRender = document.querySelector('.counter'),
            this.time = 30,
            this.callback = endGame;
        this.score = score;
        this.timer = this.render(this.placeToRender, this.time);
    }

    render(place, time) {
        place.innerText = `Pozostały Czas: ${time} Wynik: ${this.score()}`;
        this.time = time;
        if (time > 30) {
            place.style.color = `rgb(195, 207, 83)`;
            setTimeout(() => {
                this.render(place, time - 1)
            }, 1000)
        } else if (time > 10 && time <= 30) {
            place.style.color = `rgb(255, 255, 0)`;
            setTimeout(() => {
                this.render(place, time - 1)
            }, 1000)
        } else if (time > 0 && time <= 10) {
            place.style.color = `rgb(255, 0, 0)`
            setTimeout(() => {
                this.render(place, time - 1)
            }, 1000)
        } else if (time <= 0) {
            this.callback();
        }
    }
}