import { Routes } from '@angular/router';
import { FormsComponent } from './components/forms/forms.component';
import { EvaluationFormComponent } from './components/evaluation-form/evaluation-form.component';

export const routes: Routes = [
  {
    path: "",
    component: FormsComponent,
  },
  {
    path: "dashboard",
    component: EvaluationFormComponent
  }
];
