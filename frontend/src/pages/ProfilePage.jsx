import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Importe 'Link'
import { useAuth } from '../context/AuthContext.jsx'; // Certifique-se que o .jsx está correto

function ProfilePage() {
  const { user } = useAuth(); // Obtém o objeto 'user' do contexto de autenticação
  const navigate = useNavigate(); // Hook para navegação programática

  useEffect(() => {
    // Se não houver usuário logado, redireciona para a página de login de hóspede.
    // Opcionalmente, você pode redirecionar para uma página de login genérica.
    if (!user) {
      alert('Você precisa estar logado para acessar seu perfil.');
      navigate('/login-hospede'); 
      return; // Importante para parar a execução do useEffect
    }

    // Se o usuário está logado, determina qual página de edição deve ser carregada
    // e redireciona para ela, passando o ID do usuário.
    if (user.tipo === 'hospede' && user.id) {
      navigate(`/editar-hospede/${user.id}`);
    } else if (user.tipo === 'hotel' && user.id) {
      navigate(`/editar-hotel/${user.id}`);
    } else {
      // Caso o 'user.tipo' ou 'user.id' não estejam definidos corretamente no contexto.
      alert('Informações de usuário incompletas. Por favor, faça login novamente.');
      navigate('/'); // Redireciona para a página inicial
    }
  }, [user, navigate]); // Este efeito será re-executado se 'user' ou 'navigate' mudarem.

  // Componente renderiza uma mensagem de carregamento/redirecionamento enquanto o useEffect trabalha.
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <p>Carregando seu perfil para edição...</p>
      <p>Se esta mensagem persistir, verifique seu login e se você possui um ID válido.</p>
    </div>
  );
}

export default ProfilePage;