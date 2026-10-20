export function rawGrams(cookedGrams: number, lossPct: number): number {
  return cookedGrams / (1 - lossPct)
}

export function itemCost(rawGramsAmount: number, pricePerKg: number): number {
  return (rawGramsAmount / 1000) * pricePerKg
}

export function monthlyCost(dailyCost: number): number {
  return dailyCost * 30
}

export const CHICKEN_BREAST_DEFAULT_LOSS_PCT = 0.4
