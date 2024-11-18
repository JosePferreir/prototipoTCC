import React, { useEffect, useState } from 'react';
import './Profile.css';
import ModalInfo from '../../utils/ModalInfo';
import { User } from '../../model/User';
import { Insignia } from '../../model/Insignia';
import { Badge, BadgeProps, styled } from '@mui/material';

const StyledBadge = styled(Badge)<BadgeProps>(() => ({
  '& .MuiBadge-badge': {
    right: 45,
    top: 5,
    padding: '0 6.33px',
    borderRadius: '100px',
    height: '30px',
    fontSize: '24px',
    backgroundColor: `#C7EFCA`,
    color: 'black',
    border: `2px solid #70997E`,
  },
}));

function Profile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = sessionStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) as User : null;
  });
  const [insignias, setInsignias] = useState<Insignia[]>([]);

  // Carregar usuário do sessionStorage
  useEffect(() => {
    const fetchData = async () => {
      
      // Carrega as insígnias
      const insigniasResponse = await fetch('http://localhost:3000/insignias');
      const userInsigniasResponse = await fetch(`http://localhost:3000/user_insignias?usuarioId=${user.id}`);
      const insigniasData = await insigniasResponse.json();
      const userInsigniasData = await userInsigniasResponse.json();
      

      const userInsigniaIds = userInsigniasData.map((userInsignia: { insigniaId: number | string }) => Number(userInsignia.insigniaId));
      const userInsignias = insigniasData.filter((insignia: Insignia) => userInsigniaIds.includes(Number(insignia.id)));

      await setInsignias(userInsignias);
      console.log("userInsignias",userInsignias);
      console.log(insignias);
    };

    fetchData();
  }, []);

  const handleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  if (!user) {
    return <p>Carregando informações do perfil...</p>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-iconWrapper">
          <i className='profileIcon'></i>
        </div>
        {user.name}
      </div>
      <div className="profile-content">
        <div className='profile-main-content'>
          <div className="profile-items-wrapper">
            <div className="profile-item">
              <i className='profile-bookIcon'></i>
              <div className='profile-item-text'>
                <div className='text-default'>
                  {user.totalBooksRead}<br />
                  Livros lidos
                </div>
                <span className="text-hover">
                  Lendo {user.totalBooksRead} livros você recebeu {user.totalBooksRead*200} pontos
                </span>
              </div>
            </div>
            <div className="profile-item">
              <i className='profile-openBookIcon'></i>
              <div className='profile-item-text'>
                <div className="text-default">
                  {user.pagesRead}<br />
                  Páginas lidas
                </div>
                <div className="text-hover">
                  Lendo {user.pagesRead} páginas você recebeu {user.pagesRead*5} pontos
                </div>
              </div>
            </div>
            <div className="profile-item">
              <i className='profile-pointsIcon'></i>
              <div className='profile-item-text'>
                {user.pontos}<br />
                Total de pontos
              </div>
            </div>
            <div className="profile-item">
              <i className='profile-fireIcon'></i>
              <div className='profile-item-text'>
                <div className="text-default">
                  {user.sequenciaMaxima}<br />
                  Máximo<br />
                  Dias seguidos
                </div>
                <div className="text-hover">
                  Lendo {user.sequenciaMaxima} dias seguidos você recebeu {user.sequenciaMaxima*50} pontos
                </div>
              </div>
            </div>
          </div>
          <div className="levelWrapper">
            <div className="profile-level">
              <div className='level-and-help'>
                Nível
                <i onClick={handleModal} className='profile-questionIcon'></i>
              </div>
              <div className="circle-level">
                {user.nivel}
              </div>
            </div>
            <div className="points">
              {user.pontos % 1000}/1000
              <div className="profile-level-bar-wrapper">
                <div className="profile-level-bar" style={{ width: `${(user.pontos % 1000) / 10}%` }}></div>
              </div>
            </div>
          </div>
        </div>
        <div className="emblems-section">
          <div className='profile-emblems-text'>
            Insígnias <i onClick={handleModal} className='profile-questionIcon'></i>
          </div>
          <div className="profile-emblems">
            {insignias.map((emblem, index) => (
              <div key={index} className="emblem-item">
                {emblem.numeroRepresentativo > 0 ? (
                  <StyledBadge badgeContent={emblem.numeroRepresentativo} color="primary">
                    <i className={`profile-isignia-${emblem.icon}`}></i>
                  </StyledBadge>
                ) : (
                  <i className={`profile-isignia-${emblem.icon}`}></i>
                )}
                <span className="emblem-tooltip">{emblem.titulo}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <section>
        <ModalInfo isModalOpen={isModalOpen} onClose={handleModal} />
      </section>
    </div>
  );
}

export default Profile;