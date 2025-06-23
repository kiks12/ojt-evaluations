import { Injectable, signal } from '@angular/core';
import { addDoc, collection, doc, getDocs, setDoc } from "firebase/firestore"
import { firestore } from '../../../firebase/firebase';
import { FORMS } from '../../../firebase/collections';
import { Form } from '../types/form';
import { FormData } from '../components/forms/components/form-card/form-card.component';
import {v4 as uuidv4} from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class FormsService {
  showAddFormModal = signal(false)
  forms = signal<FormData[]>([])

  constructor() { }

  toggleAddFormModal() {
    this.showAddFormModal.set(!this.showAddFormModal())
  }

  async createForm(form: Form) : Promise<{success: boolean, error?: unknown | undefined}> {
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

  async getForms() {
    try {
      const querySnapshot = await getDocs(collection(firestore, FORMS))
      console.log(querySnapshot.docs.map((doc) => doc.data() as Form));
      this.forms.set(querySnapshot.docs.map((doc) => {
        const data = doc.data() as Form
        return {
          ...data,
          createdAt: data.createdAt.toDate()
        } as FormData
      }));
    } catch (error) {
      console.error(error)    
      return
    }
  }
}
