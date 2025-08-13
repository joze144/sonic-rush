use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};
use crate::states::*;
use crate::events::*;

#[derive(Accounts)]
#[instruction(name: String)]
pub struct CreateTask<'info> {
    #[account(
        init,
        payer = creator,
        space = TaskConfig::SPACE,
        seeds = [b"task", name.as_bytes()],
        bump
    )]
    pub task_config: Account<'info, TaskConfig>,
    
    #[account(mut)]
    pub creator: Signer<'info>,
    
    /// CHECK: This is the program's PDA that will hold the locked SOL
    #[account(
        mut,
        seeds = [b"task_vault", name.as_bytes()],
        bump
    )]
    pub task_vault: AccountInfo<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn handle_create_task(
    ctx: Context<CreateTask>,
    name: String,
    locked_amount: u64,
) -> Result<()> {
    let task_config = &mut ctx.accounts.task_config;
    
    task_config.creator = ctx.accounts.creator.key();
    task_config.name = name.clone();
    task_config.locked_amount = locked_amount;
    task_config.reward_distribution_submitted = false;
    task_config.recipients = Vec::new();
    task_config.amounts = Vec::new();
    task_config.claimed = Vec::new();
    task_config.bump = ctx.bumps.task_config;
    
    // Transfer SOL from creator to task vault
    let transfer_instruction = Transfer {
        from: ctx.accounts.creator.to_account_info(),
        to: ctx.accounts.task_vault.to_account_info(),
    };
    
    let cpi_ctx = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        transfer_instruction,
    );
    
    transfer(cpi_ctx, locked_amount)?;
    
    emit!(TaskCreated {
        creator: ctx.accounts.creator.key(),
        name,
        locked_amount,
    });
    
    Ok(())
}