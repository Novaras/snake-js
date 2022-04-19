import keypress from 'keypress';
keypress(process.stdin);

import { modulo, randArrIndex } from './utils.js';
import { printGrid, makeGrid, vecEquals, vecAdd } from './grid.js';
import { DIRECTIONS, makeSnake } from './snake.js';

const grid = makeGrid(20);

const free_index = grid.cells.findIndex(cell => cell.char === ' ');

const snake = makeSnake({
	position: grid.indexToVec(free_index)
});

const wrapSnakePos = (axis) => {
	if (snake.position[axis] < 0 || snake.position[axis] >= grid.dims[axis]) snake.position[axis] = modulo(snake.position[axis])(grid.dims[axis])
};

console.log(free_index);
console.log(snake);

/**
 * @typedef { Object } KeyPressData
 * @property { string } name
 * @property { boolean } ctrl
 * @property { boolean } meta
 * @property { boolean } shift
 * @property { string } sequence
 * @property { string } code
 */

/** @type KeyPressData */
let PRESSED_KEY = null;
process.stdin.on('keypress', (_, key) => PRESSED_KEY = key);
process.stdin.setRawMode(true); // interpret keypress literally (no terminal specific behavior like ctrl+c)

const exitProcess = (message) => {
	process.stdin.setRawMode(false);
	clearInterval(MAIN_LOOP);
	if (message) console.log(message);
	process.exit();
};

const gameOver = (message = '==[ YOU DIED! ]==\n') => {
	exitProcess(message);
};

const position_memory = [];

const UPDATE_INTERVAL_MS = 75;
let tick = 0;
const tickRate = () => Math.max(2, 6 - Math.floor(snake.length / 6));
const MAIN_LOOP = setInterval(() => {
	if (PRESSED_KEY) {

		switch (PRESSED_KEY.name.toLowerCase()) {
			case `q`:
				exitProcess();
				break;
			case `right`:
			case `left`:
				snake.turn(PRESSED_KEY.name.toUpperCase());
				break;
		}

		PRESSED_KEY = null;
	}

	// anything not a map entity needs to be cleared each draw
	for (const cell of grid.cells) {
		if (!['O', 'X'].includes(cell.char)) cell.char = ' ';
	}

	const snake_cell = grid.cells[grid.vecToIndex(snake.position)];

	// moving into cells has the behaviors defined by the cell char:
	switch (snake_cell.char.toLowerCase()) {
		case 'x':
			gameOver();
			break;
		case 'o':
			snake.length += 1;
			break;
	}

	if (position_memory.find(index => index === grid.vecToIndex(snake.position))) gameOver();

	// assinn cur cell pos char
	snake_cell.char = (() => {
		const dirEq = (dir) => vecEquals(snake.direction, dir);

		if (dirEq(DIRECTIONS.UP)) return '^';
		else if (dirEq(DIRECTIONS.RIGHT)) return '>';
		else if (dirEq(DIRECTIONS.DOWN)) return 'v';
		else if (dirEq(DIRECTIONS.LEFT)) return '<';

		return '?';
	})();

	// draw the snake from pos memory
	for (const pos_index of position_memory) {
		grid.cells[pos_index].char = 'S';
	}

	if (tick % tickRate() === 0) {
		// update pos memory
		if (position_memory.length > snake.length - 2) {
			position_memory.shift();
		}
		if (position_memory.length + 1 < snake.length) {
			position_memory.push(grid.vecToIndex(snake.position));
		}

		// move the snake
		vecAdd(snake.position, snake.direction);
		['x', 'y'].forEach(axis => wrapSnakePos(axis));
	}

	// populate new food over time
	if (tick > 80 && Math.random() <= 0.05) {
		let index = randArrIndex(grid.cells);
		while (grid.cells[index].char !== ' ') index = randArrIndex(grid.cells);

		grid.cells[index].char = 'O';
	}

	console.clear();
	printGrid(grid, snake);

	tick += 1;
}, UPDATE_INTERVAL_MS);
