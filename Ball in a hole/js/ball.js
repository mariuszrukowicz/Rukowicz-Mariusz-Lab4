export default class Ball {
    constructor(x, y, radius, fillstyle, strokestyle) {
        const ball = Matter.Bodies.circle(
            x,
            y,
            radius, {
                render: {
                    fillStyle: fillstyle,
                    strokeStyle: strokestyle,
                    lineWidth: 2
                },
                restitution: 1,
                friction: 1,
                label: 'player'
            },
        )
        return ball;
    }
}