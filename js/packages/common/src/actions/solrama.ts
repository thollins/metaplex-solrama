import {
    PublicKey,
    SystemProgram,
    SYSVAR_RENT_PUBKEY,
    TransactionInstruction,
    LAMPORTS_PER_SOL,
  } from "@solana/web3.js";
  
  // TAH Create an instruction to transfer SOL from one wallet to another wallet
export function createTransferSOLToReceiverInstruction (
    SOLAmt: number,
    payer: PublicKey,
    receiver: PublicKey
  )
  {
    const keys = [
      {
        pubkey: payer,
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: receiver,
        isSigner: false,
        isWritable: true,
      },
    ];
  
    return SystemProgram.transfer({
        fromPubkey: payer,
        toPubkey: receiver,
        lamports: SOLAmt * LAMPORTS_PER_SOL,
      });
  }
  