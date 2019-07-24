import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-start',
  templateUrl: './recipe-start.component.html',
  styleUrls: ['./recipe-start.component.css']
})
export class RecipeStartComponent implements OnInit {

  recipeCnt: number;
  constructor(private recipeService: RecipeService) { }

  ngOnInit() {
    this.recipeCnt = this.recipeService.getRecipes().length;
  }

}
