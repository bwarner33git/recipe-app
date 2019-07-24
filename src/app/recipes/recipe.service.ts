import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subscription, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  updateRecipes = new Subject<Recipe[]>();

  recipes: Recipe[] = [
   
  ]

  constructor(private slService: ShoppingListService) { }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(id: number) {
    return this.recipes[id];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.updateRecipes.next(this.recipes.slice());

  }

  updateRecipe(recipe: Recipe, index: number) {
    this.recipes[index] = recipe;
    this.updateRecipes.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.updateRecipes.next(this.recipes.slice());
  }

  fetchRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.updateRecipes.next(this.recipes.slice());
  }

}
