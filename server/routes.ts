import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { predictionRequestSchema, type PredictionResponse } from "@shared/schema";

interface PolymarketToken {
  token_id: string;
  outcome: string;
  price: number;
}

interface PolymarketMarket {
  condition_id: string;
  question: string;
  tokens: PolymarketToken[];
  market_slug: string;
  end_date_iso: string;
  active: boolean;
}

interface PriceHistoryPoint {
  t: number;
  p: number;
}

const POLYMARKET_CLOB_URL = "https://clob.polymarket.com";
const POLYMARKET_GAMMA_URL = "https://gamma-api.polymarket.com";

function generateMockPrediction(address: string): PredictionResponse {
  const hash = address.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const seed = (hash % 100) / 100;
  
  const TFI = 0.45 + (seed * 0.5);
  const QSS = 0.35 + (seed * 0.55);
  const liquiditySafety = Math.max(0.08, 0.5 - (seed * 0.45));
  const holderSymmetry = 0.2 + (seed * 0.6);
  const anomalyCount = Math.floor(2 + seed * 8);

  const riskDescriptions = [
    "Bot funding activity increases",
    "Dev wallet movement detected",
    "Liquidity pool imbalance forming",
    "Large holder accumulation pattern",
    "Unusual transaction velocity spike",
    "Cross-chain bridge activity detected",
    "Smart contract interaction anomaly",
    "Token distribution asymmetry detected"
  ];

  const outcomes = ["rug", "pump & dump", "liquidity migration", "honeypot", "slow drain"];
  const timeframes = ["12h", "24h", "36h", "48h", "72h", "7d"];

  const riskWindows = [];
  const numRisks = 1 + Math.floor(seed * 4);
  for (let i = 0; i < numRisks; i++) {
    const timeOffset = (hash + i * 17) % 168;
    riskWindows.push({
      timeHours: 6 + timeOffset,
      confidence: 0.65 + ((hash + i) % 30) / 100,
      description: riskDescriptions[(hash + i) % riskDescriptions.length]
    });
  }

  const similarPastCases = [];
  const numCases = 2 + Math.floor(seed * 3);
  for (let i = 0; i < numCases; i++) {
    similarPastCases.push({
      confidence: 0.48 + ((hash + i * 23) % 45) / 100,
      outcome: outcomes[(hash + i) % outcomes.length],
      timeframe: timeframes[(hash + i) % timeframes.length]
    });
  }

  similarPastCases.sort((a, b) => b.confidence - a.confidence);

  return {
    address,
    TFI,
    QSS,
    liquiditySafety,
    holderSymmetry,
    anomalyCount,
    riskWindows,
    similarPastCases
  };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Polymarket price history endpoint
  app.get("/api/polymarket/prices/:tokenId", async (req, res) => {
    try {
      const { tokenId } = req.params;
      const interval = (req.query.interval as string) || "max";
      
      const response = await fetch(
        `${POLYMARKET_CLOB_URL}/prices-history?market=${tokenId}&interval=${interval}&fidelity=60`
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Polymarket API response:", response.status, errorText);
        throw new Error(`Polymarket API error: ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error("Polymarket prices error:", error.message);
      res.status(500).json({ error: "Failed to fetch price history" });
    }
  });

  // Polymarket market lookup endpoint
  app.get("/api/polymarket/market/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      
      const response = await fetch(
        `${POLYMARKET_GAMMA_URL}/markets?slug=${slug}`
      );
      
      if (!response.ok) {
        throw new Error(`Polymarket API error: ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error("Polymarket market error:", error.message);
      res.status(500).json({ error: "Failed to fetch market data" });
    }
  });

  // Search Polymarket markets
  app.get("/api/polymarket/search", async (req, res) => {
    try {
      const query = req.query.q as string || "";
      const limit = parseInt(req.query.limit as string) || 20;
      
      const response = await fetch(
        `${POLYMARKET_GAMMA_URL}/markets?closed=false&limit=${limit}`
      );
      
      if (!response.ok) {
        throw new Error(`Polymarket API error: ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error("Polymarket search error:", error.message);
      res.status(500).json({ error: "Failed to search markets" });
    }
  });

  // Find Polymarket market by title search
  app.get("/api/polymarket/find", async (req, res) => {
    try {
      const search = (req.query.q as string || "").toLowerCase();
      
      const response = await fetch(
        `${POLYMARKET_CLOB_URL}/simplified-markets`
      );
      
      if (!response.ok) {
        throw new Error(`Polymarket API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.data && Array.isArray(data.data)) {
        const matches = data.data.filter((m: any) => 
          m.question?.toLowerCase().includes(search)
        ).slice(0, 5).map((m: any) => ({
          question: m.question,
          tokens: m.tokens,
          condition_id: m.condition_id,
        }));
        
        res.json({ matches });
      } else {
        res.json({ matches: [] });
      }
    } catch (error: any) {
      console.error("Polymarket find error:", error.message);
      res.status(500).json({ error: "Failed to find market" });
    }
  });

  // Find Polymarket market by slug (more reliable)
  app.get("/api/polymarket/slug/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      
      const response = await fetch(
        `${POLYMARKET_GAMMA_URL}/events?slug=${slug}`
      );
      
      if (!response.ok) {
        throw new Error(`Polymarket API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        const event = data[0];
        const markets = event.markets || [];
        
        const marketData = markets.map((m: any) => {
          let clobTokenIds = m.clobTokenIds;
          let outcomePrices = m.outcomePrices;
          
          // Parse stringified JSON if needed
          if (typeof clobTokenIds === 'string') {
            try { clobTokenIds = JSON.parse(clobTokenIds); } catch {}
          }
          if (typeof outcomePrices === 'string') {
            try { outcomePrices = JSON.parse(outcomePrices); } catch {}
          }
          
          return {
            question: m.question,
            outcome: m.outcome,
            outcomePrices,
            clobTokenIds,
            groupItemTitle: m.groupItemTitle,
          };
        });
        
        res.json({ 
          event: {
            title: event.title,
            slug: event.slug,
          },
          markets: marketData 
        });
      } else {
        res.json({ markets: [] });
      }
    } catch (error: any) {
      console.error("Polymarket slug error:", error.message);
      res.status(500).json({ error: "Failed to find market by slug" });
    }
  });

  app.post("/api/predict", async (req, res) => {
    try {
      const parsed = predictionRequestSchema.safeParse(req.body);
      
      if (!parsed.success) {
        return res.status(400).json({ 
          error: "Invalid address format",
          details: parsed.error.issues 
        });
      }

      const prediction = generateMockPrediction(parsed.data.address);
      
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
      
      res.json(prediction);
    } catch (error) {
      res.status(500).json({ error: "Prediction analysis failed" });
    }
  });

  return httpServer;
}
