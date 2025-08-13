use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface, MintTo, mint_to};

use crate::states::{GroupConfigAccount, GROUP_CONFIG_ACCOUNT_PREFIX};
use crate::error::SonicRushError;

#[derive(Accounts)]
#[instruction(group_name: String)]
pub struct ClaimTokenAccounts<'info> {
    #[account(mut)]
    pub claimer: Signer<'info>,

    #[account(
        mut,
        seeds = [
            GROUP_CONFIG_ACCOUNT_PREFIX.as_bytes(),
            group_name.as_bytes()
        ],
        bump,
    )]
    pub config: Box<Account<'info, GroupConfigAccount>>,

    #[account(
        mut,
        address = config.group_token_mint
    )]
    pub group_token_mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(
        init,
        payer = claimer,
        associated_token::mint = group_token_mint,
        associated_token::authority = claimer,
        associated_token::token_program = token_program,
    )]
    pub claimer_token_account: Box<InterfaceAccount<'info, TokenAccount>>,

    pub token_program: Interface<'info, TokenInterface>,

    pub associated_token_program: Program<'info, AssociatedToken>,

    pub system_program: Program<'info, System>,
}

pub fn handle_claim_token(
    ctx: Context<ClaimTokenAccounts>,
    group_name: String,
) -> Result<()> {
    let claimer_key = ctx.accounts.claimer.key();

    // Check if claimer is a member of the group
    if !ctx.accounts.config.members.contains(&claimer_key) {
        return Err(SonicRushError::NotAGroupMember.into());
    }

    // Check if claimer has already claimed
    if ctx.accounts.config.claimed_members.contains(&claimer_key) {
        return Err(SonicRushError::AlreadyClaimed.into());
    }

    // Create PDA seeds for signing
    let group_name_bytes = group_name.as_bytes();
    let seeds = &[
        GROUP_CONFIG_ACCOUNT_PREFIX.as_bytes(),
        group_name_bytes,
        &[ctx.bumps.config],
    ];
    let signer = &[&seeds[..]];

    // Mint 1 token to the claimer
    let mint_to_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        MintTo {
            mint: ctx.accounts.group_token_mint.to_account_info(),
            to: ctx.accounts.claimer_token_account.to_account_info(),
            authority: ctx.accounts.config.to_account_info(),
        },
        signer,
    );

    mint_to(mint_to_ctx, 1)?;

    // Add claimer to claimed_members list
    let config = &mut ctx.accounts.config;
    config.claimed_members.push(claimer_key);
    config.last_block_timestamp = Clock::get().unwrap().unix_timestamp;

    Ok(())
}