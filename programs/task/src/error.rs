use anchor_lang::error_code;

#[error_code]
pub enum TaskError {
    #[msg("Invalid reward distribution: sum of amounts doesn't match locked amount")]
    InvalidRewardDistribution,
    #[msg("Task not found")]
    TaskNotFound,
    #[msg("Unauthorized: only task creator can submit reward distribution")]
    Unauthorized,
    #[msg("Reward already claimed")]
    RewardAlreadyClaimed,
    #[msg("Not eligible for reward")]
    NotEligible,
    #[msg("Reward distribution not submitted")]
    RewardDistributionNotSubmitted,
}