// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
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

  // Salva o usuário no localStorage SEMPRE que o estado 'user' mudar
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user'); // Remove se o usuário for null (logout)
    }
  }, [user]); // Este efeito roda quando 'user' muda

  const login = (userData) => {
    // userData DEVE conter { id, nome, email, tipo, cpf? | cnpj? }
    setUser(userData);
  };

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