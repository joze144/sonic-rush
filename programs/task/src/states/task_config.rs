use anchor_lang::prelude::*;

#[account]
pub struct TaskConfig {
    pub creator: Pubkey,
    pub name: String,
    pub locked_amount: u64,
    pub reward_distribution_submitted: bool,
    pub recipients: Vec<Pubkey>,
    pub amounts: Vec<u64>,
    pub claimed: Vec<bool>,
    pub bump: u8,
}

impl TaskConfig {
    pub const SPACE: usize = 8 + // discriminator
        32 + // creator
        4 + 50 + // name (string with length prefix, assuming max 50 chars)
        8 + // locked_amount
        1 + // reward_distribution_submitted
        4 + (32 * 100) + // recipients (assuming max 100 recipients)
        4 + (8 * 100) + // amounts (assuming max 100 recipients)
        4 + (1 * 100) + // claimed (assuming max 100 recipients)
        1; // bump
}

#[account]
pub struct GlobalConfig {
    pub admin: Pubkey,
    pub bump: u8,
}

impl GlobalConfig {
    pub const SPACE: usize = 8 + // discriminator
        32 + // admin
        1; // bump
}