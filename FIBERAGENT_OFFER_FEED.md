# FiberAgent Offer Feed System

**Purpose:** Real-time offer catalog for social media agents to query and post deals  
**Status:** Scaffolding complete | Ready for integration  
**Last Updated:** 2026-02-09 22:05 GMT+1

---

## Offer Schema

```json
{
  "offer_id": "fiberagent_123456",
  "merchant": "Nike",
  "category": "fitness",
  "product": "Air Max Shoes",
  "cashback_percentage": 5,
  "cashback_amount": 12.50,
  "price": 250,
  "offer_url": "https://nike.com/air-max",
  "image_url": "https://cdn.example.com/nike-air-max.jpg",
  "valid_until": "2026-02-16T23:59:59Z",
  "tokens": ["USDC", "SOL", "MON"],
  "posted_at": "2026-02-09T22:05:00Z",
  "expires_at": "2026-02-10T22:05:00Z"
}
```

---

## Category Mappings

| Category | Tokens | Examples |
|----------|--------|----------|
| fitness | SOL, MON, USDC | Nike, Lululemon, Peloton |
| electronics | MON, USDC, ETH | Apple, Best Buy, Dell |
| defi | MON, USDC | Aave, Lido, Curve |
| gaming | SOL, MON | Steam, Epic, Roblox |
| fashion | USDC, SOL | Zara, H&M, ASOS |

---

## Endpoints (To Be Implemented)

### GET /api/offers/feed
Returns recent offers (last 24h) filtered by category

**Query Params:**
- `category` (optional): fitness, electronics, defi, gaming, fashion
- `token` (optional): SOL, MON, USDC, etc.
- `limit` (default: 10)

**Response:**
```json
{
  "offers": [...],
  "total": 47,
  "category_counts": {
    "fitness": 12,
    "electronics": 8,
    "defi": 15,
    "gaming": 7,
    "fashion": 5
  }
}
```

### POST /api/offers/webhook (From Wildfire)
Receives new offers from Wildfire API

**Payload:**
```json
{
  "merchant": "Nike",
  "category": "fitness",
  "cashback_rate": 0.05,
  "product_url": "https://nike.com/...",
  "valid_for_days": 7
}
```

---

## Dedupe Logic

- **Window:** 24 hours
- **Key:** merchant + category combination
- **Action:** Keep highest cashback rate only
- **Example:** 2 Nike fitness offers in 24h → post only the 5% one (skip 3%)

---

## Next Steps

1. Add `/api/offers/feed` endpoint to API
2. Implement webhook receiver for Wildfire API
3. Create deduplication worker (runs every 5 minutes)
4. Expose to social agent for daily posting

**Assigned to:** Task 5.2 implementation phase

---

## Implementation Timeline

| Phase | Task | ETA |
|-------|------|-----|
| 5.1 | Webhook listener + schema | Feb 9 |
| 5.2 | Feed endpoint + dedup | Feb 10 |
| 5.3 | Social agent integration | Feb 10-11 |
| Phase 2 | Staking + kickbacks | Feb 12-14 |

