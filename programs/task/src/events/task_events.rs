use anchor_lang::prelude::*;

#[event]
pub struct TaskCreated {
    pub creator: Pubkey,
    pub name: String,
    pub locked_amount: u64,
}

#[event]
pub struct RewardDistributionSubmitted {
    pub task_name: String,
    pub recipients: Vec<Pubkey>,
    pub amounts: Vec<u64>,
}

#[event]
pub struct RewardClaimed {
    pub task_name: String,
    pub claimer: Pubkey,
    pub amount: u64,
}