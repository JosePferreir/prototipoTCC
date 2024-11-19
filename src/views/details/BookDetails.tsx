import React, { useState, useEffect } from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import { Book } from '../../model/Book';
import './BookDetails.css';
import { UserBook } from '../../model/UserBook';
import { User } from '../../model/User';
import { TransitionProps } from '@mui/material/transitions';
import { Dialog, DialogActions, DialogContent, DialogTitle, Slide, styled, TextField } from '@mui/material';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CustomDialog = styled(Dialog)(() => ({
  '& .MuiDialog-paper': {
    backgroundColor: '#96CCA8', // Altere para a cor desejada
  },
}));

const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#3C5845 ',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#3C5845 ',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#3C5845 ',
    },
    '&:hover fieldset': {
      borderColor: '#3C5845 ',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#3C5845 ',
    },
  },
});

function BookDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Obtém o ID da URL
  const [book, setBook] = useState<Book | null>(null); // Estado para armazenar os detalhes do livro
  const [loading, setLoading] = useState<boolean>(true); // Estado para controlar o loading
  const [error, setError] = useState<string | null>(null); // Estado para armazenar erros
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [user] = useState<User | null>(() => {
    const storedUser = sessionStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) as User : null;
  });
  const [open, setOpen] = useState(false);
  const [totalPages, settotalPages] = useState(0);

  // Função para buscar os detalhes do livro pelo ID
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`https://808f28bf159ffb2cff0491f6299f6d0f.serveo.net/books/${id}`);
        if (!response.ok) {
          throw new Error('Erro ao buscar o livro');
        }
        const data: Book = await response.json();
        setBook(data); // Atualiza o estado com o livro retornado
        setLoading(false); // Desativa o loading
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message); // Define o erro, se ocorrer
        } else {
          setError('Erro desconhecido'); // Define um erro genérico
        }
        setLoading(false); // Desativa o loading
      }
    };

    fetchBook();
  }, [id]); // Dependência do useEffect, dispara quando o id muda

  // Função para verificar se o livro já está na biblioteca do usuário
  useEffect(() => {
    const checkIfBookInLibrary = async () => {
      const user = JSON.parse(sessionStorage.getItem('user') || '{}');
      if (!user || !id) return;

      try {
        const response = await fetch(
          `https://808f28bf159ffb2cff0491f6299f6d0f.serveo.net/user_books?usuarioId=${user.id}&bookId=${id}`
        );
        const userBooks: UserBook[] = await response.json();
        setIsInLibrary(userBooks.length > 0);
      } catch (err) {
        console.error('Erro ao verificar biblioteca do usuário:', err);
      }
    };

    checkIfBookInLibrary();
  }, [id]);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>Erro: {error}</p>;
  }

  if (!book) {
    return <p>Livro não encontrado!</p>;
  }

  const handleAddToLibrary = () => {
    if(isInLibrary) {
      navigate('/library/bookProgress/' + id);
    } else {
      handleOpen();
    }
  };

  const handleOpen = () => {
    settotalPages(0);
    setOpen(!open);
  };
  const confirmModal = async () => {
    try{
      await fetch('https://808f28bf159ffb2cff0491f6299f6d0f.serveo.net/user_books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuarioId: Number(user!.id),
        bookId: Number(book.id),
          totalPages: totalPages,
          pagesRead: 0,
          progress: 0,
        }),
      });
      navigate('/library');
    } catch (err) {
      console.error('Erro ao adicionar livro à biblioteca:', err);
    }
  }

  const handlePagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pages = parseInt(e.target.value, 10) || 0;
    settotalPages(pages);
  };

  return (
    <div className='bd-container'>
      {/* Botão de voltar */}
      <button className="back-button" onClick={() => navigate(-1)}>
        <i className='setaIcon'></i>
        Voltar
      </button>

      <div className="book-details-container">
        <div className="book-details-wrapper">
          <img src={book.coverImage} alt={`Capa do livro ${book.title}`} className="book-details-cover" />
          {/* Botão de adicionar à biblioteca */}
          <div className="add-button" onClick={handleAddToLibrary}>
            {isInLibrary ? 'Ver na Biblioteca' : 'Adicionar à Biblioteca'}
          </div>
        </div>
        <div className="book-details-info">
          <h1>{book.title}</h1>
          <p><strong>Autor(a):</strong> {book.author}</p>
          <p><strong>Gênero:</strong> {book.genre}</p>
          <p><strong>Resumo:</strong> {book.summary}</p>
        </div>
      </div>
      <CustomDialog 
        open={open}
        onClose={handleOpen}
        TransitionComponent={Transition}
        keepMounted
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Adicionar {book.title} à biblioteca
        </DialogTitle>
        <DialogContent>
          <div className="dialogContent-bookProgress">
            <div className='reedPages'>
              Quantas páginas possui o volume que esta lendo?<br/>
            </div>
            <CssTextField
              id="pages-to-register"
              label="Total de páginas do livro"
              variant="standard"
              onChange={handlePagesChange}
              value={totalPages}
              margin="dense"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <div className="dialogButton-cancel-bookProgress" onClick={handleOpen}>
            Cancelar
          </div>
          <div className="dialogButton-bookProgress" onClick={confirmModal}>
            Confirmar
          </div>
        </DialogActions>
      </CustomDialog>
    </div>
  );
}

export default BookDetails;