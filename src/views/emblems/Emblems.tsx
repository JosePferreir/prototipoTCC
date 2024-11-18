import React, {useEffect, useState} from 'react';
import './Emblems.css';
import { Badge, BadgeProps, styled } from '@mui/material';
import ModalInfo from '../../utils/ModalInfo';
import { Insignia } from '../../model/Insignia';
import { User } from '../../model/User';

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

function Emblems() {

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [insignias, setInsignias] = useState<Insignia[]>([]);
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = sessionStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) as User : null;
  });


  const handleModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  useEffect(() => {
    const fetchData = async () => {
      // Carrega as insígnias
      const insigniasResponse = await fetch('http://localhost:3000/insignias');
      const userInsigniasResponse = await fetch(`http://localhost:3000/user_insignias?usuarioId=${user.id}`);
      const insigniasData = await insigniasResponse.json();
      const userInsigniasData = await userInsigniasResponse.json();
      

      const userInsigniaIds = userInsigniasData.map((userInsignia: { insigniaId: number | string }) => Number(userInsignia.insigniaId));
      const userInsignias = insigniasData.filter((insignia: Insignia) => userInsigniaIds.includes(Number(insignia.id)));
      const remainingInsignias = insigniasData.filter((insignia: Insignia) => !userInsigniaIds.includes(Number(insignia.id)));

      await setInsignias(remainingInsignias);
      user.insignias = userInsignias;
      setUser({ ...user });
      console.log("remainingInsignias",remainingInsignias);
      console.log("userInsignias",userInsignias);
      console.log(user);
    };
  
    fetchData();
  }, []);

  const calculateRemainingBooks = (insignia: Insignia) => {
    if (!user) return insignia.numeroRepresentativo;

    // Obter progresso com base na categoria
    const categoryCount = insignia.categoria === 'geral' ? user.totalBooksRead : user.genresRead[insignia.categoria as keyof typeof user.genresRead] || 0;

    return Math.max(insignia.numeroRepresentativo - categoryCount, 0);
  };

  return (
    <div className="emblems-container">
      <div className="emblems-section-title">
        Suas Insígnias
        <i onClick={handleModal} className='profile-questionIcon'></i>
      </div>
      <div className="emblems-itens-wrapper">
      {user?.insignias && user.insignias.length > 0 ? (
        user.insignias.map((insignia) => (
          <div key={insignia.id} className="emblems-item">
            {insignia.numeroRepresentativo > 0 ? (
              <StyledBadge badgeContent={insignia.numeroRepresentativo} color="primary">
                <i className={`emblems-${insignia.icon}`}></i>
              </StyledBadge>
            ) : (
              <i className={`emblems-${insignia.icon}`}></i>
            )}
            <div className="emblems-text">
              <h3>{insignia.titulo}</h3>
              <p>{insignia.descricao}</p>
            </div>
          </div>
        ))
      ) : (
        <p>Nenhuma insígnia disponível</p>
      )}
      </div>
      <div className="emblems-section-title">
        Todas as Insígnias
      </div>
      <div className="emblems-itens-wrapper">
        {insignias.map((insignia) => (
          <div key={insignia.id} className="emblems-item">
            <StyledBadge badgeContent={insignia.numeroRepresentativo} color="secondary">
              <i className={`emblems-${insignia.icon}`}></i>
            </StyledBadge>
            <div className="emblems-text">
              <h3>{insignia.titulo}</h3>
              <p>{insignia.descricao}</p>
              <p className="remaining-books">Faltam {calculateRemainingBooks(insignia)} livros para essa insígnia</p>
            </div>
          </div>
        ))}
      </div>
      <ModalInfo isModalOpen={isModalOpen} onClose={handleModal} />
    </div>
  );
}

export default Emblems;