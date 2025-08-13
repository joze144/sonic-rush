export type Task = {
    "version": "0.1.0";
    "name": "task";
    "instructions": [
        {
            "name": "claimReward";
            "accounts": [
                {
                    "name": "taskConfig";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "taskVault";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "claimer";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "systemProgram";
                    "isMut": false;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "taskName";
                    "type": "string";
                }
            ];
        },
        {
            "name": "createTask";
            "accounts": [
                {
                    "name": "taskConfig";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "creator";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "taskVault";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "systemProgram";
                    "isMut": false;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "name";
                    "type": "string";
                },
                {
                    "name": "lockedAmount";
                    "type": "u64";
                }
            ];
        },
        {
            "name": "initialize";
            "accounts": [
                {
                    "name": "globalConfig";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "admin";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "systemProgram";
                    "isMut": false;
                    "isSigner": false;
                }
            ];
            "args": [];
        },
        {
            "name": "submitRewardDistribution";
            "accounts": [
                {
                    "name": "taskConfig";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "creator";
                    "isMut": false;
                    "isSigner": true;
                }
            ];
            "args": [
                {
                    "name": "taskName";
                    "type": "string";
                },
                {
                    "name": "recipients";
                    "type": {
                        "vec": "publicKey";
                    };
                },
                {
                    "name": "amounts";
                    "type": {
                        "vec": "u64";
                    };
                }
            ];
        }
    ];
    "accounts": [
        {
            "name": "globalConfig";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "admin";
                        "type": "publicKey";
                    },
                    {
                        "name": "bump";
                        "type": "u8";
                    }
                ];
            };
        },
        {
            "name": "taskConfig";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "creator";
                        "type": "publicKey";
                    },
                    {
                        "name": "name";
                        "type": "string";
                    },
                    {
                        "name": "lockedAmount";
                        "type": "u64";
                    },
                    {
                        "name": "rewardDistributionSubmitted";
                        "type": "bool";
                    },
                    {
                        "name": "recipients";
                        "type": {
                            "vec": "publicKey";
                        };
                    },
                    {
                        "name": "amounts";
                        "type": {
                            "vec": "u64";
                        };
                    },
                    {
                        "name": "claimed";
                        "type": {
                            "vec": "bool";
                        };
                    },
                    {
                        "name": "bump";
                        "type": "u8";
                    }
                ];
            };
        }
    ];
    "events": [
        {
            "name": "RewardClaimed";
            "fields": [
                {
                    "name": "taskName";
                    "type": "string";
                    "index": false;
                },
                {
                    "name": "claimer";
                    "type": "publicKey";
                    "index": false;
                },
                {
                    "name": "amount";
                    "type": "u64";
                    "index": false;
                }
            ];
        },
        {
            "name": "RewardDistributionSubmitted";
            "fields": [
                {
                    "name": "taskName";
                    "type": "string";
                    "index": false;
                },
                {
                    "name": "recipients";
                    "type": {
                        "vec": "publicKey";
                    };
                    "index": false;
                },
                {
                    "name": "amounts";
                    "type": {
                        "vec": "u64";
                    };
                    "index": false;
                }
            ];
        },
        {
            "name": "TaskCreated";
            "fields": [
                {
                    "name": "creator";
                    "type": "publicKey";
                    "index": false;
                },
                {
                    "name": "name";
                    "type": "string";
                    "index": false;
                },
                {
                    "name": "lockedAmount";
                    "type": "u64";
                    "index": false;
                }
            ];
        }
    ];
    "errors": [
        {
            "code": 6000;
            "name": "InvalidRewardDistribution";
            "msg": "Invalid reward distribution: sum of amounts doesn't match locked amount";
        },
        {
            "code": 6001;
            "name": "TaskNotFound";
            "msg": "Task not found";
        },
        {
            "code": 6002;
            "name": "Unauthorized";
            "msg": "Unauthorized: only task creator can submit reward distribution";
        },
        {
            "code": 6003;
            "name": "RewardAlreadyClaimed";
            "msg": "Reward already claimed";
        },
        {
            "code": 6004;
            "name": "NotEligible";
            "msg": "Not eligible for reward";
        },
        {
            "code": 6005;
            "name": "RewardDistributionNotSubmitted";
            "msg": "Reward distribution not submitted";
        }
    ];
};
//# sourceMappingURL=task.d.ts.map