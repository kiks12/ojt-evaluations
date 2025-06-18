import { Injectable, signal } from '@angular/core';
import { addDoc, collection, getDocs } from "firebase/firestore"
import { firestore } from '../../../firebase/firebase';
import { FORMS } from '../../../firebase/collections';
import { Form } from '../types/form';

@Injectable({
  providedIn: 'root'
})
export class FormsService {
  showAddFormModal = signal(false)
  forms = signal<Form[]>([])

  constructor() { }

  toggleAddFormModal() {
    this.showAddFormModal.set(!this.showAddFormModal())
  }

  async createForm(form: Form) : Promise<{success: boolean, error?: unknown | undefined}> {
    try {
      const createdDocument = await addDoc(collection(firestore, FORMS), form)
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
      this.forms.set(querySnapshot.docs.map((doc) => doc.data() as Form));
    } catch (error) {
      console.error(error)    
      return
    }
  }
}
