use anchor_lang::prelude::*;
use crate::states::*;
use crate::events::*;
use crate::error::TaskError;

#[derive(Accounts)]
#[instruction(task_name: String)]
pub struct ClaimReward<'info> {
    #[account(
        mut,
        seeds = [b"task", task_name.as_bytes()],
        bump = task_config.bump,
        constraint = task_config.reward_distribution_submitted @ TaskError::RewardDistributionNotSubmitted
    )]
    pub task_config: Account<'info, TaskConfig>,
    
    /// CHECK: This is the program's PDA that holds the locked SOL
    #[account(
        mut,
        seeds = [b"task_vault", task_name.as_bytes()],
        bump
    )]
    pub task_vault: AccountInfo<'info>,
    
    #[account(mut)]
    pub claimer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn handle_claim_reward(
    ctx: Context<ClaimReward>,
    task_name: String,
) -> Result<()> {
    let task_config = &mut ctx.accounts.task_config;
    let claimer_key = ctx.accounts.claimer.key();
    
    // Find the claimer in the recipients list
    let recipient_index = task_config
        .recipients
        .iter()
        .position(|&recipient| recipient == claimer_key)
        .ok_or(TaskError::NotEligible)?;
    
    // Check if already claimed
    require!(
        !task_config.claimed[recipient_index],
        TaskError::RewardAlreadyClaimed
    );
    
    let reward_amount = task_config.amounts[recipient_index];
    
    // Mark as claimed
    task_config.claimed[recipient_index] = true;
    
    // Transfer SOL from task vault to claimer using system program
    let task_name_bytes = task_name.as_bytes();
    let bump = ctx.bumps.task_vault;
    let seeds = &[
        b"task_vault",
        task_name_bytes,
        &[bump],
    ];
    let signer_seeds = &[&seeds[..]];
    
    anchor_lang::system_program::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.task_vault.to_account_info(),
                to: ctx.accounts.claimer.to_account_info(),
            },
            signer_seeds
        ),
        reward_amount,
    )?;
    
    emit!(RewardClaimed {
        task_name,
        claimer: claimer_key,
        amount: reward_amount,
    });
    
    Ok(())
}