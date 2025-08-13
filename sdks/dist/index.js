"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.SonicRushProjectSDK = void 0;
const web3_js_1 = require("@solana/web3.js");
const anchor_1 = require("@coral-xyz/anchor");
const sonic_rush_1 = require("./sonic-rush");
const task_1 = require("./task");
const sonic_rush_json_1 = __importDefault(require("../../target/idl/sonic_rush.json"));
const task_json_1 = __importDefault(require("../../target/idl/task.json"));
class SonicRushProjectSDK {
    constructor(connection, sonicRushSDK, taskSDK) {
        this.connection = connection;
        this.sonicRush = sonicRushSDK;
        this.task = taskSDK;
    }
    static async init(config) {
        const { connection, provider } = config;
        const sonicRushProgramId = config.sonicRushProgramId ||
            new web3_js_1.PublicKey(sonic_rush_json_1.default.address);
        const taskProgramId = config.taskProgramId ||
            new web3_js_1.PublicKey(task_json_1.default.address);
        let anchorProvider;
        if (provider) {
            anchorProvider = provider;
        }
        else {
            // Create a dummy provider for read-only operations
            anchorProvider = {
                connection,
                publicKey: web3_js_1.PublicKey.default,
            };
        }
        const sonicRushProgram = new anchor_1.Program(sonic_rush_json_1.default, anchorProvider);
        const taskProgram = new anchor_1.Program(task_json_1.default, anchorProvider);
        const sonicRushSDK = new sonic_rush_1.SonicRushSDK(sonicRushProgram, sonicRushProgramId);
        const taskSDK = new task_1.TaskSDK(taskProgram, taskProgramId);
        return new SonicRushProjectSDK(connection, sonicRushSDK, taskSDK);
    }
    static getDefaultProgramIds() {
        return {
            sonicRush: new web3_js_1.PublicKey(sonic_rush_json_1.default.address),
            task: new web3_js_1.PublicKey(task_json_1.default.address),
        };
    }
}
exports.SonicRushProjectSDK = SonicRushProjectSDK;
exports.default = SonicRushProjectSDK;
__exportStar(require("./sonic-rush"), exports);
__exportStar(require("./task"), exports);
//# sourceMappingURL=index.js.map