const Module = require("module").Module;
const _load = Module._load;
let _hookedAt: Date | undefined;
let _listener: Function | undefined;

/**
 * Module hooker function that will replace Module._load and invoke the _listener with module and timing information
 *
 * @function _hooker
 */
function _hooker(name: string, parent: any) {
	const timeIn = Date.now(),
			exports = _load.apply(Module, arguments),
			timeOut = Date.now(),
			mod = parent.children[parent.children.length - 1]; // should be the last loaded children
	// call the listener
	_listener!({
		name: name,
		parent: parent,
		module: mod,
		filename: mod ? mod.filename : name,
		exports: exports,
		requiredOn: timeIn,
		startedIn: timeOut - timeIn
	});
	return exports;
}

/**
 * Hook Node's require() so the configured callback will be invocked with additional module and time loading information information
 *
 * @param {Function} listener
 * @private
 */
function _hook(listener?: Function) {
	if (typeof listener !== "undefined") {
		// set the listener
		_listener = listener;
	}
	// set the hoocker loader
	Module._load = _hooker;
	// mark hooked time
	_hookedAt = new Date();
}

/**
 * Unhook Node's require() to the original function
 *
 * @method unhook
 */
function _unhook() {
	// set the original loader
	Module._load = _load;
	// reset hooking time
	_hookedAt = undefined;
}

/**
 * Export a function that set the callback and return hook/unhook control functionality
 *
 * @param {Function} listener - require() listener
 * @param {boolean} [autohook=true] - optional flag telling if the hooking will be started automatically
 * @returns {{hookedAt: Date | undefined; hook: (listener?: Function) => void; unhook: () => void}}
 */
export default function hook(listener: Function, autohook: boolean = true) {
	if (typeof listener !== "function") {
		throw new Error("The hooking function should be set");
	}
	// set the listener
	_listener = listener;
	// if autohook (by default),
	if (autohook) {
		_hook(listener);
	}
	return {
		hookedAt: _hookedAt!,
		hook: _hook,
		unhook: _unhook
	};
};
