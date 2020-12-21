import { AocDay } from '.';
import { readFile } from './utils';

export default class Day21 implements AocDay {
  private allergens = new Map<string, string[][]>();
  private ingredientLists: [string[], string[]][] = [];

  private parseInput(input: string) {
    for (const line of input.split('\n')) {
      const startAllergenList = line.indexOf('(');
      const ingredients = line.slice(0, startAllergenList - 1).split(' ');
      const allergens = line.slice(startAllergenList + 10, line.length - 1).split(', ');

      this.ingredientLists.push([ingredients, allergens]);
      
      for (const allergen of allergens) {
        if (!this.allergens.has(allergen)) {
          this.allergens.set(allergen, []);
        }
        this.allergens.get(allergen)?.push(ingredients);
      }
    }
  }

  async run() {
    const input = await readFile('input/day21.input');

    this.parseInput(input);
    
    // Part 1
    const intersect = (array1: string[], array2: string[]): string[] => (
      array1.filter(value => array2.includes(value))
    );

    const difference = (array1: string[], array2: string[]): string[] => (
      array1.filter(value => !array2.includes(value))
    );

    const allergenToContainingIngredients = new Map<string, string[]>();
    for (const [allergen, ingredients] of this.allergens) {
      let containingIngredients = ingredients[0];
      for (let i = 1; i < ingredients.length; i++) {
        containingIngredients = intersect(containingIngredients, ingredients[i]);
      }
      allergenToContainingIngredients.set(allergen, containingIngredients);
    }

    const ingredientsSet = new Set<string>(
      this.ingredientLists
        .map(([ingredients, _]) => ingredients)
        .reduce((acc, ingredients) => [...acc, ...ingredients], [])
    );
    const containedIngredients = new Set<string>(
      [...allergenToContainingIngredients.values()]
        .reduce((acc, ingredients) => [...acc, ...ingredients], [])
    );
    const notContainedIngredients = difference([...ingredientsSet], [...containedIngredients]);

    let count = 0;
    for (const [ingredients, ] of this.ingredientLists) {
      count += 
        ingredients
          .filter(ingredient => notContainedIngredients.includes(ingredient))
          .length;
    }
    console.log(count);

    // Part 2
    const allergenToIngredient = new Map<string, string>();

    for (let i = 0; i < allergenToContainingIngredients.size; i++) {
      const handledIngredients = new Set<string>();
      for (const [allergen, ingredients] of allergenToContainingIngredients) {
        if (ingredients.length === 1) {
          allergenToIngredient.set(allergen, ingredients[0]);
          allergenToContainingIngredients.set(allergen, []);
          handledIngredients.add(ingredients[0]);
        }
      }
      for (const [allergen, ingredients] of allergenToContainingIngredients) {
        for (const ingredient of ingredients) {
          if (handledIngredients.has(ingredient)) {
            allergenToContainingIngredients.set(allergen, ingredients.filter(ingr => ingr !== ingredient));
          }
        }
      }
    }

    console.log(
      [...allergenToIngredient.keys()]
        .sort()
        .map(allergen => allergenToIngredient.get(allergen))
        .join(',')
    );
  }
}
