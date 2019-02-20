export default class Wall {
    constructor(x, y, width, height) {
        const wall = Matter.Bodies.rectangle(
            x,
            y,
            width,
            height, {
                render: {
                    fillStyle: 'green',
                    strokeStyle: 'green',
                    lineWidth: 15,
                    visible: true
                },
                isStatic: true,
                density: 10000
            }
        )
        return wall
    }
}