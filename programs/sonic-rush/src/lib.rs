use anchor_lang::prelude::*;

mod instructions;
mod states;
mod events;
mod utils;
mod error;

use instructions::*;

declare_id!("DHiUDknnqsFXtm1RuZMvtx58QSg32uhhym8nTqNhtyvj");

#[program]
pub mod sonic_rush {
    use super::*;

    pub fn initialize(
        ctx: Context<InitializeInputAccounts>,
        name: String,
        members: Vec<Pubkey>,
    ) -> Result<()> {
        handle_initialize(ctx, name, members)
    }

    pub fn claim_token(
        ctx: Context<ClaimTokenAccounts>,
        group_name: String,
    ) -> Result<()> {
        handle_claim_token(ctx, group_name)
    }

}
