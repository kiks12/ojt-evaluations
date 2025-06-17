import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { EvaluationFormComponent } from "./components/evaluation-form/evaluation-form.component";
import { StatementScoreComponent } from "./components/statement-score/statement-score.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, EvaluationFormComponent, StatementScoreComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
