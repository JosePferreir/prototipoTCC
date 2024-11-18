import React, {useState} from 'react';
import Sidebar from './sidebar/Sidebar';
import './Layout.css';
import ModalInfo from '../utils/ModalInfo';

interface LayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

function Layout({ children, onLogout }: LayoutProps) {

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <header className="navbar">
          <div>
            Book Trek
          </div>
          <i className='logoutIcon' onClick={onLogout} title='Sair'></i>
        </header>
        <div className='childrenWrapper'>
        <i onClick={handleModal} className='loyout-questionIcon'></i>
          {children}
        <ModalInfo isModalOpen={isModalOpen} onClose={handleModal} />
        </div>
      </div>
    </div>
  );
}

export default Layout;