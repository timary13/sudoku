module.exports = function solveSudoku(matrix) {

    let solved = [];
    initial();
    getSolution();

    function initial() {
        //add sets for empty cell
        for (let i = 0; i < 9; i++) {
            solved[i] = [];
            for (let j = 0; j < 9; j++) {
                solved[i][j] = matrix[i][j];
                if (solved[i][j] == 0)
                    solved[i][j] = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
            }
        }
    }

    function rowNums(i) {
        let nums = [];
        for (let j = 0; j < 9; j++) {
            nums.push(solved[i][j]);
        }
        return nums;
    };

    function colNums(j) {
        let nums = [];
        for (let i = 0; i < 9; i++) {
            nums.push(solved[i][j]);
        }
        return nums;
    };

    function sectNums(i, j) {
        let nums = [];
        let sectRow = Math.floor(i / 3) * 3;
        let sectCol = Math.floor(j / 3) * 3;
        for (let k = 0; k < 3; k++) {
            for (let l = 0; l < 3; l++) {
                nums.push(solved[sectRow + k][sectCol + l]);
            }
        }
        return nums;
    };

    function aroundNums(i, j) {
        let tempArr = [];
        tempArr.concat(rowNums(i),colNums(j), sectNums(i, j));
        let aroundSet = new Set(tempArr);
        return aroundSet;
    }

    function isSolved(mattr) {
        let zeroCell = 0;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (mattr[i][j] == 0)
                    zeroCell++;
            }
        }
        return !zeroCell;
    }

    //ar1, ar2 - sets
    function setIntersection(ar1, ar2) {
        for (let item of ar1) {
            if (ar2.has(item))
                ar2.delete(item);
        }
        return ar2;
    };

    function print() {
        console.log(solved);
    }

    function changing() {
        let changed = 0;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (matrix[i][j] != 0) {
                    //not empty cell
                    continue;
                }
                changed += solve(i, j);
            }
        }
        return changed;
    }

    function solve(i, j) {

        //check in row, column and sector
        //solved[i][j] = setIntersection(rowNums(i), solved[i][j]);
        //solved[i][j] = setIntersection(colNums(j), solved[i][j]);
        //solved[i][j] = setIntersection(sectNums(i, j), solved[i][j]);
        solved[i][j] = setIntersection(aroundNums(i, j), solved[i][j]);
        //console.log("size ar2: " +solved[i][j].size);

        if (solved[i][j].size == 1) {
            for (let item of solved[i][j]) {
                solved[i][j] = item;
                matrix[i][j] = item;
            }
            //return +1 changes
            return 1;
        }
        return 0;
    }

    function setRandom() {
        let temp_matrix = [];
        let temp_i = -1;
        let temp_j = -1;
        let countRand = 0;

        for (let i = 0; i < 9; i++) {
            temp_matrix[i] = [];
            for (let j = 0; j < 9; j++) {
                temp_matrix[i][j] = matrix[i][j];
                if (matrix[i][j] == 0 && (solved[i][j].size < countRand || !countRand)) {
                    countRand = solved[i][j].size;
                    temp_i = i;
                    temp_j = j;
                }
            }
        }

        for (let item of solved) {
            temp_matrix[temp_i][temp_j] = item;
            let sudoku = new solveSudoku(temp_matrix);
            if (isSolved(sudoku)) {
                for (let i = 0; i < 9; i++) {
                    for (let j = 0; j < 9; j++) {
                        matrix[i][j] = sudoku[i][j];
                    }
                }
                return;
            }
        }
    }

    function getSolution() {
        //count of changed cells
        //first call = 0
        let changes = 0;
        do {
            changes = changing();
        } while (changes);

        //when no one changes and not solved
        if (!changes && !isSolved(matrix)) {
            setRandom();
        }
    }

    return matrix;
}
