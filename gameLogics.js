import { directions } from "./constants/directions";

const getEmptyCells = (board) => {
    const emptyCells = [];
    board.forEach((row, i) => {
        row.forEach((cell, j) => {
            if (!cell) emptyCells.push({ positionY: i, positionX: j })
        })
    });
    return emptyCells;
}


export const createRandomTile = (board) => {
    const emptyCells = getEmptyCells(board);
    const randomPosition = Math.floor(Math.random() * emptyCells.length);
    const randomValue = Math.random() < 0.5 ? 4 : 2;
    const newTile = emptyCells[randomPosition];
    board[newTile.positionY][newTile.positionX] = { ...newTile, value: randomValue, id: Date.now() };
    return board;
}



export const generateBoardMatrix = () => {
    return [
        [undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined],
    ];
}

const rotateMatrix = (board) => {
    return board[0].map((val, index) => board.map(row => row[index]));
}


const arrangeBoard = (board) => {
    const newBoard = generateBoardMatrix()
    board.forEach((row, rowIndex) => row.forEach((cell, cellIndex) => {
        if (cell) {
            newBoard[cell.positionY][cell.positionX] = cell;
        }
    }))
    return newBoard;
}


export const moveTiles = (board, direction, isOnCheckGameOverMode) => {
    let hasChanged = false;
    let newScore = 0;
    const newBoard = direction === 'left' || direction === 'right' ? [...board] : rotateMatrix(board);
    const axis = direction === 'left' || direction === 'right' ? 'positionX' : 'positionY';

    newBoard.forEach((row, rowIndex) => {

        const filteredAndCombinedArr = combineAndFilterTiles(row, direction);
        const undefinedArr = new Array(4 - filteredAndCombinedArr.length).fill(undefined);

        if (direction === 'left' || direction === 'up') {
            newBoard[rowIndex] = filteredAndCombinedArr.concat(undefinedArr);
        } else {
            newBoard[rowIndex] = undefinedArr.concat(filteredAndCombinedArr);
        };
        newBoard[rowIndex].forEach((cell, cellIndex) => {
            if (cell) {
                hasChanged = cell[axis] !== cellIndex ? true : hasChanged;
                cell[axis] = cellIndex;
            };
        });
    });


    const arrangedBoard = arrangeBoard(newBoard);

    if (isOnCheckGameOverMode) return newScore;

    const boardWithNewTile = hasChanged || newScore > 0 ? createRandomTile(arrangedBoard) : arrangedBoard;
    return { newBoard: boardWithNewTile, newScore };


    function combineAndFilterTiles(row, direction) {
        let filteredRow = row.filter(x => x !== undefined);
        filteredRow = direction === 'reverse' ? filteredRow.reverse() : filteredRow;
        for (let i = 0; i < filteredRow.length; i++) {
            if (filteredRow[i]?.value === filteredRow[i + 1]?.value) {
                newScore += filteredRow[i].value * 2;

                if (isOnCheckGameOverMode) {
                    return direction === 'reverse' ? filteredRow.reverse() : filteredRow;
                }

                filteredRow[i + 1] = { ...filteredRow[i], value: filteredRow[i].value * 2 };
                filteredRow[i] = undefined;
                i++;
            }
        }
        filteredRow = filteredRow.filter(x => x !== undefined);
        return direction === 'reverse' ? filteredRow.reverse() : filteredRow;
    }
}


export const isGameOver = (board) => {
    const emptyCells = getEmptyCells(board);
    if (emptyCells.length > 0) return false;

    for (const direction in directions) {
        const newScore = moveTiles(board, directions[direction], true);
        if (newScore > 0) return false;
    }
    return true;
}



