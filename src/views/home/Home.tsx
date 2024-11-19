import { useState, useEffect, useRef } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './Home.css'
import { Book } from '../../model/Book'
import { TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';


function Home() {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('https://prototipo-tcc-fake-api.vercel.app/books')
      .then((response) => response.json())
      .then((data: Book[]) => setBooks(data))
      .catch((error) => console.error('Erro ao buscar os livros:', error));
  }, []);

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Referências para as listas de carousel
  const maisLidosRef = useRef<HTMLDivElement>(null);
  const lancamentosRef = useRef<HTMLDivElement>(null);

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
    navigate(`/book/${bookId}`); // Navega para a página de detalhes do livro
  };

  return (
    <div className="container">
      <div className="search-bar">
        <TextField
          label="Buscar livros"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Seção "Mais Lidos" com Carousel */}
      <div className="sectionTitle">Mais lidos</div>
      <div className="carousel-view">
        <button className="prev-btn" onClick={() => scrollCarousel(maisLidosRef, 'left')}>
          <svg viewBox="0 0 512 512" width="20">
            <path d="M256 504C119 504 8 393 8 256S119 8 256 8s248 111 248 248-111 248-248 248zM142.1 273l135.5 135.5c9.4 9.4 24.6 9.4 33.9 0l17-17c9.4-9.4 9.4-24.6 0-33.9L226.9 256l101.6-101.6c9.4-9.4 9.4-24.6 0-33.9l-17-17c-9.4-9.4-24.6-9.4-33.9 0L142.1 239c-9.4 9.4-9.4 24.6 0 34z" />
          </svg>
        </button>
        <div ref={maisLidosRef} className="books-container carousel-item-list">
          {filteredBooks.map((book) => (
            <div className="book-card" key={book.id}
              onClick={() => handleBookClick(book.id)}>
              <img src={book.coverImage} alt={`Capa do livro ${book.title}`} className="book-cover" />
              <div className="book-info">
                <h3>{book.title}</h3>
                <p>
                  <strong>Autor:</strong> {book.author}
                </p>
                <p>
                  <strong>Gênero:</strong> {book.genre}
                </p>
              </div>
            </div>
          ))}
        </div>
        <button className="next-btn" onClick={() => scrollCarousel(maisLidosRef, 'right')}>
          <svg viewBox="0 0 512 512" width="20">
            <path d="M256 8c137 0 248 111 248 248S393 504 256 504 8 393 8 256 119 8 256 8zm113.9 231L234.4 103.5c-9.4-9.4-24.6-9.4-33.9 0l-17 17c-9.4 9.4-9.4 24.6 0 33.9L285.1 256 183.5 357.6c-9.4 9.4-9.4 24.6 0 33.9l17 17c9.4 9.4 24.6 9.4 33.9 0L369.9 273c9.4-9.4 9.4-24.6 0-34z" />
          </svg>
        </button>
      </div>

      {/* Seção "Lançamentos" com Carousel */}
      <div className="sectionTitle">Lançamentos</div>
      <div className="carousel-view">
        <button className="prev-btn" onClick={() => scrollCarousel(lancamentosRef, 'left')}>
          <svg viewBox="0 0 512 512" width="20">
            <path d="M256 504C119 504 8 393 8 256S119 8 256 8s248 111 248 248-111 248-248 248zM142.1 273l135.5 135.5c9.4 9.4 24.6 9.4 33.9 0l17-17c9.4-9.4 9.4-24.6 0-33.9L226.9 256l101.6-101.6c9.4-9.4 9.4-24.6 0-33.9l-17-17c-9.4-9.4-24.6-9.4-33.9 0L142.1 239c-9.4 9.4-9.4 24.6 0 34z" />
          </svg>
        </button>
        <div ref={lancamentosRef} className="books-container carousel-item-list">
          {filteredBooks.map((book) => (
            <div className="book-card" key={book.id}
              onClick={() => handleBookClick(book.id)}>
              <img src={book.coverImage} alt={`Capa do livro ${book.title}`} className="book-cover" />
              <div className="book-info">
                <h3>{book.title}</h3>
                <p>
                  <strong>Autor:</strong> {book.author}
                </p>
                <p>
                  <strong>Gênero:</strong> {book.genre}
                </p>
              </div>
            </div>
          ))}
        </div>
        <button className="next-btn" onClick={() => scrollCarousel(lancamentosRef, 'right')}>
          <svg viewBox="0 0 512 512" width="20">
            <path d="M256 8c137 0 248 111 248 248S393 504 256 504 8 393 8 256 119 8 256 8zm113.9 231L234.4 103.5c-9.4-9.4-24.6-9.4-33.9 0l-17 17c-9.4 9.4-9.4 24.6 0 33.9L285.1 256 183.5 357.6c-9.4 9.4-9.4 24.6 0 33.9l17 17c9.4 9.4 24.6 9.4 33.9 0L369.9 273c9.4-9.4 9.4-24.6 0-34z" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Home
