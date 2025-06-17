import { Component, computed, inject } from '@angular/core';
import { StatementScoreService } from '../../services/statement-score.service';

const STATEMENTS : {[key: string]: string}= {
  "NEG": "Negative",
  "POS": "Positive",
  "NEU": "Neutral"
}

@Component({
  selector: 'app-statement-score',
  imports: [],
  templateUrl: './statement-score.component.html',
  styleUrl: './statement-score.component.css'
})
export class StatementScoreComponent {
  statementScoreService = inject(StatementScoreService)
  statementScore = computed(() => {
    if (this.statementScoreService.statementScores().length === 0) return 0
    return (this.statementScoreService.statementScores()[0].score * 100).toFixed(2)
  })
  statementLabel = computed(() => {
    if (this.statementScoreService.statementScores().length === 0) return ""
    return STATEMENTS[this.statementScoreService.statementScores()[0].label]
  })
}
