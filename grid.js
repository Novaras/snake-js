import { pickRandWeighted } from './utils.js';

/**
 * @typedef { Object } Vec2
 * @property { number } x
 * @property { number } y
 */

/**
 * @param { Vec2 } vec_a
 * @param { Vec2 } vec_b
 * @returns boolean
 */
export const vecEquals = (vec_a, vec_b) => {
	return Object.entries(vec_a).every(([key, value]) => vec_b[key] === value);
};

export const vecOp = (vec_a) => (vec_b) => (op) => {
	op = op ?? (() => { });
	for (const k in vec_a) {
		vec_a[k] = op(vec_a[k], vec_b[k]);
	}
};

export const vecAdd = (vec_a, vec_b) => {
	vecOp(vec_a)(vec_b)((a, b) => a + b);
};

const CELL_TYPES = Object.freeze({
	empty: {
		char: ' ',
		prob: 0.90
	},
	block: {
		char: 'X',
		prob: 0.02
	},
	food: {
		char: 'O',
		prob: 0.08
	},
});

export const makeGrid = (dims) => {
	const { x, y } = (() => {
		if (typeof dims === `number`) return { x: dims, y: dims };
		else return {
			x: 10,
			y: 10,
			...dims
		};
	})();

	const cells = Array.from(
		{
			length: x * y
		},
		() => pickRandWeighted(Object.values(CELL_TYPES), { distribute: true, prepare: true })
	);

	const indexToVec = (index) => ({
		x: index % x,
		y: Math.floor(index / x)
	});

	const vecToIndex = (vec) => (vec.x + (vec.y * x));

	return {
		cells,
		dims: { x, y },
		indexToVec,
		vecToIndex
	};
};

export const printGrid = (grid, snake) => {
	console.log(`Grid (${grid.dims.x} x ${grid.dims.y})  |  Length: ${snake.length}`);
	const hor_line = `  ${`- `.repeat(grid.dims.x)}`;
	console.log(grid.cells.map(cell => cell.char).reduce((acc, char, index) => {
		const bl = (index + 1) % grid.dims.x === 0 ? '|\n' : '';
		const border = (index) % grid.dims.x === 0 ? '|' : '';
		const top_h_line = (index === 0) ? `${hor_line}\n` : '';
		const bot_h_line = index === grid.cells.length - 1 ? `${hor_line}` : '';
		// console.log(`idx: ${index} (cell is ${cell}), bor: ${border}`);
		return `${top_h_line}${acc} ${border}${char}${bl}${bot_h_line}`;
	}, ``));
};
