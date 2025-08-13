"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SquadSDK = void 0;
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
class SquadSDK {
    constructor(program, programId) {
        this.program = program;
        this.programId = programId;
    }
    getConfigPDA(name) {
        return web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("CONFIG"), Buffer.from(name)], this.programId);
    }
    getGroupTokenMintPDA(name) {
        return web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("group_token"), Buffer.from(name)], this.programId);
    }
    async initialize(params) {
        const [config] = this.getConfigPDA(params.name);
        const [groupTokenMint] = this.getGroupTokenMintPDA(params.name);
        const tx = await this.program.methods
            .initialize(params.name, params.members)
            .accounts({
            feeAndRentPayer: params.feeAndRentPayer,
            mainSigningAuthority: params.mainSigningAuthority,
            config,
            groupTokenMint,
            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
            associatedTokenProgram: spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: web3_js_1.SystemProgram.programId,
            rent: web3_js_1.SYSVAR_RENT_PUBKEY,
        })
            .transaction();
        return tx;
    }
    async claimToken(params) {
        const [config] = this.getConfigPDA(params.groupName);
        const [groupTokenMint] = this.getGroupTokenMintPDA(params.groupName);
        const claimerTokenAccount = await (0, spl_token_1.getAssociatedTokenAddress)(groupTokenMint, params.claimer);
        const tx = await this.program.methods
            .claimToken(params.groupName)
            .accounts({
            claimer: params.claimer,
            config,
            groupTokenMint,
            claimerTokenAccount,
            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
            associatedTokenProgram: spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: web3_js_1.SystemProgram.programId,
        })
            .transaction();
        return tx;
    }
    async getGroupConfig(groupName) {
        const [config] = this.getConfigPDA(groupName);
        try {
            return await this.program.account.groupConfigAccount.fetch(config);
        }
        catch {
            return null;
        }
    }
    getConfigAddress(groupName) {
        const [config] = this.getConfigPDA(groupName);
        return config;
    }
    getGroupTokenMintAddress(groupName) {
        const [groupTokenMint] = this.getGroupTokenMintPDA(groupName);
        return groupTokenMint;
    }
}
exports.SquadSDK = SquadSDK;
//# sourceMappingURL=squad.js.map