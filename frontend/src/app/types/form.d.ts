import { Timestamp } from "firebase/firestore";

export interface Form {
  title: string;
  description: string;
  createdAt: Timestamp;
}