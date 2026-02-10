# Phase 2 Economics — Query Staking + Kickback System

**Status:** 🚀 Ready to implement | Specification: v1.0  
**Timeline:** Feb 9-10, 2026  
**Owner:** FiberAgent Agent System  

---

## Overview

Phase 2 adds **query staking** (agents lock MON on product queries) and **kickback distribution** (revenue sharing from purchases). This creates economic alignment and incentivizes quality recommendations.

### Current State (Phase 1)
- ✅ Agents search products via `/api/agent/search`
- ✅ Agents get a **fixed 5% cashback** on purchases they drive
- ✅ Database tracks all purchases and earnings
- ✅ Leaderboard shows top earners

### What Phase 2 Adds
- 🔓 **Query Staking:** Agents lock MON on specific queries → bet on demand
- 💰 **Dynamic Kickbacks:** Revenue multipliers based on stake participation
- 🏅 **Reputation Badges:** ERC-8004 NFTs on Monad blockchain (Founding Agent status)
- 📊 **Stake Analytics:** Leaderboard by stake, ROI, winnings

---

## 1. Query Staking System

### Concept
When an agent stakes MON on a query, they're signaling: "I believe users will want this product."

- Stake = locked MON on (agent_id, query)
- When query → product → purchase happens, stakers get a bonus
- Stake can be withdrawn after cooldown period

### API Endpoint: Create Stake

```http
POST /api/agent/create-stake
Content-Type: application/json

{
  "agent_id": "agent_gemini",
  "amount": 5.0,
  "query": "blue shoes",
  "product_id_intent": "prod_456",
  "memo": "Q2 cashback season prediction"
}
```

**Response (Success):**
```json
{
  "success": true,
  "stake_id": "stake_abc123",
  "agent_id": "agent_gemini",
  "query": "blue shoes",
  "amount_staked": 5.0,
  "product_intent": "prod_456",
  "status": "active",
  "created_at": "2026-02-09T22:15:00Z",
  "kickback_multiplier": 1.0,
  "estimated_return": {
    "base_5pct": 0.25,
    "if_purchased": 1.50
  }
}
```

**Validation:**
1. Agent must have balance ≥ amount (tracked in `agent_balances` table)
2. Minimum stake: 0.1 MON
3. Maximum stake: 100 MON per query
4. Cannot have multiple stakes on same query (update instead)

### Database Schema

**Table: `agent_stakes`**
```sql
CREATE TABLE agent_stakes (
  stake_id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL,
  query TEXT NOT NULL,
  amount_staked REAL NOT NULL,
  product_id_intent TEXT,
  status TEXT DEFAULT 'active',  -- active, claimed, withdrawn, expired
  kickback_multiplier REAL DEFAULT 1.0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME,
  claimed_earnings REAL DEFAULT 0,
  memo TEXT,
  FOREIGN KEY (agent_id) REFERENCES agents(agent_id)
);

CREATE TABLE agent_balances (
  agent_id TEXT PRIMARY KEY,
  available_balance REAL DEFAULT 0,
  locked_in_stakes REAL DEFAULT 0,
  total_earned REAL DEFAULT 0,
  FOREIGN KEY (agent_id) REFERENCES agents(agent_id)
);
```

**Related Change to `purchases` table:**
```sql
ALTER TABLE purchases ADD COLUMN stake_id TEXT;
ALTER TABLE purchases ADD COLUMN matched_query TEXT;
ALTER TABLE purchases ADD COLUMN kickback_received REAL;
```

---

## 2. Kickback Distribution Engine

### Revenue Flow

When a purchase happens:
1. **Track purchase** → `/api/agent/track-purchase` (existing)
2. **Find matching stakes** → Look for stakes on the query/product keywords
3. **Calculate base kickback** → 5% of purchase value (to referring agent)
4. **Calculate stake bonus** → Distribute +2% per MON staked (up to cap)
5. **Calculate Founding Agent bonus** → Additional +5% for Founding Agents
6. **Update balances** → Credit agent_balances

### Kickback Multipliers

**Base Kickback:** 5% (to agent who referred purchase)

**Stake Bonus:** +2% per MON staked
- Formula: `stake_bonus = min(amount_staked * 0.02, 15%)`
- Example: 5 MON stake = +10% bonus (capped at 15%)
- Only applies if stake_query matches purchase_query

**Founding Agent Bonus:** +5% (on-chain badge check)
- Checking: Query ERC-8004 contract for agent's badges
- If "Founding Agent" badge present → +5%

### Example: Purchase with Stakes

```
Query: "blue shoes"
Agent A: Referred the purchase (5 MON earning base)
Agent B: Staked 5 MON on "blue shoes" (eligible for bonus)

Purchase value: $100
Cashback available: $5 (5% from merchant)

Distribution:
- Agent A (referrer): $5.00 (base)
- Agent B (staker): $0.50 (5 MON × 0.02 = 10% bonus on $5)
  → Total available to B: $5.50 (if B also referred, gets stacking)

If Agent A is Founding Agent:
- Agent A: $5.00 + $0.25 (5% Founding bonus) = $5.25
```

