import React from "react";
import "./ModalInfo.css";

interface ModalInfoProps {
  isModalOpen: boolean;
  onClose: () => void;
}

const ModalInfo: React.FC<ModalInfoProps> = ({ isModalOpen, onClose }) => {
 if (isModalOpen !== true) {
   return null;
 }
 return (
   <section className="modal">
     <article className="modal-content p-lg-4">
        <div className="exit-icon text-end">
          <div className="modalInfo-closeButton" onClick={onClose}>
            <i className="modalInfo-closeIcon"></i>
          </div>
        </div>
        <div className="modalInfo-itens-wrapper">
          <div className="modalInfo-item">
            <div className="title">
              <i className="modalInfo-pointsIcon"></i>
              Pontos
            </div>
            <div className="modalInfo-text">
              Concedidos ao registrar leitura, completar livro ou manter a sequência. Cada pagina registrada concede 5 pontos, completar um livro concede 200 pontos e manter a sua ofensiva condede 50 pontos
            </div>
          </div>
          <div className="modalInfo-item">
            <div className="title">
              <i className="modalInfo-starIcon"></i>
              Níveis
            </div>
            <div className="modalInfo-text">
              Utilizados para medir seu progresso dentro da aplicação, cada nível requer uma quantidade de pontos para ser alcançado. A cada 1000 pontos você sobe um nível.
            </div>
          </div>
          <div className="modalInfo-item">
            <div className="title">
              <i className="modalInfo-emblemIcon"></i>
              Insígnias
            </div>
            <div className="modalInfo-text">
              Recompensas visuais no seu perfil por atingir determinados objetivos dentro da aplicação. Cada insígnia possui um objetivo específico e um número de livros a serem lidos para serem conquistadas. Você pode visualizar todas as insígnias na aba "Insígnias" do menu lateral.
            </div>
          </div>
          <div className="modalInfo-item">
            <div className="title">
              <i className="modalInfo-filledFireIcon"></i>
              Sequência
            </div>
            <div className="modalInfo-text">
              Contador de quantos dias consecutivos registrou sua leitura, recebe pontos por manter a ofensiva. A sequência é reiniciada caso não registre leitura em um dia. Você pode visualizar sua maior sequência na aba "Perfil" e sua sequencia atual no canto superior do manu lateral.
            </div>
          </div>
        </div>
     </article>
   </section>
 );
};

export default ModalInfo;