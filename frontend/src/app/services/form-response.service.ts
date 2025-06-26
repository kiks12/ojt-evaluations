import { Injectable } from '@angular/core';
import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '../../../firebase/firebase';
import { FORMS, RESPONSES } from '../../../firebase/collections';
import { FormResponse } from '../types/form';

@Injectable({
  providedIn: 'root'
})
export class FormResponseService {

  constructor() { }

  async createResponse(formUuid: string, response: FormResponse): Promise<{success: boolean, error?: unknown | undefined}> {
    try {
      const result = setDoc(doc(firestore, FORMS, formUuid, RESPONSES, response.id), response);
      console.log(result);
      return { success: true }
    } catch (error) {
      console.error(error);
      return {success:  false, error }
    }
  }
}
