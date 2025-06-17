import { Injectable, signal } from '@angular/core';
import {StatementScores} from "../types/statementScore"

@Injectable({
  providedIn: 'root'
})
export class StatementScoreService {
  statementScores = signal<StatementScores>([])
  constructor() { }
}
