import React from 'react';
import './Library.css';
import { Book } from '../../model/Book';
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserBook } from '../../model/UserBook';

function Library() {
  const navigate = useNavigate();

  const [notStartedBooks, setNotStartedBooks] = useState<UserBook[]>([]);
  const [inProgressBooks, setInProgressBooks] = useState<UserBook[]>([]);
  const [completedBooks, setCompletedBooks] = useState<UserBook[]>([]);
  
  
  useEffect(() => {
    const fetchUserBooksAndFilter = async () => {
      try {
        // Obter o usuário logado
        const user = JSON.parse(sessionStorage.getItem('user') || '{}');
        if (!user.id) return;
  
        // Requisição para obter os livros associados ao usuário
        const userBooksResponse = await fetch(
          `https://prototipo-tcc-fake-api.vercel.app/user_books?usuarioId=${user.id}`
        );
        const userBooksData = await userBooksResponse.json();
  
        // Extrair os IDs dos livros que o usuário possui
        const userBookIds = userBooksData.map((ub: { bookId: number }) => ub.bookId);
  
        // Buscar todos os livros e filtrar apenas os que o usuário possui
        const booksResponse = await fetch('https://prototipo-tcc-fake-api.vercel.app/books');
        const allBooks = await booksResponse.json();

        const filteredBooks: Book[] = allBooks.filter((book: Book) => userBookIds.includes(Number(book.id)));

  
        // Atualizar o estado com a lista de livros do usuário

        // Associar os detalhes de cada livro ao `userBooksData`
        userBooksData.forEach(async (userBook: UserBook) => {
          filteredBooks.forEach((book: Book) => {
            if(book.id == userBook.bookId) {
              userBook.book = book;
            }
          });
        });

        // Filtrar os livros em categorias
        setNotStartedBooks(userBooksData.filter((ub: UserBook) => ub.progress === 0));
        setInProgressBooks(userBooksData.filter((ub: UserBook) => ub.progress > 0 && ub.progress < 100));
        setCompletedBooks(userBooksData.filter((ub: UserBook) => ub.progress === 100));

      } catch (err) {
        console.error('Erro ao buscar livros e verificar biblioteca do usuário:', err);
      }
    };
  
    fetchUserBooksAndFilter();
  }, []);

  // Referências para as listas de carousel
  const scrollNaoLidos = useRef<HTMLDivElement>(null);
  const scrollEmAndamento = useRef<HTMLDivElement>(null);
  const scrollFinalizados = useRef<HTMLDivElement>(null);
  

  // Função para controlar a rolagem do carousel
  const scrollCarousel = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    const list = ref.current;
    const itemWidth = 240; // Tamanho do item
    const padding = 20; // Espaçamento entre os itens

    if (list) {
      if (direction === 'left') {
        list.scrollLeft -= itemWidth + padding;
      } else {
        list.scrollLeft += itemWidth + padding;
      }
    }
  };

  const handleBookClick = (bookId: number) => {
    navigate(`/library/bookProgress/${bookId}`); // Navega para a página de detalhes do livro
  };
  
  return (
    <div className="biblioteca">
      <div className="retangulo">
        <div className="lib-title">
          Não lidos
        </div>
        <div className="lib-carousel-view">
          <button className="prev-btn" onClick={() => scrollCarousel(scrollNaoLidos, 'left')}>
            <svg viewBox="0 0 512 512" width="20">
              <path d="M256 504C119 504 8 393 8 256S119 8 256 8s248 111 248 248-111 248-248 248zM142.1 273l135.5 135.5c9.4 9.4 24.6 9.4 33.9 0l17-17c9.4-9.4 9.4-24.6 0-33.9L226.9 256l101.6-101.6c9.4-9.4 9.4-24.6 0-33.9l-17-17c-9.4-9.4-24.6-9.4-33.9 0L142.1 239c-9.4 9.4-9.4 24.6 0 34z" />
            </svg>
          </button>
          <div ref={scrollNaoLidos} className="lib-books-container lib-carousel-item-list">
            {notStartedBooks.map((ub) => (
              ub.book && ub.book.coverImage ? (
                <div key={ub.book.id} className="lib-book" onClick={() => handleBookClick(ub.book.id)}>
                  <img src={ub.book.coverImage} alt={ub.book.title} className="lib-book-cover" />
                </div>
              ) : null
            ))}
          </div>
          <button className="next-btn" onClick={() => scrollCarousel(scrollNaoLidos, 'right')}>
            <svg viewBox="0 0 512 512" width="20">
              <path d="M256 8c137 0 248 111 248 248S393 504 256 504 8 393 8 256 119 8 256 8zm113.9 231L234.4 103.5c-9.4-9.4-24.6-9.4-33.9 0l-17 17c-9.4 9.4-9.4 24.6 0 33.9L285.1 256 183.5 357.6c-9.4 9.4-9.4 24.6 0 33.9l17 17c9.4 9.4 24.6 9.4 33.9 0L369.9 273c9.4-9.4 9.4-24.6 0-34z" />
            </svg>
          </button>
        </div>
      </div>
      {/* Livros Em Andamento */}
      <div className="retangulo">
        <div className="lib-title">Em andamento</div>
        <div className="lib-carousel-view">
          <button className="prev-btn" onClick={() => scrollCarousel(scrollEmAndamento, 'left')}>
            <svg viewBox="0 0 512 512" width="20">
              <path d="M256 504C119 504 8 393 8 256S119 8 256 8s248 111 248 248-111 248-248 248zM142.1 273l135.5 135.5c9.4 9.4 24.6 9.4 33.9 0l17-17c9.4-9.4 9.4-24.6 0-33.9L226.9 256l101.6-101.6c9.4-9.4 9.4-24.6 0-33.9l-17-17c-9.4-9.4-24.6-9.4-33.9 0L142.1 239c-9.4 9.4-9.4 24.6 0 34z" />
            </svg>
          </button>
          <div ref={scrollEmAndamento} className="lib-books-container lib-carousel-item-list">
            {inProgressBooks.map((userBook) => (
              <div key={userBook.book.id} className="lib-book" onClick={() => handleBookClick(userBook.book.id)}>
                <img src={userBook.book.coverImage} alt={userBook.book.title} className="lib-book-cover-percent" />
                <div className="lib-progress-bar-container">
                  <div className="lib-progress-bar" style={{ width: `${userBook.progress}%` }}></div>
                  <span className="lib-progress-bar-text">{userBook.progress}%</span>
                </div>
              </div>
            ))}
          </div>
          <button className="next-btn" onClick={() => scrollCarousel(scrollEmAndamento, 'right')}>
            <svg viewBox="0 0 512 512" width="20">
              <path d="M256 8c137 0 248 111 248 248S393 504 256 504 8 393 8 256 119 8 256 8zm113.9 231L234.4 103.5c-9.4-9.4-24.6-9.4-33.9 0l-17 17c-9.4 9.4-9.4 24.6 0 33.9L285.1 256 183.5 357.6c-9.4 9.4-9.4 24.6 0 33.9l17 17c9.4 9.4 24.6 9.4 33.9 0L369.9 273c9.4-9.4 9.4-24.6 0-34z" />
            </svg>
          </button>
        </div>
      </div>
      {/* Livros scrollFinalizados */}
      <div className="retangulo">
        <div className="lib-title">Finalizados</div>
        <div className="lib-carousel-view">
          <button className="prev-btn" onClick={() => scrollCarousel(scrollFinalizados, 'left')}>
            <svg viewBox="0 0 512 512" width="20">
              <path d="M256 504C119 504 8 393 8 256S119 8 256 8s248 111 248 248-111 248-248 248zM142.1 273l135.5 135.5c9.4 9.4 24.6 9.4 33.9 0l17-17c9.4-9.4 9.4-24.6 0-33.9L226.9 256l101.6-101.6c9.4-9.4 9.4-24.6 0-33.9l-17-17c-9.4-9.4-24.6-9.4-33.9 0L142.1 239c-9.4 9.4-9.4 24.6 0 34z" />
            </svg>
          </button>
          <div ref={scrollFinalizados} className="lib-books-container lib-carousel-item-list">
            {completedBooks.map((userBook) => (
              <div key={userBook.book.id} className="lib-book" onClick={() => handleBookClick(userBook.book.id)}>
                <img src={userBook.book.coverImage} alt={userBook.book.title} className="lib-book-cover-percent" />
                <div className="lib-progress-bar-container">
                  <div className="lib-progress-bar2" style={{ width: '100%' }}></div>
                  <span className="lib-progress-bar-text">100%</span>
                </div>
              </div>
            ))}
          </div>
          <button className="next-btn" onClick={() => scrollCarousel(scrollFinalizados, 'right')}>
            <svg viewBox="0 0 512 512" width="20">
              <path d="M256 8c137 0 248 111 248 248S393 504 256 504 8 393 8 256 119 8 256 8zm113.9 231L234.4 103.5c-9.4-9.4-24.6-9.4-33.9 0l-17 17c-9.4 9.4-9.4 24.6 0 33.9L285.1 256 183.5 357.6c-9.4 9.4-9.4 24.6 0 33.9l17 17c9.4 9.4 24.6 9.4 33.9 0L369.9 273c9.4-9.4 9.4-24.6 0-34z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Library;