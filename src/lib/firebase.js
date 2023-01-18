import Firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import firebaseConfig from '~/config/firebaseConfig';
// import { seedDatabase } from '~/seed';


const firebase = Firebase.initializeApp(firebaseConfig);
const { FieldValue } = Firebase.firestore;

// seedDatabase(firebase)   //Khởi tạo dữ liệu gốc

export { firebase, FieldValue };