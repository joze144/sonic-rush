use anchor_lang::prelude::*;
use crate::states::*;
use crate::events::*;
use crate::error::TaskError;

#[derive(Accounts)]
#[instruction(task_name: String)]
pub struct SubmitRewardDistribution<'info> {
    #[account(
        mut,
        seeds = [b"task", task_name.as_bytes()],
        bump = task_config.bump,
        constraint = task_config.creator == creator.key() @ TaskError::Unauthorized
    )]
    pub task_config: Account<'info, TaskConfig>,
    
    pub creator: Signer<'info>,
}

pub fn handle_submit_reward_distribution(
    ctx: Context<SubmitRewardDistribution>,
    task_name: String,
    recipients: Vec<Pubkey>,
    amounts: Vec<u64>,
) -> Result<()> {
    let task_config = &mut ctx.accounts.task_config;
    
    // Validate that the sum of amounts equals the locked amount
    let total_distribution: u64 = amounts.iter().sum();
    require!(
        total_distribution == task_config.locked_amount,
        TaskError::InvalidRewardDistribution
    );
    
    // Validate that recipients and amounts have the same length
    require!(
        recipients.len() == amounts.len(),
        TaskError::InvalidRewardDistribution
    );
    
    // Update task config with reward distribution
    task_config.recipients = recipients.clone();
    task_config.amounts = amounts.clone();
    task_config.claimed = vec![false; recipients.len()];
    task_config.reward_distribution_submitted = true;
    
    emit!(RewardDistributionSubmitted {
        task_name,
        recipients,
        amounts,
    });
    
    Ok(())
}