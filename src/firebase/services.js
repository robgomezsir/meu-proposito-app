import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  deleteDoc, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './config-simple';

// Referência para a coleção de usuários
const usuariosCollection = collection(db, 'usuarios');

// Adicionar novo usuário
export const adicionarUsuario = async (usuario) => {
  try {
    console.log('📝 Iniciando adição de usuário no Firebase...');
    console.log('📊 Dados do usuário:', JSON.stringify(usuario, null, 2));
    
    // Verificar se há arrays aninhados
    const verificarArraysAninhados = (obj, path = '') => {
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key;
        if (Array.isArray(value)) {
          console.log(`🔍 Array encontrado em: ${currentPath}`, value);
          // Verificar se é array de arrays
          if (value.some(item => Array.isArray(item))) {
            console.warn(`⚠️ ARRAY ANINHADO DETECTADO em: ${currentPath}`, value);
          }
        } else if (value && typeof value === 'object') {
          verificarArraysAninhados(value, currentPath);
        }
      }
    };
    
    verificarArraysAninhados(usuario);
    
    const docRef = await addDoc(usuariosCollection, {
      ...usuario,
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString()
    });
    
    console.log('✅ Usuário adicionado com sucesso! ID:', docRef.id);
    return { id: docRef.id, ...usuario };
  } catch (error) {
    console.error('❌ Erro ao adicionar usuário:', error);
    console.error('🔍 Detalhes do erro:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    throw error;
  }
};

// Buscar todos os usuários
export const buscarUsuarios = async () => {
  try {
    const q = query(usuariosCollection, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    const usuarios = [];
    
    querySnapshot.forEach((doc) => {
      usuarios.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return usuarios;
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw error;
  }
};

// Deletar usuário específico
export const deletarUsuario = async (id) => {
  try {
    await deleteDoc(doc(db, 'usuarios', id));
    return true;
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    throw error;
  }
};

// Deletar todos os usuários
export const deletarTodosUsuarios = async () => {
  try {
    const querySnapshot = await getDocs(usuariosCollection);
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    return true;
  } catch (error) {
    console.error('Erro ao deletar todos os usuários:', error);
    throw error;
  }
};

// Verificar se CPF já existe
export const verificarCPFExistente = async (cpf) => {
  try {
    const querySnapshot = await getDocs(usuariosCollection);
    const existe = querySnapshot.docs.some(doc => doc.data().cpf === cpf);
    return existe;
  } catch (error) {
    console.error('Erro ao verificar CPF:', error);
    throw error;
  }
};
