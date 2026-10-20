import type { Plan } from './schema'

// Placeholder numbers — not the real vet plan yet. Structure (categories,
// item ids, protein fractions summing to 1.0) follows IMPLEMENTATION_PLAN.md
// section 5. Swap these targetGrams/items for the real plan when available;
// the schema and core logic don't need to change.
export const SEED_PLAN: Plan = {
  version: 1,
  validFrom: '2026-09-21',
  validTo: '2026-11-21',
  vetName: 'TBD',
  categories: {
    carb: {
      items: [
        { id: 'sweet-potato', label: 'Batata doce', targetGrams: 180 },
        { id: 'rice', label: 'Arroz', targetGrams: 150 },
      ],
    },
    protein: {
      items: [
        { id: 'chicken-breast', label: 'Peito de frango', targetGrams: 200, fraction: 0.6 },
        { id: 'beef', label: 'Carne bovina', targetGrams: 150, fraction: 0.4 },
      ],
    },
    vegetables: {
      targetGrams: 350,
      minTypes: 2,
      maxTypes: 3,
      items: [
        { id: 'carrot', label: 'Cenoura', targetGrams: 120 },
        { id: 'zucchini', label: 'Abobrinha', targetGrams: 120 },
        { id: 'pumpkin', label: 'Abóbora', targetGrams: 110 },
      ],
    },
    lard: {
      targetGrams: 20,
    },
    foodDog: {
      fullDoseGrams: 10,
    },
    treats: {
      limitGrams: 15,
    },
    forbiddenFoods: ['chocolate', 'uva', 'cebola', 'alho', 'abacate', 'xilitol'],
  },
}
