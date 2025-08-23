// Configurações do Firebase para diferentes ambientes
// Este arquivo permite configurar diferentes projetos para dev, staging e produção

const environments = {
  development: {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY_DEV || "dev-api-key",
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN_DEV || "dev-projeto.firebaseapp.com",
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID_DEV || "dev-projeto-id",
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET_DEV || "dev-projeto.appspot.com",
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID_DEV || "dev-sender-id",
    appId: process.env.REACT_APP_FIREBASE_APP_ID_DEV || "dev-app-id"
  },
  staging: {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY_STAGING || "staging-api-key",
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN_STAGING || "staging-projeto.firebaseapp.com",
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID_STAGING || "staging-projeto-id",
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET_STAGING || "staging-projeto.appspot.com",
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID_STAGING || "staging-sender-id",
    appId: process.env.REACT_APP_FIREBASE_APP_ID_STAGING || "staging-app-id"
  },
  production: {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY_PROD || "prod-api-key",
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN_PROD || "prod-projeto.firebaseapp.com",
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID_PROD || "prod-projeto-id",
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET_PROD || "prod-projeto.appspot.com",
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID_PROD || "prod-sender-id",
    appId: process.env.REACT_APP_FIREBASE_APP_ID_PROD || "prod-app-id"
  }
};

// Determinar o ambiente atual
const getCurrentEnvironment = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'production';
  } else if (process.env.REACT_APP_ENV === 'staging') {
    return 'staging';
  } else {
    return 'development';
  }
};

// Obter configuração para o ambiente atual
export const getFirebaseConfig = () => {
  const env = getCurrentEnvironment();
  console.log(`🔥 Firebase configurado para ambiente: ${env}`);
  return environments[env];
};

// Configuração padrão (fallback)
export const defaultConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "sua-api-key-aqui",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "seu-projeto.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "seu-projeto-id",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "seu-projeto.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "seu-messaging-sender-id",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "seu-app-id"
};
