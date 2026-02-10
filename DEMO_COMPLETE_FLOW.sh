#!/bin/bash

# FETCH Agent-to-Agent Shopping Demo
# Complete flow showing: registration → search → Fiber Points timeline → earnings
# This demo shows an external agent helping their users find products via Fetch

set -e

FETCH_API="https://api.staging.fiber.shop/v1"
MONAD_WALLET="7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  🤖 FiberAgent Agent-to-Agent Shopping Platform - Demo        ║"
echo "║                                                                ║"
echo "║  Showing: External Agent registering + searching products     ║"
echo "║           for their users, with timeline explanation          ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# ============================================================================
# PART 1: EXTERNAL AGENT REGISTERS
# ============================================================================

echo ""
echo "┌─ PART 1: EXTERNAL AGENT REGISTRATION ─────────────────────────┐"
echo ""
echo "🎯 Scenario: A Twitter Bot wants to help users find deals"
echo ""
echo "📤 Request:"
echo "  POST /v1/agent/register"
echo "  {\"agent_name\": \"Twitter Shopping Bot\", \"wallet_address\": \"...\", ...}"
echo ""

REGISTER=$(curl -s -X POST "$FETCH_API/agent/register" \
  -H "Content-Type: application/json" \
  -d '{
    "agent_name": "Twitter Shopping Bot",
    "wallet_address": "'$MONAD_WALLET'",
    "description": "AI bot helping Twitter users find the best deals on products"
  }')

AGENT_ID=$(echo $REGISTER | jq -r '.agent_id')

echo "📥 Response:"
echo $REGISTER | jq '.'
echo ""
echo "✅ Agent Registered!"
echo "   Agent ID: $AGENT_ID"
echo "   Status: active"
echo "   Reputation Score: 1.0"
echo ""

# ============================================================================
# PART 2: EXTERNAL AGENT SEARCHES FOR PRODUCTS
# ============================================================================

echo "└─────────────────────────────────────────────────────────────────┘"
echo ""
echo "┌─ PART 2: EXTERNAL AGENT SEARCHES FOR PRODUCTS ──────────────────┐"
echo ""
echo "🎯 Scenario: A user tweets 'I need running shoes'"
echo "            The Twitter Bot queries Fetch for recommendations"
echo ""
echo "📤 Request:"
echo "  GET /v1/agent/search?keywords=running+shoes&agent_id=$AGENT_ID&..."
echo ""

SEARCH=$(curl -s "$FETCH_API/agent/search?keywords=running+shoes&agent_id=$AGENT_ID&wallet=$MONAD_WALLET&limit=5")

RESULTS=$(echo $SEARCH | jq '.results_count')

echo "📥 Response: Found $RESULTS merchant(s)"
echo $SEARCH | jq '.results[] | {merchant_name, cashback: .cashback.display, affiliate_link}'
echo ""
echo "✅ Search Results Ready!"
echo "   The Twitter Bot now has:"
echo "   - Merchant names"
echo "   - Cashback rates (e.g., 3.25%)"
echo "   - Affiliate links (wild.link)"
echo ""

# ============================================================================
# PART 3: EXTERNAL AGENT SHARES WITH USERS
# ============================================================================

echo "└─────────────────────────────────────────────────────────────────┘"
echo ""
echo "┌─ PART 3: BOT SHARES RESULTS WITH USER ──────────────────────────┐"
echo ""
echo "🎯 What the Twitter Bot tells the user:"
echo ""
echo "   🏪 Altra Running (3.25% cashback)"
echo "      Shop: https://wild.link/e?d=altrarunning.com&u=..."
echo "      (Click to buy - you pay normal price, I earn commission)"
echo ""

# ============================================================================
# PART 4: USER BUYS (SIMULATED)
# ============================================================================

echo "└─────────────────────────────────────────────────────────────────┘"
echo ""
echo "┌─ PART 4: USER BUYS (SIMULATED) ────────────────────────────────┐"
echo ""
echo "🎯 What happens:"
echo ""
echo "   Timeline:"
echo "   ├─ Day 0:   User clicks affiliate link and buys running shoes ($120)"
echo "   │           Fiber tracking cookie fires automatically"
echo "   │"
echo "   ├─ Days 1-5: Fiber Points credited to agent"
echo "   │           (3.25% of $120 = \$3.90 earnings)"
echo "   │           This shows immediately in earnings API"
echo "   │"
echo "   ├─ Days 1-90: Merchant confirms sale to Wildfire"
echo "   │            Status: PENDING → CONFIRMED → READY"
echo "   │"
echo "   └─ Day 90 (max): Crypto payment sent to agent's wallet"
echo "                   Status: PAID"
echo ""

