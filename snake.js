import { modulo } from "./utils.js";
import { vecEquals } from "./grid.js";

/**
 * @typedef { Object } Directions
 * @property { Vec2 } UP
 * @property { Vec2 } RIGHT
 * @property { Vec2 } DOWN
 * @property { Vec2 } LEFT
 */

/**
 * @type { Directions }
 */
export const DIRECTIONS = Object.freeze({
	UP: { x: 0, y: -1 },
	RIGHT: { x: 1, y: 0 },
	DOWN: { x: 0, y: 1 },
	LEFT: { x: -1, y: 0 }
});

export const ROTATIONS = Object.freeze([
	`RIGHT`,
	`LEFT`
]);

/**
 * @typedef { Object } Snake
 * @property { number } speed
 * @property { number } length
 * @property { Vec2 } pos
 * @property { Vec2 } dir
 */

/**
 * Creates a new `Snake` object with the given properties or defaults.
 *
 * @param { Object } properties
 * @param { Vec2 } properties.position
 * @param { Vec2 } properties.direction
 * @param { number } properties.length
 * @param { number } properties.speed
 * @returns Snake
 */
export const makeSnake = ({ position, direction, length, speed }) => {
	// defaults
	position = {
		x: 0,
		y: 0,
		...(typeof position === 'number') ? { x: position, y: position } : position,
	};
	direction = {
		...DIRECTIONS.RIGHT,
		...(typeof direction === 'number') ? { x: direction, y: direction } : direction
	};
	length = length ?? 1;
	speed = speed ?? 1;

	const DIR_INDEXES = Object.freeze(Object.entries(DIRECTIONS).reduce((acc, entry, index) => ({
		...acc,
		[index]: entry
	}), {}));

	const new_snake = {
		speed,
		length,
		position,
		direction,
		/**
		 * Rotates the snake.
		 * 
		 * @param { 'LEFT'|'RIGHT' } rotation 
		 */
		turn(rotation) {
			const rotation_incr = (() => {
				switch (rotation) {
					case `LEFT`:
						return -1;
					case `RIGHT`:
						return 1;
					default:
						return 0;
				}
			})();
			const cur_dir_index = Object.entries(DIRECTIONS).findIndex(([label, vec]) => vecEquals(vec, this.direction));
			const target_index = modulo(cur_dir_index + rotation_incr)(Object.values(DIRECTIONS).length);
			this.direction = Object.values(DIRECTIONS)[target_index];
		},
	};

	return new_snake;
};
