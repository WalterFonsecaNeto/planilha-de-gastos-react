// services/usuario.js
import {
    db,
    auth,
    collection,
    getDocs,
    query,
    where,
    doc,
    setDoc,
    getDoc,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
  } from '../db/firebaseConfig';
  
  async function criarUsuarioAsync(email, senha, nome) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;
  
    await setDoc(doc(db, 'usuarios', user.uid), {
      nome,
      email,
      createdAt: new Date(),
      status: "bloqueado", 
      tipo: "cliente"     
    });
  
    return user;
  }
  
  async function logarUsuarioAsync(email, senha) {
    const credencialUsuario = await signInWithEmailAndPassword(auth, email, senha);
    return credencialUsuario.user;
  }
  
  async function buscarUsuariosAsync() {
    const snapshot = await getDocs(collection(db, 'usuarios'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
  
  async function buscarUsuarioPorEmailAsync(email) {
    const q = query(collection(db, 'usuarios'), where("email", "==", email));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
  
  async function buscarUsuarioPorUidAsync(uid) {
    const ref = doc(db, 'usuarios', uid);
    const docSnap = await getDoc(ref);
  
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  }

  async function listarOutrosUsuariosAsync(uidAtual) {
    const snapshot = await getDocs(collection(db, 'usuarios'));
    const todosUsuarios = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const outrosUsuarios = todosUsuarios.filter(usuario => usuario.id !== uidAtual);
    return outrosUsuarios;
  }

  async function editarUsuarioAsync(uid, dadosAtualizados) {
    const ref = doc(db, 'usuarios', uid);
    await setDoc(ref, dadosAtualizados, { merge: true });
  }
  
  
  
  const usuario = {
    criarUsuarioAsync,
    logarUsuarioAsync,
    buscarUsuariosAsync,
    buscarUsuarioPorEmailAsync,
    buscarUsuarioPorUidAsync,
    listarOutrosUsuariosAsync,
    editarUsuarioAsync,
  };
  
  export default usuario;
  