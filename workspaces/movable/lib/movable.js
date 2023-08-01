"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMovable = exports.createMovable = void 0;
var createMovable = function (props) {
    if (props === void 0) { props = {}; }
    var onStart = props.onStart, onMoving = props.onMoving, onEnd = props.onEnd, _a = props.debug, debug = _a === void 0 ? false : _a, _b = props.grid, _grid = _b === void 0 ? 1 : _b, _c = props.snap, snap = _c === void 0 ? null : _c;
    var grid = Math.max(1, _grid >> 0);
    var state = {
        element: null,
        status: 0,
        start: { x: 0, y: 0 },
        offset: { x: 0, y: 0 },
        position: { x: 0, y: 0 },
        snap: snap,
    };
    var mousedown = function (e) {
        e.stopPropagation();
        state.status = 1;
        state.start = { x: e.clientX, y: e.clientY };
        state.offset = { x: 0, y: 0 };
        typeof onStart === 'function' && onStart();
    };
    var mousemove = function (e) {
        e.stopPropagation();
        if (state.status !== 1) {
            return;
        }
        var x = e.clientX - state.start.x;
        var y = e.clientY - state.start.y;
        var offset = { x: x, y: y };
        var position = { x: state.position.x + x, y: state.position.y + y };
        state.offset = offset;
        typeof onMoving === 'function' && onMoving({ position: position, offset: offset });
    };
    var mouseup = function (e) {
        e.stopPropagation();
        if (state.status !== 1) {
            return;
        }
        state.status = 0;
        var _a = state.offset, x = _a.x, y = _a.y;
        var position = { x: state.position.x + x, y: state.position.y + y };
        position.x = Math.round(position.x / grid) * grid;
        position.y = Math.round(position.y / grid) * grid;
        // state.position = { ...position }
        typeof onEnd === 'function' && onEnd({ position: position, offset: { x: x, y: y } });
    };
    var R = {
        snap: function (s) {
            state.snap = s;
        },
        getSnap: function () {
            return state.snap;
        },
        update: function (position) {
            state.position = __assign({}, position);
        },
        init: function (target) {
            state.element = target;
            target.addEventListener('mousedown', mousedown);
            document.addEventListener('mousemove', mousemove);
            document.addEventListener('mouseup', mouseup);
            debug && console.log('[movable] inited');
        },
        dispose: function () {
            if (state.element) {
                state.element.removeEventListener('mousedown', mousedown);
            }
            document.removeEventListener('mousemove', mousemove);
            document.removeEventListener('mouseup', mouseup);
            debug && console.log('[movable] displosed');
        }
    };
    return R;
};
exports.createMovable = createMovable;
var useMovable = function (props) {
    var update = props.update, _a = props.debug, debug = _a === void 0 ? false : _a, onChange = props.onChange, _b = props.reducer, reducer = _b === void 0 ? [] : _b, _c = props.grid, grid = _c === void 0 ? 1 : _c;
    var _reducer = function (pos) {
        return reducer.reduce(function (pos, reduce) { return reduce(pos); }, pos);
    };
    var _onChange = function (args) {
        var _pos = _reducer(__assign({}, args.position));
        typeof update === 'function' && update(_pos);
        typeof onChange === 'function' && onChange(args);
    };
    var m = (0, exports.createMovable)({
        debug: debug,
        grid: grid,
        onMoving: function (args) {
            _onChange(args);
        },
        onEnd: function (args) {
            m.update(_reducer(args.position));
            _onChange(args);
        }
    });
    return m;
};
exports.useMovable = useMovable;
