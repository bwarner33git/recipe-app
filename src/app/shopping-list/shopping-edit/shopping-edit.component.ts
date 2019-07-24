import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild
} from '@angular/core';

import { NgForm } from '@angular/forms';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;
  startedEditingSub: Subscription;
  ingredient: Ingredient;
  @ViewChild('form', { static: false} ) slForm: NgForm;

  constructor(private slService: ShoppingListService) { }

  ngOnInit() {
    this.startedEditingSub = this.slService.startedEditing.subscribe((index: number) => {
      this.editMode = true;
      this.editedItemIndex = index;
      this.editedItem = this.slService.getIngredient(index);
      this.slForm.setValue({
        name: this.editedItem.name,
        unit: this.editedItem.unit,
        amount: this.editedItem.amount
      })
    });
  }

  ngOnDestroy() {
    this.startedEditingSub.unsubscribe();
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.unit, value.amount);
    if(this.editMode) {
      this.slService.editIngredient(this.editedItemIndex, newIngredient);

    } else {
      this.slService.addIngredient(newIngredient);
    }
    form.reset();
    this.editMode = false;
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
  }

  onDelete() {
    this.slService.deleteIngredient(this.editedItemIndex);
    this.onClear();
  }

}
