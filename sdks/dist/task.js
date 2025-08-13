"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskSDK = void 0;
const web3_js_1 = require("@solana/web3.js");
class TaskSDK {
    constructor(program, programId) {
        this.program = program;
        this.programId = programId;
    }
    getGlobalConfigPDA() {
        return web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("global_config")], this.programId);
    }
    getTaskConfigPDA(taskName) {
        return web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("task"), Buffer.from(taskName)], this.programId);
    }
    getTaskVaultPDA(taskName) {
        return web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("task_vault"), Buffer.from(taskName)], this.programId);
    }
    async initialize(params) {
        const [globalConfig] = this.getGlobalConfigPDA();
        const tx = await this.program.methods
            .initialize()
            .accounts({
            globalConfig,
            admin: params.admin,
            systemProgram: web3_js_1.SystemProgram.programId,
        })
            .transaction();
        return tx;
    }
    async createTask(params) {
        const [taskConfig] = this.getTaskConfigPDA(params.name);
        const [taskVault] = this.getTaskVaultPDA(params.name);
        const tx = await this.program.methods
            .createTask(params.name, params.lockedAmount)
            .accounts({
            taskConfig,
            creator: params.creator,
            taskVault,
            systemProgram: web3_js_1.SystemProgram.programId,
        })
            .transaction();
        return tx;
    }
    async submitRewardDistribution(params) {
        const [taskConfig] = this.getTaskConfigPDA(params.taskName);
        const tx = await this.program.methods
            .submitRewardDistribution(params.taskName, params.recipients, params.amounts)
            .accounts({
            taskConfig,
            creator: params.creator,
        })
            .transaction();
        return tx;
    }
    async claimReward(params) {
        const [taskConfig] = this.getTaskConfigPDA(params.taskName);
        const [taskVault] = this.getTaskVaultPDA(params.taskName);
        const tx = await this.program.methods
            .claimReward(params.taskName)
            .accounts({
            taskConfig,
            taskVault,
            claimer: params.claimer,
            systemProgram: web3_js_1.SystemProgram.programId,
        })
            .transaction();
        return tx;
    }
    async getGlobalConfig() {
        const [globalConfig] = this.getGlobalConfigPDA();
        try {
            return await this.program.account.globalConfig.fetch(globalConfig);
        }
        catch {
            return null;
        }
    }
    async getTaskConfig(taskName) {
        const [taskConfig] = this.getTaskConfigPDA(taskName);
        try {
            return await this.program.account.taskConfig.fetch(taskConfig);
        }
        catch {
            return null;
        }
    }
    getGlobalConfigAddress() {
        const [globalConfig] = this.getGlobalConfigPDA();
        return globalConfig;
    }
    getTaskConfigAddress(taskName) {
        const [taskConfig] = this.getTaskConfigPDA(taskName);
        return taskConfig;
    }
    getTaskVaultAddress(taskName) {
        const [taskVault] = this.getTaskVaultPDA(taskName);
        return taskVault;
    }
}
exports.TaskSDK = TaskSDK;
//# sourceMappingURL=task.js.map