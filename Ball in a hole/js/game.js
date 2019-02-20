import Ball from './ball.js'
import Target from './target.js'
import Wall from './wall.js'
import Counter from './counter.js'
import RestartButton from './button.js';

export default class Game {
    constructor({
        placeToRender = document.body,
        width = window.innerWidth,
        height = window.innerHeight,
        score = 0,
        _ = () => {}
    } = {}) {

        this.renderOptions = {
            placeToRender,
            width,
            height,
        }

        this.score = score;

        this.startPosition = {
                x: null,
                y: null
            },

            this.runGame();
    }

    get engine() {
        !this.newengine && (this.newengine = Matter.Engine.create())
        return this.newengine;
    }

    get render() {
        return Matter.Render.create({
            element: this.renderOptions.placeToRender,
            engine: this.engine,
            options: {
                wireframes: false,
                ...this.renderOptions
            }
        })
    }

    get world() {
        return this.engine.world
    }

    get actualScore() {
        return this.score
    }

    createTarget() {
        Matter.World.add(this.world, new Target((Math.random() * this.renderOptions.width), (Math.random() * this.renderOptions.height)))
    }

    initWorld() {
        Matter.World.add(this.world, new Ball(100, 150, 8, 'red', 'red'));
        Matter.World.add(this.world, new Target(100, 250))
        Matter.World.add(this.world, new Wall(0, this.renderOptions.height, this.renderOptions.width * 2, 20))
        Matter.World.add(this.world, new Wall(0, 0, this.renderOptions.width * 2, 20))
        Matter.World.add(this.world, new Wall(0, 0, 10, this.renderOptions.height * 2))
        Matter.World.add(this.world, new Wall(this.renderOptions.width, 10, 10, this.renderOptions.height * 2))
    }

    onDeviceMove(event) {
        const factor = 20 / 200
        const gravity = this.world.gravity;

        this.startPosition.x == null && (this.startPosition.x = event.gamma)
        this.startPosition.y == null && (this.startPosition.y = event.beta)

        gravity.x = Matter.Common.clamp(event.gamma - this.startPosition.x, -90, 90) * factor
        gravity.y = Matter.Common.clamp(event.beta - this.startPosition.y, -90, 90) * factor
    }

    targetHit(event) {
        Matter.Events.on(this.engine, event, (event) => {
            let pairs = event.pairs;
            for (let i = 0, j = pairs.length; i != j; ++i) {
                let pair = pairs[i];
                if (pair.bodyA.label === 'player' && pair.bodyB.label === 'target') {
                    Matter.Composite.remove(this.world, pair.bodyB)
                    this.createTarget();
                    this.score += 1
                }
            }
        })
    }

    handleEvents() {
        window.addEventListener('deviceorientation', this.onDeviceMove.bind(this))
        this.targetHit('collisionStart')
    }

    endGame() {
        this.showScore();
        this.score = 0;
    }

    restartGame() {
        document.querySelector('.modal').classList.remove('modal-active');
        document.querySelector('canvas').remove();
        Matter.Composite.clear(this.world);
        Matter.Engine.clear(this.engine);
        this.initWorld();
        Matter.Engine.run(this.engine);
        Matter.Render.run(this.render);
        new Counter({
            endGame: () => this.endGame(),
            score: () => this.actualScore
        });
    }

    showScore() {
        document.querySelector('.counter').innerText = "";
        document.querySelector('.modal').classList.add('modal-active');
        document.querySelector('.modal-content').innerText = `Your score: ${this.score}`;
        document.querySelector('.modal-content').appendChild(new RestartButton({
            restart: () => this.restartGame()
        }));
    }

    runGame() {
        this.initWorld();
        Matter.Engine.run(this.engine);
        Matter.Render.run(this.render);
        this.handleEvents();
        new Counter({
            endGame: () => this.endGame(),
            score: () => this.actualScore
        });
    }
}