import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { map, tap, take, exhaustMap } from 'rxjs/Operators';
import { AuthService } from '../auth/auth.service';

@Injectable({providedIn: 'root'})

export class DataStorageService {
    constructor(
        private http: HttpClient,
        private recipeService: RecipeService,
        private authService: AuthService
    ) {}

    storeRecipes() {
        const recipes = this.recipeService.getRecipes();
        console.log(recipes);
        this.http.put('https://recipe-app-d6ad5.firebaseio.com/recipes.json', recipes).subscribe((response) => {
            console.log(response);
        });
    }

    fetchRecipes() {
        return this.http.get<Recipe[]>('https://recipe-app-d6ad5.firebaseio.com/recipes.json')
        .pipe(
            map((data) => {
                return data.map(item => {
                    return {...item, ingredients: item.ingredients ? item.ingredients : []}
                });
            }),
            tap(recipes => {
                this.recipeService.fetchRecipes(recipes);
            })
        )
    }
}