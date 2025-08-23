// Arquivo de teste para verificar a conexão com o Firebase
import { db } from './config-simple';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';

// Função para testar a conexão
export const testarConexaoFirebase = async () => {
  try {
    console.log('🔥 Testando conexão com Firebase...');
    
    // Testar adição de documento
    const testCollection = collection(db, 'teste-conexao');
    const testDoc = {
      mensagem: 'Teste de conexão Firebase',
      timestamp: serverTimestamp(),
      teste: true,
      data: new Date().toISOString()
    };
    
    console.log('📝 Tentando adicionar documento de teste...');
    const docRef = await addDoc(testCollection, testDoc);
    console.log('✅ Documento adicionado com sucesso! ID:', docRef.id);
    
    // Testar leitura de documentos
    console.log('📖 Tentando ler documentos de teste...');
    const querySnapshot = await getDocs(testCollection);
    const documentos = [];
    querySnapshot.forEach((doc) => {
      documentos.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log('✅ Documentos lidos com sucesso!', documentos);
    
    return {
      sucesso: true,
      documentoId: docRef.id,
      documentos: documentos
    };
    
  } catch (error) {
    console.error('❌ Erro ao testar conexão Firebase:', error);
    return {
      sucesso: false,
      erro: error.message
    };
  }
};

// Função para limpar dados de teste
export const limparDadosTeste = async () => {
  try {
    console.log('🧹 Limpando dados de teste...');
    const testCollection = collection(db, 'teste-conexao');
    const querySnapshot = await getDocs(testCollection);
    
    // Por enquanto, apenas logamos os documentos
    // Para deletar, precisaríamos implementar a função de delete
    console.log('📋 Documentos de teste encontrados:', querySnapshot.size);
    
    return {
      sucesso: true,
      documentosEncontrados: querySnapshot.size
    };
    
  } catch (error) {
    console.error('❌ Erro ao limpar dados de teste:', error);
    return {
      sucesso: false,
      erro: error.message
    };
  }
};
