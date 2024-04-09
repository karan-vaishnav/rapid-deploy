"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
function generate() {
    const id = Math.random().toString(36).substring(2, 7);
    return id;
}
exports.generate = generate;
