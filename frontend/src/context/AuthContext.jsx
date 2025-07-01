import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Estado para armazenar informações do usuário logado
  // user: { id, nome, email, tipo: 'hospede' | 'hotel', cpf? | cnpj? } ou null
  const [user, setUser] = useState(() => {
    // Tenta carregar o usuário do localStorage ao iniciar
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      return null;
    }
  });

  // Salva o usuário no localStorage sempre que o estado 'user' mudar
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Função de login
  const login = (userData) => {
    // userData deve conter { id, nome, email, tipo, cpf ou cnpj }
    setUser(userData);
  };

  // Função de logout
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};