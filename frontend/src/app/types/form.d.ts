import { Time } from "@angular/common";
import { Timestamp } from "firebase/firestore";

export interface FormData {
  id?: string;
  title: string;
  description: string;
  status?: 'active' | 'draft' | 'archived';
  criteria?: any[];
  responses?: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  criteria: EvaluationCriterion[];
}

export interface EvaluationCriterion {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'rating' | 'checkbox' | 'radio' | 'select';
  required: boolean;
  options?: string[];
}

export interface FormStructure extends FormData {
  criteria: EvaluationCriterion[];
}
