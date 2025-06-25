import { Routes } from '@angular/router';
import { FormsComponent } from './components/forms/forms.component';
import { EvaluationFormComponent } from './components/evaluation-form/evaluation-form.component';
import { EditFormComponent } from './components/forms/edit-form/edit-form.component';
import { FormFillComponent } from './components/form-fill/form-fill.component';
import { FormPreviewComponent } from './components/form-preview/form-preview.component';

export const routes: Routes = [
  {
    path: "",
    component: FormsComponent,
  },
  {
    path: "dashboard",
    component: EvaluationFormComponent
  },
  {
    path: "forms/:id/edit",
    component: EditFormComponent
  },
  {
    path: "forms/:id/preview",
    component: FormPreviewComponent
  },
  {
    path: "forms/:id/fill",
    component: FormFillComponent
  },
  {
    path: "forms/:id",
    redirectTo: "forms/:id/edit",
    pathMatch: "full"
  }
];
