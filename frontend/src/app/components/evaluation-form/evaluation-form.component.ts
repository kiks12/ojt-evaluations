import { Component, inject, signal } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { ApiService } from '../../services/api.service';
import { StatementScoreService } from '../../services/statement-score.service';

@Component({
  selector: 'app-evaluation-form',
  imports: [FormsModule],
  templateUrl: './evaluation-form.component.html',
  styleUrl: './evaluation-form.component.css'
})
export class EvaluationFormComponent {
  private apiService = inject(ApiService)
  private statementScoreService = inject(StatementScoreService)
  fetchingFromAPI = signal(false)
  statement = signal("")

  submitForm() {
    console.log(this.statement())
    this.fetchingFromAPI.set(true);
    this.apiService.getStatementScore({statement: this.statement()}).subscribe(data => {
      console.log("STATEMENT SCORE:", data) 
      this.statementScoreService.statementScores.set(data)
      this.fetchingFromAPI.set(false);
    })
  }

  onStatementChange(e: Event) {
    const value = (e.target as HTMLTextAreaElement).value
    this.statement.set(value)
  }
}
