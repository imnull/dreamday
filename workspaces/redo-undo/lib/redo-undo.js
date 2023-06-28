"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyPatch = exports.undoPatch = exports.redoPatch = void 0;
var diff_1 = require("diff");
var change2patch = function (change) {
    var patch = [change.count || 0, change.added ? 1 : change.removed ? -1 : 0];
    if (change.added || change.removed) {
        patch.push(change.value);
    }
    return patch;
};
var redoPatch = function (val, patches) {
    var segs = [];
    var idx = 0;
    patches.forEach(function (patch) {
        var count = patch[0], type = patch[1], _a = patch[2], value = _a === void 0 ? '' : _a;
        if (type === 0) {
            segs.push(val.substring(idx, idx + count));
            idx += count;
        }
        else if (type === 1) {
            segs.push(value);
        }
        else {
            idx += count;
        }
    });
    return segs.join('');
};
exports.redoPatch = redoPatch;
var undoPatch = function (val, patches) {
    var segs = [];
    var idx = 0;
    patches.forEach(function (patch) {
        var count = patch[0], type = patch[1], _a = patch[2], value = _a === void 0 ? '' : _a;
        if (type === 0) {
            segs.push(val.substring(idx, idx + count));
            idx += count;
        }
        else if (type === -1) {
            segs.push(value);
        }
        else {
            idx += count;
        }
    });
    return segs.join('');
};
exports.undoPatch = undoPatch;
var applyPatch = function (isUndo, val, patches) {
    var segs = [];
    var idx = 0;
    patches.forEach(function (patch) {
        var count = patch[0], type = patch[1], _a = patch[2], value = _a === void 0 ? '' : _a;
        if (type === 0) {
            segs.push(val.substring(idx, idx + count));
            idx += count;
        }
        else if ((type === 1 && !isUndo) || (type === -1 && isUndo)) {
            segs.push(value);
        }
        else {
            idx += count;
        }
    });
    return segs.join('');
};
exports.applyPatch = applyPatch;
var RedoUndo = /** @class */ (function () {
    function RedoUndo(origin, maxSize) {
        if (origin === void 0) { origin = ''; }
        if (maxSize === void 0) { maxSize = 100; }
        this.origin = origin;
        this.history = [];
        this.maxSize = Math.max(10, maxSize);
        this.current = origin;
        this.cursor = this.history.length;
    }
    RedoUndo.prototype.getValue = function () {
        if (this.cursor <= 0) {
            return this.origin;
        }
        else if (this.cursor >= this.history.length) {
            return this.current;
        }
        var slice = this.history.slice(this.cursor).reverse();
        var val = this.current;
        slice.forEach(function (patches) {
            val = (0, exports.applyPatch)(true, val, patches);
        });
        return val;
    };
    RedoUndo.prototype.getCursor = function () {
        return this.cursor;
    };
    RedoUndo.prototype.getHistory = function () {
        return this.history.map(function (it) { return __spreadArray([], it, true); });
    };
    RedoUndo.prototype.getHistoryCount = function () {
        return this.history.length;
    };
    RedoUndo.prototype.needUpdate = function (newStr) {
        return newStr !== this.getValue();
    };
    RedoUndo.prototype.update = function (newStr) {
        if (this.current === newStr) {
            return;
        }
        var diff = (0, diff_1.diffChars)(this.getValue(), newStr);
        var patches = diff.map(change2patch);
        var abandon = this.history.splice(this.cursor, this.history.length, patches);
        while (this.history.length > this.maxSize) {
            this.history.shift();
        }
        this.current = newStr;
        this.cursor = this.history.length;
    };
    RedoUndo.prototype.undo = function (step) {
        if (step === void 0) { step = 1; }
        this.cursor = Math.max(0, this.cursor - step);
    };
    RedoUndo.prototype.redo = function (step) {
        if (step === void 0) { step = 1; }
        this.cursor = Math.min(this.history.length, this.cursor + step);
    };
    RedoUndo.prototype.canUndo = function () {
        return this.getHistoryCount() > 0 && this.cursor > 0;
    };
    RedoUndo.prototype.canRedo = function () {
        return this.getHistoryCount() > 0 && this.cursor < this.history.length;
    };
    RedoUndo.prototype.snap = function () {
        return {
            origin: this.origin,
            current: this.current,
            maxSize: this.maxSize,
            history: this.getHistory(),
        };
    };
    RedoUndo.from = function (snap) {
        var _a;
        var origin = snap.origin, current = snap.current, history = snap.history, maxSize = snap.maxSize;
        var ur = new RedoUndo(origin, maxSize);
        ur.current = current;
        (_a = ur.history).push.apply(_a, history);
        ur.cursor = ur.history.length;
        return ur;
    };
    return RedoUndo;
}());
exports.default = RedoUndo;
