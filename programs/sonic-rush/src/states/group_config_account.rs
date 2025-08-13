use anchor_lang::prelude::*;

pub const GROUP_CONFIG_ACCOUNT_PREFIX: &str = "CONFIG";

#[account]
pub struct GroupConfigAccount {
    /// timestamp when account updated
    pub last_block_timestamp: i64,

    /// group name
    pub name: String,

    /// program main signing authority
    pub main_signing_authority: Pubkey,

    /// group members
    pub members: Vec<Pubkey>,

    /// group token mint address
    pub group_token_mint: Pubkey,

    /// members who have claimed their tokens
    pub claimed_members: Vec<Pubkey>,
}

impl GroupConfigAccount {
    pub fn space() -> usize {
        8 // default
            + 8 // last_block_timestamp
            + 4 + 256 // name
            + 32 // main_signing_authority
            + 4 + 32 * 100 // members
            + 32 // group_token_mint
            + 4 + 32 * 100 // claimed_members
    }
}
