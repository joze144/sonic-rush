export type SonicRush = {
  "version": "0.1.0",
  "name": "sonic_rush",
  "instructions": [
    {
      "name": "claimToken",
      "accounts": [
        {
          "name": "claimer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "groupTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "claimerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "groupName",
          "type": "string"
        }
      ]
    },
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "feeAndRentPayer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mainSigningAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "groupTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "members",
          "type": {
            "vec": "publicKey"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "groupConfigAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lastBlockTimestamp",
            "type": "i64"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "mainSigningAuthority",
            "type": "publicKey"
          },
          {
            "name": "members",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "groupTokenMint",
            "type": "publicKey"
          },
          {
            "name": "claimedMembers",
            "type": {
              "vec": "publicKey"
            }
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "InitializeGroupEvent",
      "fields": [
        {
          "name": "timestamp",
          "type": "i64",
          "index": false
        },
        {
          "name": "name",
          "type": "string",
          "index": false
        },
        {
          "name": "members",
          "type": {
            "vec": "publicKey"
          },
          "index": false
        },
        {
          "name": "groupTokenMint",
          "type": "publicKey",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidMainSigningAuthority",
      "msg": "Invalid main signing authority"
    },
    {
      "code": 6001,
      "name": "InvalidSigningAuthority",
      "msg": "Invalid signing authority"
    },
    {
      "code": 6002,
      "name": "InvalidBackAuthority",
      "msg": "Invalid back authority"
    },
    {
      "code": 6003,
      "name": "ValueIsZero",
      "msg": "Value is zero"
    },
    {
      "code": 6004,
      "name": "InvalidLength",
      "msg": "Invalid length"
    },
    {
      "code": 6005,
      "name": "InvalidPercentage",
      "msg": "Invalid percentage"
    },
    {
      "code": 6006,
      "name": "InvalidPaymentSupply",
      "msg": "Invalid payment supply"
    },
    {
      "code": 6007,
      "name": "GroupTokenDisable",
      "msg": "Group token disable"
    },
    {
      "code": 6008,
      "name": "UserAccountDisable",
      "msg": "User account disable"
    },
    {
      "code": 6009,
      "name": "UserIndexAccountDisable",
      "msg": "User index account disable"
    },
    {
      "code": 6010,
      "name": "InvalidUserIndex",
      "msg": "Invalid user index"
    },
    {
      "code": 6011,
      "name": "InvalidConvertAmount",
      "msg": "Invalid convert amount"
    },
    {
      "code": 6012,
      "name": "InvalidGenerateAmount",
      "msg": "Invalid generate amount"
    },
    {
      "code": 6013,
      "name": "CannotClaim",
      "msg": "Cannot claim"
    },
    {
      "code": 6014,
      "name": "InvalidTokenAccountAuthority",
      "msg": "Invalid token account authority"
    },
    {
      "code": 6015,
      "name": "InvalidTokenAmountForClaimRequest",
      "msg": "Invalid token amount for claim request"
    },
    {
      "code": 6016,
      "name": "AlreadyClaimed",
      "msg": "Already claimed"
    },
    {
      "code": 6017,
      "name": "NotAGroupMember",
      "msg": "Not a group member"
    }
  ]
};