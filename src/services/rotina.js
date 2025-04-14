import { db, collection, doc, setDoc, getDocs, query, where, getDoc, updateDoc, deleteDoc } from '../db/firebaseConfig';

const rotinasRef = collection(db, 'rotinas');

async function criarRotinaAsync(dadosRotina) {
  console.log(dadosRotina)
  const docRef = doc(rotinasRef);  
  await setDoc(docRef, dadosRotina);
  return docRef.id; // Retorna o ID gerado automaticamente, se necessário
}

async function listarRotinasPorUsuario(userId) {
  const q = query(rotinasRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function buscarRotinaPorId(id) {
  const docSnap = await getDoc(doc(rotinasRef, id));
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

async function atualizarRotinaAsync(id, dadosAtualizados) {
  await updateDoc(doc(rotinasRef, id), dadosAtualizados);
}

async function deletarRotinaAsync(id) {
  await deleteDoc(doc(rotinasRef, id));
}

const rotina = {
  criarRotinaAsync,
  listarRotinasPorUsuario,
  buscarRotinaPorId,
  atualizarRotinaAsync,
  deletarRotinaAsync,
};

export default rotina;
