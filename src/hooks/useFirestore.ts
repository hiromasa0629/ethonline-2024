import { db } from "../../firebaseConfig";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
  query,
  where,
  getDocs,
  DocumentData,
} from "firebase/firestore";

// type FirestoreHook = {
//   addDocument: (collectionPath: string, data: DocumentData, ) => Promise<string>;
//   modifyDocument: (collectionPath: string, docId: string, data: DocumentData) => Promise<void>;
//   findDocument: (collectionPath: string, docId: string) => Promise<DocumentData | undefined>;
//   findAllDocumentsWhere: (
//     collectionPath: string,
//     field: string,
//     value: any
//   ) => Promise<DocumentData[]>;
// };

export function useFirestore() {
  /**
   * Adds a new document to a Firestore collection, or overwrites an existing document. If docId is provided,
   * Firestore will either create a new document with docId as its uuid, or overwrites any existing document
   * with the docId
   * @param collectionPath The path of the collection where the document will be added.
   * @param data The data to be added to the collection.
   * @param docId Optional. The ID of the document to update. If not provided, a new document will be created.
   * @returns The ID of the newly created or updated document, and its data
   */
  const addDocument = async (
    collectionPath: string,
    data: DocumentData,
    docId?: string
  ): Promise<{ docId: string; data: any }> => {
    console.log("calling");
    const collectionRef = collection(db, collectionPath);
    if (docId) {
      const docRef = doc(collectionRef, docId);
      await setDoc(docRef, data);
      return { docId, data };
    } else {
      const docRef = await addDoc(collectionRef, data);
      return { docId: docRef.id, data };
    }
  };

  /**
   * Modifies an existing document in a Firestore collection.
   * @param collectionPath The path of the collection containing the document.
   * @param docId The ID of the document to modify.
   * @param data The new data for the document. Existing fields not included in 'data' will remain unchanged.
   * @returns A promise that resolves with void when the operation is complete.
   */
  const modifyDocument = async (
    collectionPath: string,
    docId: string,
    data: DocumentData
  ): Promise<void> => {
    const docRef = doc(db, collectionPath, docId);
    await setDoc(docRef, data, { merge: true });
  };

  /**
   * Retrieves a single document from a Firestore collection.
   * @param collectionPath The path of the collection.
   * @param docId The ID of the document to retrieve.
   * @returns A promise that resolves to the document data if found, otherwise undefined.
   */
  const findDocument = async (
    collectionPath: string,
    docId: string
  ): Promise<DocumentData | undefined> => {
    const docRef = doc(db, collectionPath, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such document!");
      return undefined;
    }
  };

  /**
   * Finds all documents in a Firestore collection where a specific field matches a given value.
   * @param collectionPath The path of the collection to search.
   * @param field The field to query against.
   * @param value The value to match.
   * @returns A promise that resolves to an array of documents that match the criteria.
   */
  const findAllDocumentsWhere = async (
    collectionPath: string,
    field: string,
    value: any
  ): Promise<DocumentData[]> => {
    const collectionRef = collection(db, collectionPath);
    const q = query(collectionRef, where(field, "==", value));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
  };

  return {
    addDocument,
    modifyDocument,
    findDocument,
    findAllDocumentsWhere,
  };
}
