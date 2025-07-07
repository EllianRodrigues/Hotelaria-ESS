import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; 

function ProfilePage() {
  const { user } = useAuth(); 
  const navigate = useNavigate(); 

  useEffect(() => {
    if (!user) {
      alert('Você precisa estar logado para acessar seu perfil.');
      navigate('/login-hospede'); 
      return; 
    }

    if (user.tipo === 'hospede' && user.id) {
      navigate(`/editar-hospede/${user.id}`);
    } else if (user.tipo === 'hotel' && user.id) {
      navigate(`/editar-hotel/${user.id}`);
    } else {
      
      alert('Informações de usuário incompletas. Por favor, faça login novamente.');
      navigate('/'); 
    }
  }, [user, navigate]); 

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <p>Carregando seu perfil para edição...</p>
      <p>Se esta mensagem persistir, verifique seu login e se você possui um ID válido.</p>
    </div>
  );
}

export default ProfilePage;