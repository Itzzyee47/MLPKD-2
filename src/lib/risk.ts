import type { PredictionInput } from "./types";

export function computeRisk(input: PredictionInput) {
  let score = 0;
  if (input.bp >= 140) score += 8;
  if (input.al >= 2) score += 12;
  if (input.sc >= 1.8) score += 15;
  if (input.bu >= 40) score += 10;
  if (input.hemo < 10) score += 12;
  if (input.dm === "yes") score += 8;
  if (input.htn === "yes") score += 8;
  if (input.pe === "yes") score += 8;
  if (input.ane === "yes") score += 8;
  if (input.cad === "yes") score += 6;
  if (input.rbc === "abnormal") score += 5;

  const risk = Math.min(100, Math.max(0, score));
  const diagnosis = risk >= 50 ? "CKD" : "Not CKD";
  const recommendation =
    diagnosis === "CKD"
      ? "High CKD risk. Recommend nephrology referral, repeat labs, and risk factor control."
      : "Lower CKD risk. Continue routine monitoring and prevention counseling.";

  return { risk, diagnosis, recommendation };
}
