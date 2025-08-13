use anchor_lang::prelude::*;

#[event]
pub struct InitializeGroupEvent {
    pub timestamp: i64,

    pub name: String,

    pub members: Vec<Pubkey>,

    pub group_token_mint: Pubkey,
}
