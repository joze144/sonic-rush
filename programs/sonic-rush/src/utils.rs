use anchor_lang::prelude::*;

use crate::error::SonicRushError;

pub fn check_main_signing_authority(
    main_signing_authority_from_account: Pubkey,
    main_signing_authority_from_input_accounts: Pubkey,
) -> Result<()> {
    if main_signing_authority_from_account != main_signing_authority_from_input_accounts {
        return Err(SonicRushError::InvalidMainSigningAuthority.into());
    }

    Ok(())
}

pub fn check_signing_authority(
    signing_authority_from_account: Pubkey,
    signing_authority_from_input_accounts: Pubkey,
) -> Result<()> {
    if signing_authority_from_account != signing_authority_from_input_accounts {
        return Err(SonicRushError::InvalidSigningAuthority.into());
    }

    Ok(())
}

pub fn check_back_authority(
    back_authority_from_account: Pubkey,
    back_authority_from_input_accounts: Pubkey,
) -> Result<()> {
    if back_authority_from_account != back_authority_from_input_accounts {
        return Err(SonicRushError::InvalidBackAuthority.into());
    }

    Ok(())
}
pub fn check_value_is_zero(value: usize) -> Result<()> {
    if value <= 0 {
        return Err(SonicRushError::ValueIsZero.into());
    }

    Ok(())
}

pub fn check_length(value_a: usize, value_b: usize) -> Result<()> {
    if value_a != value_b {
        return Err(SonicRushError::InvalidLength.into());
    }

    Ok(())
}

pub fn check_percentage(value: u16) -> Result<()> {
    if value != 10000 {
        return Err(SonicRushError::InvalidPercentage.into());
    }

    Ok(())
}

pub fn check_payment_supply(from_account: u64, from_param: u64) -> Result<()> {
    if from_param > from_account {
        return Err(SonicRushError::InvalidPaymentSupply.into());
    }

    Ok(())
}

pub fn check_is_group_token_enable(value: bool) -> Result<()> {
    if !value {
        return Err(SonicRushError::GroupTokenDisable.into());
    }

    Ok(())
}

pub fn check_is_user_account_enable(value: bool) -> Result<()> {
    if !value {
        return Err(SonicRushError::UserAccountDisable.into());
    }

    Ok(())
}

pub fn check_is_user_index_account_enable(value: bool) -> Result<()> {
    if !value {
        return Err(SonicRushError::UserIndexAccountDisable.into());
    }

    Ok(())
}

pub fn check_user_index(value_a: u16, value_b: u16) -> Result<()> {
    if value_a != value_b {
        return Err(SonicRushError::InvalidUserIndex.into());
    }

    Ok(())
}

pub fn check_convert_amount(from_account: u64, from_param: u64) -> Result<()> {
    if from_account > from_param {
        return Err(SonicRushError::InvalidConvertAmount.into());
    }

    Ok(())
}

pub fn check_generate_amount(from_account: u64, from_param: u64) -> Result<()> {
    if from_account > from_param {
        return Err(SonicRushError::InvalidGenerateAmount.into());
    }

    Ok(())
}

pub fn check_can_claim(value: u64) -> Result<()> {
    if value == 0 {
        return Err(SonicRushError::CannotClaim.into());
    }

    Ok(())
}

pub fn check_token_account_authority(
    value_from_account: Pubkey,
    value_from_input_account: Pubkey,
) -> Result<()> {
    if value_from_account != value_from_input_account {
        return Err(SonicRushError::InvalidTokenAccountAuthority.into());
    }

    Ok(())
}

pub fn check_amount_for_claim_request(requested_amount: u64, reamining_amount: u64) -> Result<()> {
    if requested_amount > reamining_amount {
        return Err(SonicRushError::InvalidTokenAmountForClaimRequest.into());
    }

    Ok(())
}

pub fn check_already_claimed(value: bool) -> Result<()> {
    if value {
        return Err(SonicRushError::AlreadyClaimed.into());
    }

    Ok(())
}
