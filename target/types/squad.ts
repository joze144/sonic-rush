/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/squad.json`.
 */
export type Squad = {
  "address": "AQehvXopTZuh9qT3jdZ8L1RZumq1eqhmLAM6avWNNJte",
  "metadata": {
    "name": "squad",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "claimToken",
      "discriminator": [
        116,
        206,
        27,
        191,
        166,
        19,
        0,
        73
      ],
      "accounts": [
        {
          "name": "claimer",
          "writable": true,
          "signer": true
        },
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  67,
                  79,
                  78,
                  70,
                  73,
                  71
                ]
              },
              {
                "kind": "arg",
                "path": "groupName"
              }
            ]
          }
        },
        {
          "name": "groupTokenMint",
          "writable": true
        },
        {
          "name": "claimerTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "claimer"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "groupTokenMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
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
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "feeAndRentPayer",
          "writable": true,
          "signer": true
        },
        {
          "name": "mainSigningAuthority",
          "signer": true
        },
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  67,
                  79,
                  78,
                  70,
                  73,
                  71
                ]
              },
              {
                "kind": "arg",
                "path": "name"
              }
            ]
          }
        },
        {
          "name": "groupTokenMint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  114,
                  111,
                  117,
                  112,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110
                ]
              },
              {
                "kind": "arg",
                "path": "name"
              }
            ]
          }
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
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
            "vec": "pubkey"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "groupConfigAccount",
      "discriminator": [
        161,
        44,
        109,
        29,
        159,
        109,
        42,
        243
      ]
    }
  ],
  "events": [
    {
      "name": "initializeGroupEvent",
      "discriminator": [
        45,
        69,
        172,
        111,
        173,
        156,
        97,
        173
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidMainSigningAuthority",
      "msg": "Invalid main signing authority"
    },
    {
      "code": 6001,
      "name": "invalidSigningAuthority",
      "msg": "Invalid signing authority"
    },
    {
      "code": 6002,
      "name": "invalidBackAuthority",
      "msg": "Invalid back authority"
    },
    {
      "code": 6003,
      "name": "valueIsZero",
      "msg": "Value is zero"
    },
    {
      "code": 6004,
      "name": "invalidLength",
      "msg": "Invalid length"
    },
    {
      "code": 6005,
      "name": "invalidPercentage",
      "msg": "Invalid percentage"
    },
    {
      "code": 6006,
      "name": "invalidPaymentSupply",
      "msg": "Invalid payment supply"
    },
    {
      "code": 6007,
      "name": "groupTokenDisable",
      "msg": "Group token disable"
    },
    {
      "code": 6008,
      "name": "userAccountDisable",
      "msg": "User account disable"
    },
    {
      "code": 6009,
      "name": "userIndexAccountDisable",
      "msg": "User index account disable"
    },
    {
      "code": 6010,
      "name": "invalidUserIndex",
      "msg": "Invalid user index"
    },
    {
      "code": 6011,
      "name": "invalidConvertAmount",
      "msg": "Invalid convert amount"
    },
    {
      "code": 6012,
      "name": "invalidGenerateAmount",
      "msg": "Invalid generate amount"
    },
    {
      "code": 6013,
      "name": "cannotClaim",
      "msg": "Cannot claim"
    },
    {
      "code": 6014,
      "name": "invalidTokenAccountAuthority",
      "msg": "Invalid token account authority"
    },
    {
      "code": 6015,
      "name": "invalidTokenAmountForClaimRequest",
      "msg": "Invalid token amount for claim request"
    },
    {
      "code": 6016,
      "name": "alreadyClaimed",
      "msg": "Already claimed"
    },
    {
      "code": 6017,
      "name": "notAGroupMember",
      "msg": "Not a group member"
    }
  ],
  "types": [
    {
      "name": "groupConfigAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lastBlockTimestamp",
            "docs": [
              "timestamp when account updated"
            ],
            "type": "i64"
          },
          {
            "name": "name",
            "docs": [
              "group name"
            ],
            "type": "string"
          },
          {
            "name": "mainSigningAuthority",
            "docs": [
              "program main signing authority"
            ],
            "type": "pubkey"
          },
          {
            "name": "members",
            "docs": [
              "group members"
            ],
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "groupTokenMint",
            "docs": [
              "group token mint address"
            ],
            "type": "pubkey"
          },
          {
            "name": "claimedMembers",
            "docs": [
              "members who have claimed their tokens"
            ],
            "type": {
              "vec": "pubkey"
            }
          }
        ]
      }
    },
    {
      "name": "initializeGroupEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "members",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "groupTokenMint",
            "type": "pubkey"
          }
        ]
      }
    }
  ]
};
