import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StatementScores } from '../types/statementScore';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseURL = "http://localhost:8000"
  private http = inject(HttpClient)

  constructor() { }

  getStatementScore({statement}: {statement: string}) : Observable<StatementScores> {
    return this.http.post<StatementScores>(`${this.baseURL}/statement`, {text: statement})
  }
}
