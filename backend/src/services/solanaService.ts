import { Connection, PublicKey, ParsedAccountData } from '@solana/web3.js';
import { TokenInfo, PoolInfo, WhaleTransaction, BlockInfo } from '../types';

export class SolanaService {
  private connection: Connection;

  constructor(rpcEndpoint: string) {
    this.connection = new Connection(rpcEndpoint, 'confirmed');
  }

  async getConnection(): Promise<Connection> {
    return this.connection;
  }

  async getTokenInfo(tokenAddress: string): Promise<TokenInfo | null> {
    try {
      const pubkey = new PublicKey(tokenAddress);
      const accountInfo = await this.connection.getParsedAccountInfo(pubkey);

      if (!accountInfo.value) {
        return null;
      }

      const data = accountInfo.value.data as ParsedAccountData;
      const parsed = data.parsed;

      if (parsed.type === 'mint') {
        return {
          address: tokenAddress,
          name: 'Unknown Token', // Would need token metadata for this
          symbol: 'UNKNOWN',
          decimals: parsed.info.decimals,
          supply: parsed.info.supply,
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching token info:', error);
      throw error;
    }
  }

  async getRecentBlocks(limit: number = 10): Promise<BlockInfo[]> {
    try {
      const slot = await this.connection.getSlot();
      const blocks: BlockInfo[] = [];

      for (let i = 0; i < limit; i++) {
        const currentSlot = slot - i;
        const block = await this.connection.getBlock(currentSlot);

        if (block) {
          blocks.push({
            slot: currentSlot,
            blockhash: block.blockhash,
            blockTime: block.blockTime || 0,
            transactionCount: block.transactions.length,
          });
        }
      }

      return blocks;
    } catch (error) {
      console.error('Error fetching recent blocks:', error);
      throw error;
    }
  }

  async getTransactionsByAddress(
    address: string,
    limit: number = 10
  ): Promise<WhaleTransaction[]> {
    try {
      const pubkey = new PublicKey(address);
      const signatures = await this.connection.getSignaturesForAddress(pubkey, {
        limit,
      });

      const transactions: WhaleTransaction[] = signatures.map((sig) => ({
        signature: sig.signature,
        from: address,
        to: 'Unknown', // Would need to parse transaction details
        amount: '0',
        timestamp: sig.blockTime || 0,
      }));

      return transactions;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  async getPoolInfo(poolAddress: string): Promise<PoolInfo | null> {
    try {
      // Placeholder - actual implementation would depend on DEX protocol
      // (Raydium, Orca, etc.)
      return {
        address: poolAddress,
        tokenA: 'Token A',
        tokenB: 'Token B',
        liquidity: '0',
        volume24h: '0',
      };
    } catch (error) {
      console.error('Error fetching pool info:', error);
      throw error;
    }
  }

  async getBalance(address: string): Promise<number> {
    try {
      const pubkey = new PublicKey(address);
      const balance = await this.connection.getBalance(pubkey);
      return balance / 1e9; // Convert lamports to SOL
    } catch (error) {
      console.error('Error fetching balance:', error);
      throw error;
    }
  }
}
