exports.createSquareMatrixFromArray = function (list, fnEachItem) {
    const matrix_size = Math.ceil(Math.sqrt(list.length));
    var matrix = Array(matrix_size).fill().map(() => Array(matrix_size).fill());
    var cont = 0;
    for (let y = 0; y < matrix_size; y++) {
        for (let x = 0; x < matrix_size; x++) {
            var item = list[cont];
            if (item) {
                if (fnEachItem) {
                    matrix[y][x] = fnEachItem(item, x, y);
                } else {
                    matrix[y][x] = item;
                }
            }
            cont++;
        }
    }
    return matrix;
}

exports.isPositionEqual = function (pos1, pos2){
    return pos1.x === pos2.x && pos1.y === pos2.y && pos1.z === pos2.z
}

exports.transformGamePositionToCoord = function (x, y) {
    return { x: ((x + 1) * 32) - 16, y: ((y + 1) * 32) - 16 }
}

exports.getPosByDirection = function (originalPos, direction, secondDirection) {
    let new_position = originalPos;
    var directions = [direction];
    if (direction !== secondDirection)
        directions.push(secondDirection);
    directions.forEach(loop_direction => {
        switch (loop_direction) {
            case 'down':
                new_position = { x: new_position.x, y: new_position.y + 1 }
                break;
            case 'up':
                new_position = { x: new_position.x, y: new_position.y - 1 }
                break;
            case 'right':
                new_position = { x: new_position.x + 1, y: new_position.y }
                break;
            case 'left':
                new_position = { x: new_position.x - 1, y: new_position.y }
                break;
            default:
                break;
        }
    });
    return new_position;
}

exports.pathToMovivementsArray = function(path){
    var paths_ = path;
    var lastPosition = paths_.shift();

    var directions = [];
    paths_.forEach(position => {
        var x = position[0] - lastPosition[0];
        var y = position[1] - lastPosition[1];
        
        var direction = [];

        if (x === 1){
            direction.push("right")
        }else if (x === -1){
            direction.push("left")
        }

        if (y === 1){
            direction.push("down")
        }else if (y === -1){
            direction.push("up")
        }
        directions.push(direction);
        lastPosition = position;
    });
    return directions;
}
