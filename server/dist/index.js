"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = 3000;
// Middleware per gestire il parsing JSON
app.use(express_1.default.json());
// Rotta base
app.get('/', (req, res) => {
    res.send('Welcome to my TypeScript server!');
});
// Start del server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
