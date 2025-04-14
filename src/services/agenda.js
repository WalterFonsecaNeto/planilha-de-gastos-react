import {
    db,
    collection,
    doc,
    setDoc,
    getDocs,
    getDoc,
    deleteDoc,
    updateDoc,
    query,
    where
  } from "../db/firebaseConfig";
  
  const agendasRef = collection(db, "agendas");
  
  async function criarAgendaAsync(id, dadosAgenda) {
    await setDoc(doc(agendasRef, id), dadosAgenda);
  }
  
  async function listarAgendasPorUsuario(userId) {
    const q = query(agendasRef, where("userId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
  
  async function buscarAgendaPorId(id) {
    const docSnap = await getDoc(doc(agendasRef, id));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  }
  
  async function atualizarAgendaAsync(id, dadosAtualizados) {
    await updateDoc(doc(agendasRef, id), dadosAtualizados);
  }
  
  async function deletarAgendaAsync(id) {
    await deleteDoc(doc(agendasRef, id));
  }
  
  const agenda = {
    criarAgendaAsync,
    listarAgendasPorUsuario,
    buscarAgendaPorId,
    atualizarAgendaAsync,
    deletarAgendaAsync,
  };
  
  export default agenda;
  