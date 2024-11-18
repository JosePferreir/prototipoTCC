import React, {useState} from 'react';
import './Sidebar.css';
import Divider from '@mui/material/Divider';
import { useLocation } from 'react-router-dom';
import ModalInfo from '../../utils/ModalInfo';
import { User } from '../../model/User';
import { styled, Tooltip } from '@mui/material';

// Customização do Tooltip com MUI
const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  '& .MuiTooltip-tooltip': {
    fontSize: '16px', // Tamanho do texto
    color: '#000',
    backgroundColor: '#70997E', // Cor de fundo
    border: '1px solid black', // Borda preta
    textAlign: 'center', // Centraliza o texto
    padding: '10px',
    maxWidth: '220px',
  },
  '& .MuiTooltip-arrow': {
    color: '#70997E', // Cor da seta para combinar com o fundo
  },
});

function Sidebar() {
  const location = useLocation();
  const isActiveHome = location.pathname === '/home' || location.pathname.startsWith('/book');
  const isActiveProfile = location.pathname === '/profile';
  const isActiveLibrary = location.pathname === '/library' || location.pathname.startsWith('/library');
  const isActiveEmblems = location.pathname === '/emblems';
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  const [user, setUser] = useState<User | null>(() => {
    const storedUser = sessionStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) as User : null;
  });

  // Função para formatar a data manualmente para dd/mm/aaaa
  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const lastReadDateFormatted = user?.lastReadDate 
    ? formatDate(user.lastReadDate) 
    : 'Data não disponível';


  return (
    <div className="sidebar">
      <div className='fireAndLevel'>
      <CustomTooltip
        title={`Você manteve a sequência por ${user?.sequencia} dias. Última leitura registrada foi em ${lastReadDateFormatted}`}
        arrow
        placement="bottom-end"
      >
        <div className="fireWrapper">
          <i className="fireIcon"></i>
          {user?.sequencia}
        </div>
      </CustomTooltip>
        <div>
          Nível: {user?.nivel}
        </div>
        
      </div>
      <Divider />
      <div className={`menu-item ${isActiveHome ? 'active' : ''}`} onClick={() => window.location.href = "/home"}>
        <div className="iconWrapper">
          <i className="homeIcon"></i>
        </div>
        <span>Menu Principal</span>
      </div>
      <div className={`menu-item ${isActiveProfile ? 'active' : ''}`} onClick={() => window.location.href = "/profile"}>
        <div className="iconWrapper">
          <i className="perfilIcon"></i>
        </div>
        <span>Perfil</span>
      </div>
      <div className={`menu-item ${isActiveLibrary ? 'active' : ''}`} onClick={() => window.location.href = "/library"}>
        <div className="iconWrapper">
          <i className="bookIcon"></i>
        </div>
        <span>Minha Biblioteca</span>
      </div>
      <div className={`menu-item ${isActiveEmblems ? 'active' : ''}`} onClick={() => window.location.href = "/emblems"}>
        <div className="iconWrapper">
          <i className="emblemIcon"></i>
        </div>
        <span>Insígnias</span>
      </div>
        <ModalInfo isModalOpen={isModalOpen} onClose={handleModal} />
      
    </div>
  );
}

export default Sidebar;