use anchor_lang::prelude::*;

mod instructions;
mod states;
mod events;
mod error;

use instructions::*;

declare_id!("5168hBAt3ZMd4QMnaRCHYAZCzN1Sv4qfzAWdKkbDzcSZ");

#[program]
pub mod task {
    use super::*;

    pub fn initialize(ctx: Context<InitializeTask>) -> Result<()> {
        handle_initialize(ctx)
    }

    pub fn create_task(
        ctx: Context<CreateTask>,
        name: String,
        locked_amount: u64,
    ) -> Result<()> {
        handle_create_task(ctx, name, locked_amount)
    }

    pub fn submit_reward_distribution(
        ctx: Context<SubmitRewardDistribution>,
        task_name: String,
        recipients: Vec<Pubkey>,
        amounts: Vec<u64>,
    ) -> Result<()> {
        handle_submit_reward_distribution(ctx, task_name, recipients, amounts)
    }

    pub fn claim_reward(
        ctx: Context<ClaimReward>,
        task_name: String,
    ) -> Result<()> {
        handle_claim_reward(ctx, task_name)
    }
}