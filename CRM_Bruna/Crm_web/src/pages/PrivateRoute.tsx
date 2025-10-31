import React from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: Props) => {
  try {
    const usuarioRaw = localStorage.getItem('usuario');
    if (!usuarioRaw) return <Navigate to="/login" replace />;

    const usuario = JSON.parse(usuarioRaw);
    if (!usuario?.tokem || !usuario?.nome) return <Navigate to="/login" replace />;

    return <>{children}</>;
  } catch {
    return <Navigate to="/login" replace />;
  }
};

export default PrivateRoute;