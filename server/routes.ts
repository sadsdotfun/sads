import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { predictionRequestSchema, type PredictionResponse } from "@shared/schema";

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
