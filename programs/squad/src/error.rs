use anchor_lang::prelude::*;

#[error_code]
pub enum SonicRushError {
    #[msg("Invalid main signing authority")]
    InvalidMainSigningAuthority,

    #[msg("Invalid signing authority")]
    InvalidSigningAuthority,

    #[msg("Invalid back authority")]
    InvalidBackAuthority,

    #[msg("Value is zero")]
    ValueIsZero,

    #[msg("Invalid length")]
    InvalidLength,

    #[msg("Invalid percentage")]
    InvalidPercentage,

    #[msg("Invalid payment supply")]
    InvalidPaymentSupply,

    #[msg("Group token disable")]
    GroupTokenDisable,

    #[msg("User account disable")]
    UserAccountDisable,

    #[msg("User index account disable")]
    UserIndexAccountDisable,

    #[msg("Invalid user index")]
    InvalidUserIndex,

    #[msg("Invalid convert amount")]
    InvalidConvertAmount,

    #[msg("Invalid generate amount")]
    InvalidGenerateAmount,

    #[msg("Cannot claim")]
    CannotClaim,

    #[msg("Invalid token account authority")]
    InvalidTokenAccountAuthority,

    #[msg("Invalid token amount for claim request")]
    InvalidTokenAmountForClaimRequest,

    #[msg("Already claimed")]
    AlreadyClaimed,

    #[msg("Not a group member")]
    NotAGroupMember,
}
