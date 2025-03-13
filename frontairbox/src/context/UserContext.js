import React, { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto
const UserContext = createContext();

// Crear el proveedor de contexto
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        console.log('Datos del usuario al cargar desde localStorage:', JSON.parse(userData));
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error al parsear los datos del usuario:', error);
      setUser(null);
    }
  }, []);
  
  const login = (userData) => {
    const userWithToken = {
      id_user: userData.id_user,
      nombres_users: userData.nombres_users,
      apellidos_users: userData.apellidos_users,
      no_empleado_users: userData.no_empleado_users,
      rol: userData.rol,
      token: userData.token, // Incluye el token
    };
  
    console.log('Datos guardados en el contexto:', userWithToken); // Para verificar
  
    setUser(userWithToken); // Actualiza el estado del usuario
    localStorage.setItem('user', JSON.stringify(userWithToken)); // Guarda en localStorage
  };
  

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook para usar el contexto
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
