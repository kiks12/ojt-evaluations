import { Injectable, signal } from '@angular/core';
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore"
import { firestore } from '../../../firebase/firebase';
import { CRITERIAS, FORMS, RESPONSES } from '../../../firebase/collections';
import {v4 as uuidv4} from 'uuid';
import { EvaluationCriterion, FormData, FormResponse, FormStructure } from '../types/form';

@Injectable({
  providedIn: 'root'
})
export class FormsService {
  showAddFormModal = signal(false)
  forms = signal<FormStructure[]>([])

  constructor() { }

  toggleAddFormModal() {
    this.showAddFormModal.set(!this.showAddFormModal())
  }

  async getForm(id: string) : Promise<FormStructure | undefined> {
    try {
      const document = await getDoc(doc(firestore, FORMS, id));
      const criteriaDocuments = await getDocs(collection(firestore, FORMS, id, CRITERIAS));
      const criteria = criteriaDocuments.docs.map((doc) => {
        const criterion = doc.data() as EvaluationCriterion;
        criterion.answer = criterion.answer || [];
        criterion.userAnswer = criterion.userAnswer || [];
        criterion.saved = true; // Criteria from database are saved
        return criterion;
      });
      const responsesDocuments = await getDocs(collection(firestore, FORMS, id, RESPONSES));
      const responses = responsesDocuments.docs.map((doc) => {
        const response = doc.data() as FormResponse;
        return response;
      });
      return {
        ...(document.data() as FormStructure),
        criteria: criteria,
        responses: responses
      }
    } catch (error) {
      return;
    }
  }

  async createForm(form: FormData) : Promise<{success: boolean, error?: unknown | undefined}> {
    try {
      const newUuid = uuidv4()
      const createdDocument = await  setDoc(doc(firestore, FORMS, newUuid), {
        id: newUuid,
        ...form
      });
      console.log(createdDocument)
      return { success: true }
    } catch (error) {
      console.error(error)
      return { success: false, error }
    }
  }

  async setCriteria(formUuid: string, criteria: EvaluationCriterion) : Promise<{success: boolean, error?: unknown | undefined}> {
    try {
      const result = await setDoc(doc(firestore, FORMS, formUuid, CRITERIAS, criteria.id), criteria);
      return { success: true }
    } catch (error) {
      return { success: false, error }
    }
  }

  async updateForm(form: FormStructure) : Promise<{success: boolean, error?: unknown | undefined}> {
    try {
      const { criteria, ...rest } = form
      const criteriaResults = await Promise.all(criteria.map(async (c) => await this.setCriteria(form.id!!, c)))
      const result = await setDoc(doc(firestore, FORMS, form.id!!), rest);
      if (criteriaResults.every((c) => c.success)) return { success: true };
      return { success: false, error: criteriaResults.map((c) => c.error)}
    } catch (error) {
      return { success: false, error }
    }
  }

  async deleteForm(id: string) : Promise<{success: boolean, error?: unknown | undefined}> {
    try {
      const deletedDocument = await deleteDoc(doc(firestore, FORMS, id));
      console.log(deletedDocument);
      return { success: true }
    } catch (error) {
      return { success: false, error }
    }
  }

  async deleteCriterion(formUuid: string, id: string) : Promise<{success: boolean, error?: unknown | undefined}> {
    try {
      const deletedDocument = await deleteDoc(doc(firestore, FORMS, formUuid, CRITERIAS, id));
      console.log(deletedDocument);
      return { success: true }
    } catch (error) {
      return { success: false, error }
    }
  }

  async getForms() {
    try {
      const querySnapshot = await getDocs(collection(firestore, FORMS))
      const forms = await Promise.all(querySnapshot.docs.map(async (doc) => {
        const data = doc.data() as FormStructure
        const criteriaDocuments = await getDocs(collection(firestore, FORMS, data.id!!, CRITERIAS));
        const criteria = criteriaDocuments.docs.map((doc) => {
          const criterion = doc.data() as EvaluationCriterion;
          criterion.userAnswer = criterion.userAnswer || [];
          criterion.saved = true; // Criteria from database are saved
          return criterion;
        });
        const responsesDocuments = await getDocs(collection(firestore, FORMS, data.id!!, RESPONSES));
        const responses = responsesDocuments.docs.map((doc) => {
          const response = doc.data() as FormResponse;
          return response;
        });
        return {
          ...data,
          criteria: criteria,
          responses: responses
        }
      }))
      this.forms.set(forms);
    } catch (error) {
      console.error(error)    
      return
    }
  }
}
