const axios = require("axios");

const PROMPT = (
  summary
) => `You are a startup analyst. Given the project summary, output ONLY JSON with these keys:
segments[], icp[], competitors[{name,type}], pricingModels[], trendSignals[{statement,sourceQuery}],
tamNotes, goToMarket[], risks[], recommendedWeights{market,moat,monetization} in [0,1] summing≈1,
suggestedScores{market{tam,growth,pain,competition}, moat{differentiation,switchingCosts,defensibility,networkEffects}, monetization{ltvCac,pricingClarity,grossMargin,salesCycle}} each 0-10,
disclaimers[].
Assume competition and salesCycle use higher=harder (they will be inverted later).
Summary: ${summary}`;

function extractJson(text) {
  if (!text) return "{}";
  // remove common code fences
  let cleaned = String(text).replace(/```json|```/g, "").trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  return match ? match[0] : cleaned;
}

async function callOpenAI(prompt) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not set");
  const r = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    },
    { headers: { Authorization: `Bearer ${apiKey}` } }
  );
  return r.data.choices?.[0]?.message?.content || "{}";
}

async function callOllama(prompt) {
  const url = process.env.OLLAMA_URL || "http://127.0.0.1:11434";
  const model = process.env.OLLAMA_MODEL || "llama3.1";
  const r = await axios.post(`${url}/api/chat`, {
    model,
    stream: false,
    messages: [{ role: "user", content: prompt }],
    options: { temperature: 0.2 },
  });
  return r.data.message?.content || "{}";
}

async function callGemini(prompt) {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY not set");
  const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent?key=${encodeURIComponent(key)}`;

  const r = await axios.post(url, {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: { temperature: 0.2 },
  });

  // Collect text from candidates
  const candidates = r.data?.candidates || [];
  let text = "";
  for (const c of candidates) {
    const parts = c.content?.parts || [];
    for (const p of parts) {
      if (typeof p.text === "string") text += p.text + "\n";
    }
  }
  return text || "{}";
}

async function generateInsights(req, res, next) {
  try {
    const { summary } = req.body;
    if (!summary || summary.length < 10)
      return res.status(400).json({ error: "summary required" });

    let raw = "{}";
    const provider = (process.env.AI_PROVIDER || "auto").toLowerCase();
    if (provider === "gemini") {
      raw = await callGemini(PROMPT(summary));
    } else if (provider === "openai") {
      raw = await callOpenAI(PROMPT(summary));
    } else if (provider === "ollama") {
      raw = await callOllama(PROMPT(summary));
    } else {
      // auto priority
      if (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY)
        raw = await callGemini(PROMPT(summary));
      else if (process.env.OPENAI_API_KEY)
        raw = await callOpenAI(PROMPT(summary));
      else raw = await callOllama(PROMPT(summary));
    }

    let jsonText = extractJson(raw);
    let insights;
    try {
      insights = JSON.parse(jsonText);
    } catch (e) {
      try {
        jsonText = jsonText.replace(/\n/g, ' ').replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
        insights = JSON.parse(jsonText);
      } catch (e2) {
        return res.status(502).json({ error: 'AI response parse error', raw });
      }
    }

    // Normalize output keys/shape minimally
    if (insights && typeof insights === 'object') {
      if (Array.isArray(insights.icp) && !insights.ICP) {
        insights.ICP = insights.icp.join(', ');
      }
      // Flatten nested suggestedScores if present
      if (insights.suggestedScores && typeof insights.suggestedScores === 'object') {
        const s = insights.suggestedScores;
        const flat = {};
        if (s.market) {
          flat.tam = s.market.tam;
          flat.growth = s.market.growth;
          flat.pain = s.market.pain;
          flat.competition = s.market.competition;
        }
        if (s.moat) {
          flat.differentiation = s.moat.differentiation;
          flat.switchingCosts = s.moat.switchingCosts;
          flat.defensibility = s.moat.defensibility;
          flat.networkEffects = s.moat.networkEffects;
        }
        if (s.monetization) {
          flat.ltvCac = s.monetization.ltvCac;
          flat.pricingClarity = s.monetization.pricingClarity;
          flat.grossMargin = s.monetization.grossMargin;
          flat.salesCycle = s.monetization.salesCycle;
        }
        if (Object.keys(flat).length) insights.suggestedScores = flat;
      }
    }

    return res.json({ insights });
  } catch (e) {
    next(e);
  }
}

module.exports = { generateInsights };
