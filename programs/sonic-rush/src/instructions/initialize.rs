use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_interface::{Mint, TokenInterface};

use crate::events::InitializeGroupEvent;
use crate::states::{GroupConfigAccount, GROUP_CONFIG_ACCOUNT_PREFIX};

#[derive(Accounts)]
#[instruction(name: String)]
pub struct InitializeInputAccounts<'info> {
    #[account(mut)]
    pub fee_and_rent_payer: Signer<'info>,

    pub main_signing_authority: Signer<'info>,

    #[account(
        init,
        payer = fee_and_rent_payer,
        space = GroupConfigAccount::space(),
        seeds = [
            GROUP_CONFIG_ACCOUNT_PREFIX.as_bytes(),
            name.as_bytes()
        ],
        bump,
    )]
    pub config: Box<Account<'info, GroupConfigAccount>>,

    #[account(
        init,
        payer = fee_and_rent_payer,
        seeds = [
            b"group_token",
            name.as_bytes(),
        ],
        bump,
        mint::decimals = 0,
        mint::authority = config.key(),
        mint::freeze_authority = config.key(),
        mint::token_program = token_program,
    )]
    pub group_token_mint: Box<InterfaceAccount<'info, Mint>>,

    pub token_program: Interface<'info, TokenInterface>,

    pub associated_token_program: Program<'info, AssociatedToken>,

    pub system_program: Program<'info, System>,

    pub rent: Sysvar<'info, Rent>,
}

pub fn handle_initialize(
    ctx: Context<InitializeInputAccounts>,
    name: String,
    members: Vec<Pubkey>,
) -> Result<()> {
    let timestamp = Clock::get().unwrap().unix_timestamp;

    let config: &mut Box<Account<GroupConfigAccount>> = &mut ctx.accounts.config;
    config.main_signing_authority = ctx.accounts.main_signing_authority.key();
    config.last_block_timestamp = timestamp;
    config.name = name.clone();
    config.members = members.clone();
    config.group_token_mint = ctx.accounts.group_token_mint.key();
    config.claimed_members = Vec::new();

    emit!(InitializeGroupEvent {
        timestamp,
        name,
        members,
        group_token_mint: ctx.accounts.group_token_mint.key(),
    });

    Ok(())
}