# ============================================================================
# PART 5: CHECK EARNINGS (SIMULATED AFTER PURCHASE)
# ============================================================================

echo "└─────────────────────────────────────────────────────────────────┘"
echo ""
echo "┌─ PART 5: CHECK EARNINGS ───────────────────────────────────────┐"
echo ""
echo "📤 Request:"
echo "  GET /v1/agent/earnings/$AGENT_ID"
echo ""

EARNINGS=$(curl -s "$FETCH_API/agent/earnings/$AGENT_ID")

echo "📥 Response:"
echo $EARNINGS | jq '.'
echo ""
echo "📊 Current Status:"
TOTAL=$(echo $EARNINGS | jq '.total_earnings_usd')
PENDING=$(echo $EARNINGS | jq '.pending_payout_usd')
REPUTATION=$(echo $EARNINGS | jq '.reputation_score')

echo "   Total Earnings: \$$TOTAL"
echo "   Pending Payout: \$$PENDING"
echo "   Reputation Score: $REPUTATION (ERC-8004)"
echo "   Cashback Multiplier: 1.0"
echo ""

# ============================================================================
# PART 6: TIMELINE EXPLANATION
# ============================================================================

echo "└─────────────────────────────────────────────────────────────────┘"
echo ""
echo "┌─ PART 6: PAYMENT TIMELINE (CRITICAL!) ──────────────────────────┐"
echo ""
echo "⏱️  FIBER POINTS TIMELINE (1-5 days):"
echo "   └─ What: Points credited to agent's Fetch account"
echo "      When: 1-5 days after user purchases"
echo "      Why: Fiber processes commissions daily in batches"
echo "      Shows in: Earnings API immediately when credited"
echo ""
echo "💰 CRYPTO PAYOUT TIMELINE (1-90 days total):"
echo "   └─ Day 0-5:   Fiber Points appear (tracked in real-time)"
echo "      Day 1-90:  Merchant confirms sale through Wildfire"
echo "                 (Some merchants take longer)"
echo "      Day 90:    Crypto sent to Monad wallet"
echo ""
echo "⚠️  IMPORTANT:"
echo "   • Fiber Points appear in 1-5 days (you can track progress)"
echo "   • Actual crypto takes up to 90 days (merchant dependent)"
echo "   • This is standard for affiliate marketing"
echo "   • Set expectations with users upfront!"
echo ""

# ============================================================================
# PART 7: WHAT'S NEXT FOR THE AGENT
# ============================================================================

echo "└─────────────────────────────────────────────────────────────────┘"
echo ""
echo "┌─ PART 7: HOW TO EARN MORE ─────────────────────────────────────┐"
echo ""
echo "📈 Strategy 1: Volume"
echo "   More recommendations → More sales → More commissions"
echo ""
echo "🎯 Strategy 2: Niche"
echo "   \"I'm the expert for eco-friendly products\""
echo "   Users trust you → Higher conversion → More earnings"
echo ""
echo "💎 Strategy 3: Reputation"
echo "   Build ERC-8004 reputation → Negotiate better rates"
echo "   Higher rates → Higher earnings per sale"
echo ""

# ============================================================================
# FINAL SUMMARY
# ============================================================================

echo "└─────────────────────────────────────────────────────────────────┘"
echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                      🎉 DEMO COMPLETE 🎉                       ║"
echo "╠════════════════════════════════════════════════════════════════╣"
echo "║                                                                ║"
echo "║  What the external agent just did:                           ║"
echo "║  ✅ Registered with Fetch                                    ║"
echo "║  ✅ Searched for products                                    ║"
echo "║  ✅ Got affiliate links to share                             ║"
echo "║  ✅ Understood the payment timeline                          ║"
echo "║                                                                ║"
echo "║  Next steps for a real agent:                                ║"
echo "║  1. Create Monad wallet (base58 format)                      ║"
echo "║  2. Register with Fetch using wallet address                ║"
echo "║  3. Search for products when users ask                       ║"
echo "║  4. Share affiliate links (wild.link)                        ║"
echo "║  5. Track earnings in real-time                              ║"
echo "║  6. Wait 1-90 days for crypto payout                        ║"
echo "║                                                                ║"
echo "║  Documentation: See AGENTS.md for full integration guide    ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
