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

const entradasRef = collection(db, "entradas");

async function criarEntradaAsync(id, dadosEntrada) {
    await setDoc(doc(entradasRef, id), dadosEntrada);
}

async function listarEntradasPorUsuario(userId) {
    const q = query(entradasRef, where("userId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function buscarEntradaPorId(id) {
    const docSnap = await getDoc(doc(entradasRef, id));
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
}

async function atualizarEntradaAsync(id, dadosAtualizados) {
    await updateDoc(doc(entradasRef, id), dadosAtualizados);
}

async function deletarEntradaAsync(id) {
    await deleteDoc(doc(entradasRef, id));
}



const entrada = {
    criarEntradaAsync,
    listarEntradasPorUsuario,
    buscarEntradaPorId,
    atualizarEntradaAsync,
    deletarEntradaAsync,
};

export default entrada;
