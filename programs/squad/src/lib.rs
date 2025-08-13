use anchor_lang::prelude::*;

mod instructions;
mod states;
mod events;
mod error;

use instructions::*;

declare_id!("AQehvXopTZuh9qT3jdZ8L1RZumq1eqhmLAM6avWNNJte");

#[program]
pub mod squad {
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