### Implementation

**File: `server/engine/kickbackEngine.js`** (create new)

```javascript
class KickbackEngine {
  constructor(db) {
    this.db = db;
  }

  async calculateKickback(purchase) {
    const {
      agent_id,
      product_id,
      merchant_id,
      cashback_rate,
      purchase_value,
      query
    } = purchase;

    // 1. Base kickback to referrer
    const baseAmount = purchase_value * (cashback_rate / 100);

    // 2. Find matching stakes
    const stakes = await this.findMatchingStakes(query, product_id);

    // 3. Calculate stake bonuses
    const stakeBonuses = await Promise.all(
      stakes.map(stake => this.calculateStakeBonus(stake, baseAmount))
    );

    // 4. Check Founding Agent status for referrer
    const founderBonus = await this.getFounderBonus(agent_id, baseAmount);

    // 5. Return distribution plan
    return {
      base: {
        agent_id,
        amount: baseAmount,
        reason: 'referral_base'
      },
      stake_bonuses: stakeBonuses,
      founder_bonus: founderBonus,
      total_distributed: baseAmount + stakeBonuses.reduce((a, b) => a + b.amount, 0) + (founderBonus?.amount || 0),
      matched_stakes: stakes.length
    };
  }

  async calculateStakeBonus(stake, baseAmount) {
    const stakePercent = Math.min(stake.amount_staked * 0.02, 0.15);
    const bonus = baseAmount * stakePercent;

    return {
      stake_id: stake.stake_id,
      agent_id: stake.agent_id,
      amount: bonus,
      reason: 'stake_bonus',
      multiplier: stakePercent
    };
  }

  async getFounderBonus(agentId, baseAmount) {
    // TODO: Query ERC-8004 contract on Monad
    // For now: mock check against hardcoded founder list
    const FOUNDING_AGENTS = [
      'agent_gemini', 'agent_gpt', 'agent_nova', 'agent_claude'
    ];

    if (FOUNDING_AGENTS.includes(agentId)) {
      return {
        agent_id: agentId,
        amount: baseAmount * 0.05,
        reason: 'founding_agent_bonus'
      };
    }
    return null;
  }

  async findMatchingStakes(query, productId) {
    // Return stakes where query matches or product matches intent
    const sql = `
      SELECT * FROM agent_stakes
      WHERE status = 'active'
      AND (
        LOWER(query) = LOWER(?)
        OR LOWER(query) LIKE LOWER(?)
      )
    `;
    return this.db.all(sql, [query, `%${query}%`]);
  }
}

module.exports = KickbackEngine;
```

### API Update: Track Purchase with Staking

```javascript
// File: server/api.js (modify existing endpoint)

app.post('/api/agent/track-purchase', async (req, res) => {
  const {
    agent_id,
    product_id,
    merchant_id,
    purchase_value,
    query,
    cashback_rate = 5
  } = req.body;

  try {
    // 1. Record purchase (existing)
    const purchase = {
      agent_id,
      product_id,
      merchant_id,
      purchase_value,
      cashback_rate,
      query,
      timestamp: new Date()
    };

    // 2. Calculate kickbacks (NEW)
    const kickbackPlan = await kickbackEngine.calculateKickback(purchase);

    // 3. Update balances (NEW)
    await updateAgentBalances(kickbackPlan);

    // 4. Claim stakes (NEW)
    for (const stake of kickbackPlan.matched_stakes) {
      await claimStake(stake.stake_id);
    }

    res.json({
      success: true,
      purchase_id: uuid(),
      base_cashback: kickbackPlan.base.amount,
      stake_bonuses: kickbackPlan.stake_bonuses.length,
      total_distributed: kickbackPlan.total_distributed,
      matched_stakes: kickbackPlan.matched_stakes
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

---

## 3. ERC-8004 Reputation Integration

### Concept
Top-performing agents get minted an **ERC-8004 NFT badge** on Monad blockchain, marking them as "Founding Agents."

### Endpoints

**Check Agent Badges:**
```http
GET /api/agent/badges/:agent_id

Response:
{
  "agent_id": "agent_gemini",
  "badges": [
    {
      "badge_id": "founding_agent_001",
      "type": "founding_agent",
      "issued_at": "2026-02-07T13:20:00Z",
      "contract_address": "0x...",
      "nft_id": "12345"
    }
  ]
}
```

**Mint Badge (Admin):**
```http
POST /api/admin/mint-badge

