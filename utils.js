/**
 * Positive modulo.
 */
export const modulo = (n) => (m) => ((n % m) + m) % m;

export const randIntBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

export const randArrIndex = arr => randIntBetween(0, arr.length - 1);
export const randArrValue = arr => arr[randArrIndex(arr)];

/**
 * Takes an array of objects and randomly returns one based on the probability weight
 * of that object. Objects are expected to have a `prob` field of `number` type, which
 * should be a value between 0 and 1 (incl.) representing the likelihood of choosing that
 * option.
 * 
 * Options specify extra behavior:
 * - `normalise` being truthy causes all options to have their probabilities normalised
 * between 0 and 1, respecting their relative weights
 * - `prepare` being truthy indicates to the function that it first needs to parse the
 * incoming array into usable format. Non-objects are cast to objects with `val` and `prob`
 * attributes; Objects with no given `prob` are allocated a `prob` equal to the remaining
 * probability over the number of objects with undefined `prob`s.
 * 
 * @param { Array } arr Array of objects to choose from.
 * @param { Object } options Parsing flags.
 * @param { boolean } options.normalise
 * @param { boolean } options.prepare
 * @returns { Object }
 */
export const pickRandWeighted = (arr, options) => {
	const r = Math.random();

	const { normalise, prepare } = {
		distribute: false,
		prepare: true,
		...options
	};

	const prepped = (() => {
		if (prepare) {
			const parsed = arr.map(el => (typeof el !== `object`) ? { val: el } : el);
			const no_prob_count = parsed.filter(el => el.prob == null).length;
			const undershoot = Math.max(0, 1 - parsed.reduce((acc, el) => acc + (el.prob ?? 0), 0));

			return parsed.map(el => ({
				...el,
				prob: el.prob ?? (undershoot / no_prob_count)
			}));
		}
		return arr;
	})();

	const normalised = (() => {
		if (normalise) {
			const p_total = prepped.reduce((acc, el) => {
				return acc + el.prob;
			}, 0);
			const scale_factor = 1 / p_total;

			return prepped.map(el => ({
				...el,
				prob: el.prob * scale_factor
			}));
		}
		return prepped;
	})();

	let last_threshold = 0;
	for (const el of normalised) {
		const p = el.prob ?? 0;
		if (r > last_threshold && r <= (last_threshold + p)) {
			return el;
		}
		last_threshold += el.prob;
	}
};
