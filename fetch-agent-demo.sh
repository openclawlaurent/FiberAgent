#!/bin/bash

# Fetch Agent Demo - Agent-to-Agent Shopping
# Shows an external agent using Fetch to help their users find products

FETCH_BASE="https://api.staging.fiber.shop/v1"
DEMO_WALLET="7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"

echo "=========================================="
echo "🤖 Fetch Agent Demo - Agent-to-Agent Shopping"
echo "=========================================="
echo ""

# Step 1: External agent registers with Fetch
echo "📝 Step 1: External Agent Registers with Fetch"
echo "Request: External Agent says 'I want to help my users find products'"
echo ""

REGISTER_RESPONSE=$(curl -s -X POST "$FETCH_BASE/agent/register" \
  -H "Content-Type: application/json" \
  -d '{
    "agent_name": "Twitter Shopping Bot",
    "wallet_address": "'"$DEMO_WALLET"'",
    "description": "AI agent helping Twitter users find the best deals"
  }')

AGENT_ID=$(echo $REGISTER_RESPONSE | jq -r '.agent_id')

echo "Response:"
echo $REGISTER_RESPONSE | jq '.'
echo ""
echo "✅ External Agent Registered!"
echo "   Agent ID: $AGENT_ID"
echo ""

# Step 2: External agent searches for products
echo "=========================================="
echo "🔍 Step 2: External Agent Searches for Products"
echo "Request: 'My users are looking for running shoes'"
echo ""

SEARCH_RESPONSE=$(curl -s "$FETCH_BASE/agent/search?keywords=running+shoes&agent_id=$AGENT_ID&wallet=$DEMO_WALLET&limit=5")

echo "Response:"
echo $SEARCH_RESPONSE | jq '.'
echo ""

# Extract results
RESULTS_COUNT=$(echo $SEARCH_RESPONSE | jq '.results_count')
echo "✅ Found $RESULTS_COUNT merchant(s) with running shoes"
echo ""

# Step 3: Show what the external agent can tell their users
echo "=========================================="
echo "💰 Step 3: External Agent Shows Results to Users"
echo ""

if [ "$RESULTS_COUNT" -gt 0 ]; then
  echo "The external agent tells their users:"
  echo ""
  
  echo $SEARCH_RESPONSE | jq -r '.results[] | 
    "🏪 \(.merchant_name)
    💵 Cashback: \(.cashback.display)
    🔗 Shop here: \(.affiliate_link)
    "' | head -20
fi

echo ""
echo "=========================================="
echo "✅ Demo Complete!"
echo "=========================================="
echo ""
echo "What happened:"
echo "1. External agent registered → Got agent_id"
echo "2. External agent searched for products → Got results with cashback"
echo "3. External agent shows their users the affiliate links"
echo "4. When users buy, the external agent earns cashback"
echo ""
echo "Next: Check earnings"
echo ""

# Step 4: Check earnings (after purchases would be tracked)
echo "$ curl -s '$FETCH_BASE/agent/earnings/$AGENT_ID' | jq '.'"
echo ""
curl -s "$FETCH_BASE/agent/earnings/$AGENT_ID" | jq '.'
