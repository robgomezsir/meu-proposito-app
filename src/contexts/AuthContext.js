import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authorizedEmails, setAuthorizedEmails] = useState([]);

  // Email do administrador principal
  const ADMIN_EMAIL = 'robgomez.sir@gmail.com';

  // Carregar emails autorizados do localStorage
  useEffect(() => {
    const savedEmails = localStorage.getItem('authorizedEmails');
    if (savedEmails) {
      setAuthorizedEmails(JSON.parse(savedEmails));
    } else {
      // Emails padrão autorizados
      const defaultEmails = [
        'robgomez.sir@gmail.com',
        'example@atento.com'
      ];
      setAuthorizedEmails(defaultEmails);
      localStorage.setItem('authorizedEmails', JSON.stringify(defaultEmails));
    }
  }, []);

  // Verificar autenticação baseada no email
  const checkAuth = (email) => {
    if (!email) {
      setIsAdmin(false);
      setIsAuthorized(false);
      setCurrentUser(null);
      return;
    }

    const isAdminUser = email === ADMIN_EMAIL;
    const isAuthorizedUser = authorizedEmails.includes(email);

    setIsAdmin(isAdminUser);
    setIsAuthorized(isAuthorizedUser);
    setCurrentUser({ email, isAdmin: isAdminUser, isAuthorized: isAuthorizedUser });

    // Salvar no localStorage
    localStorage.setItem('currentUser', JSON.stringify({ email, isAdmin: isAdminUser, isAuthorized: isAuthorizedUser }));
  };

  // Adicionar novo email autorizado (apenas admin)
  const addAuthorizedEmail = (email) => {
    if (!isAdmin) {
      throw new Error('Apenas administradores podem adicionar novos usuários');
    }

    if (!authorizedEmails.includes(email)) {
      const newEmails = [...authorizedEmails, email];
      setAuthorizedEmails(newEmails);
      localStorage.setItem('authorizedEmails', JSON.stringify(newEmails));
      return true;
    }
    return false;
  };

  // Remover email autorizado (apenas admin)
  const removeAuthorizedEmail = (email) => {
    if (!isAdmin) {
      throw new Error('Apenas administradores podem remover usuários');
    }

    if (email === ADMIN_EMAIL) {
      throw new Error('Não é possível remover o administrador principal');
    }

    const newEmails = authorizedEmails.filter(e => e !== email);
    setAuthorizedEmails(newEmails);
    localStorage.setItem('authorizedEmails', JSON.stringify(newEmails));
    return true;
  };

  // Fazer logout
  const logout = () => {
    console.log('🔐 AuthContext: Iniciando logout...');
    
    // Limpar estados locais
    setIsAdmin(false);
    setIsAuthorized(false);
    setCurrentUser(null);
    
    // Limpar localStorage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authorizedEmails');
    localStorage.removeItem('rhAuthenticated');
    
    console.log('🔐 AuthContext: Logout concluído');
  };

  // Verificar se o usuário atual tem permissão para acessar o dashboard
  const canAccessDashboard = () => {
    return isAdmin || isAuthorized;
  };

  const value = {
    isAdmin,
    isAuthorized,
    currentUser,
    authorizedEmails,
    checkAuth,
    addAuthorizedEmail,
    removeAuthorizedEmail,
    logout,
    canAccessDashboard,
    ADMIN_EMAIL
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