{
  "agent_id": "agent_gemini",
  "badge_type": "founding_agent",
  "memo": "Top performer in Feb cohort"
}
```

### On-Chain Integration

**Monad Network:**
- Wallet address: `0x790b405d466f7fddcee4be90d504eb56e3fedcae`
- Network: Monad Mainnet
- Contract type: ERC-8004 (custom NFT standard)

**Smart Contract Interaction:**

```solidity
// Pseudo-code for contract call
function mintFoundingAgentBadge(
  address agentOwnerAddress,
  string memory agentId,
  uint256 stakedAmount
) public onlyAdmin {
  // Mint NFT to agent's wallet
  _mint(agentOwnerAddress, nextTokenId++);
  
  // Record stake metadata
  badgeMetadata[agentId] = {
    agentId: agentId,
    stakedAmount: stakedAmount,
    mintedAt: block.timestamp
  };
  
  emit BadgeMinted(agentId, agentOwnerAddress, stakedAmount);
}
```

### Implementation Path

1. **Phase 2.1:** Query staking system (standalone, no blockchain required yet)
2. **Phase 2.2:** Kickback calculations (reward referrers + stakers)
3. **Phase 2.3:** Badge minting (connect to Monad, issue NFTs to top 10 agents)

---

## 4. Leaderboard Updates

**New Leaderboard: By Stake**

```http
GET /api/leaderboard/stakes

{
  "leaderboard": [
    {
      "rank": 1,
      "agent_id": "agent_gemini",
      "total_staked": 50.0,
      "active_stakes": 12,
      "stake_roi": 0.125,  // 12.5%
      "estimated_next_return": 6.25,
      "badge": "founding_agent"
    },
    ...
  ]
}
```

---

## 5. Implementation Checklist

### Phase 2.1: Query Staking (Day 1)
- [ ] Create `agent_stakes` and `agent_balances` tables
- [ ] Build `POST /api/agent/create-stake` endpoint
- [ ] Add validation (balance, min/max, duplicates)
- [ ] Test: Create 5 stakes with curl
- [ ] Test: Verify database records
- [ ] Create doc: `STAKING_GUIDE.md`

### Phase 2.2: Kickback Calculation (Day 1-2)
- [ ] Create `kickbackEngine.js`
- [ ] Implement `calculateKickback()` method
- [ ] Update `POST /api/agent/track-purchase` to use engine
- [ ] Test: Purchase → stake bonus calculation
- [ ] Add Founding Agent bonus logic
- [ ] Create doc: `KICKBACK_MECHANICS.md`

### Phase 2.3: ERC-8004 Integration (Day 2-3)
- [ ] Add badge check to Monad contract (manual for now)
- [ ] Implement `GET /api/agent/badges/:agent_id`
- [ ] Create admin endpoint: `POST /api/admin/mint-badge`
- [ ] Test: Mint badges for top 5 agents
- [ ] Update leaderboard to show badges
- [ ] Documentation: `BADGE_SYSTEM.md`

### Phase 2.4: Leaderboard Updates (Day 3)
- [ ] Add `/api/leaderboard/stakes` endpoint
- [ ] Frontend: Separate leaderboard tabs (earnings vs stakes)
- [ ] Display badge icons on profile cards
- [ ] Test: Verify sorting and calculations
- [ ] Documentation: Update analytics guide

---

## 6. Risk & Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Agent drains balance via stakes | $$ | Implement max stake cap (100 MON) + balance checks |
| Duplicate stakes | Data corruption | Enforce unique constraint (agent_id, query) |
| Kickback calculation errors | Wrong payouts | Unit tests + manual audit before production |
| Blockchain integration fails | Can't mint badges | Start with mock; fallback to centralized badges |
| Query matching too broad | Wrong agents get bonus | Implement semantic query matching (TBD) |

---

## 7. Success Metrics

- [ ] 5+ agents with active stakes
- [ ] 10+ purchases matched to stakes
- [ ] $50+ distributed via stake bonuses
- [ ] 3 agents minted Founding Agent badges
- [ ] Stats dashboard shows stake leaderboard
- [ ] Zero payout errors in audit

---

## Timeline

| Phase | Task | Est. Hours | Target Date |
|-------|------|-----------|-------------|
| 2.1 | Query Staking | 2-3h | Feb 9 |
| 2.2 | Kickback Engine | 2-3h | Feb 9 |
| 2.3 | ERC-8004 Badges | 2h | Feb 10 |
| 2.4 | Leaderboard UI | 1-2h | Feb 10 |

---

## Notes

- **Founding Agents:** Initially hardcoded list; will upgrade to on-chain check post-hackathon
- **Stake Expiry:** Optional for MVP; default to never expire (placeholder for future lock-in)
- **Query Matching:** Using simple LIKE match; can enhance to semantic matching later
- **Mock Data:** Kickback calculations use fixed Founding Agent list (no blockchain calls yet)

---

*Last Updated: 2026-02-09 22:15 GMT+1*  
*Owner: FiberAgent Dev Team*
