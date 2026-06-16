"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_server_1 = require("@hono/node-server");
const index_1 = __importDefault(require("./api/index"));
const port = parseInt(process.env.PORT || "3000");
console.log(`✅ Starting Pontize API...`);
console.log(`📍 Health: http://localhost:${port}/health`);
console.log(`📍 API: http://localhost:${port}/v1`);
(0, node_server_1.serve)({ fetch: index_1.default.fetch, port }, (info) => {
    console.log(`✅ Pontize API running on http://localhost:${info.port}`);
});
