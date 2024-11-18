import React, { useState, useEffect } from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import { Book } from '../../../model/Book';
import './BookProgress.css';
import ProgressBar from './ProgressBar';
import { UserBook } from '../../../model/UserBook';
import { Dialog, DialogActions, DialogContent, DialogTitle, Slide, styled, TextField } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { User } from '../../../model/User';
import { Insignia } from '../../../model/Insignia';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
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

function BookProgress() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Obtém o ID da URL
  const [book, setBook] = useState<Book | null>(null); // Estado para armazenar os detalhes do livro
  const [loading, setLoading] = useState<boolean>(true); // Estado para controlar o loading
  const [error, setError] = useState<string | null>(null); // Estado para armazenar erros
  const [userBook, setUserBook] = useState<UserBook | null>(null);
  const [open, setOpen] = useState(false);
  const [pagesToRegister, setPagesToRegister] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [maxPagesToRegister, setMaxPagesToRegister] = useState(0);
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = sessionStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) as User : null;
  });
  
  // Função para buscar os detalhes do livro pelo ID
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`http://localhost:3000/books/${id}`);
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

  // Função para buscar o registro de leitura do usuário
  useEffect(() => {
    const fetchUserBookProgress = async () => {
      if (!user.id || !id) return;

      try {
        const response = await fetch(
          `http://localhost:3000/user_books?usuarioId=${user.id}&bookId=${id}`
        );
        const userBookData = await response.json();
        setUserBook(userBookData[0]); // Como esperamos apenas um item, selecionamos o primeiro
      } catch (err) {
        console.error('Erro ao buscar progresso de leitura:', err);
      }
    };

    fetchUserBookProgress();
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

  const handleModal = () => {
    setMaxPagesToRegister(userBook?.totalPages - userBook?.pagesRead);
    setPagesToRegister(0);
    setOpen(!open);
  }

  const handlePagesChange = (e) => {
    const pages = parseInt(e.target.value, 10) || 0;
    if (pages > maxPagesToRegister) {
      setErrorMessage(`Não é possivel registrar mais paginas do que faltam.`);
      setPagesToRegister(maxPagesToRegister);
    } else {
      setErrorMessage('');
      setPagesToRegister(pages);
    }
  };

  const registerRead = async () => {
    const newUserBook: UserBook = { ...userBook };
    const newUser: User = { ...user };
    
    newUserBook!.pagesRead += pagesToRegister;
    newUserBook!.progress = Math.floor((newUserBook!.pagesRead / newUserBook!.totalPages) * 100);
    if (newUserBook!.pagesRead > 0 && newUserBook!.progress === 0) {
      newUserBook!.progress = 1;
    }
    newUser.pontos = newUser.pontos + (pagesToRegister*5);
    newUser.pagesRead += pagesToRegister;
    newUser.nivel = Math.floor(newUser.pontos/1000);

    if(newUserBook!.progress >= 100){
      const genre = book.genre.toLowerCase();
      switch(genre){
        case 'romance':
          newUser.genresRead.romance += 1;
          break;
        case 'aventura':
          newUser.genresRead.aventura += 1;
          break;
        case 'investigação':
          newUser.genresRead.aventura += 1;
          break;
        case 'economia':
          newUser.genresRead.aventura += 1;
          break;
        default:
          break;
      }
      newUser.totalBooksRead += 1;
      newUser.pontos += 200;

      checkAndAddAchievements(newUser,genre);
    }
    await checkSequence(newUser);
    console.log("novo user ",newUser)
    console.log("comvalor ",newUserBook)
    console.log(user)/* */
    await fetch(`http://localhost:3000/user_books/${newUserBook.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUserBook),
    });
    console.log("NOVO: user",newUser)
    await fetch(`http://localhost:3000/user/${newUser.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    });
    setUser(newUser);
    sessionStorage.setItem('user', JSON.stringify(newUser));
    window.location.href = "/library";
    handleModal();
    
  };

  const checkSequence = (newUser: User) => {
    const today = new Date().toISOString().split('T')[0];
    if (newUser.lastReadDate) {
      const lastRead = new Date(newUser.lastReadDate);
      const differenceInDays = Math.floor((new Date(today).getTime() - lastRead.getTime()) / (1000 * 60 * 60 * 24));
      console.log("differenceInDays",differenceInDays)
      if (differenceInDays == 1) {
        console.log("um dia")
        // Incrementa a sequência se foi no dia seguinte
        newUser.sequencia += 1;
        newUser.sequenciaMaxima = Math.max(newUser.sequencia, newUser.sequenciaMaxima);
        newUser.pontos += 50;
      } else if (differenceInDays > 1) {
        console.log("mais de um dia")
        // Redefine a sequência se passou mais de um dia
        newUser.sequencia = 1;
      }
    } else {
      console.log("primeiro dia")
      // Inicializa a sequência no primeiro registro
      newUser.sequencia = 1;
    }

    // Atualiza `lastReadDate` para a data de hoje
    newUser.lastReadDate = today;
  };

  const checkAndAddAchievements = async (newUser: User, genre: string) => {
    const insigniasResponse = await fetch('http://localhost:3000/insignias');
    const insigniasData = await insigniasResponse.json();
    const userInsigniasResponse = await fetch(`http://localhost:3000/user_insignias?usuarioId=${newUser.id}`);
    const userInsigniasData = await userInsigniasResponse.json();

    const userInsigniaIds = userInsigniasData.map((userInsignia: { insigniaId: number | string }) => Number(userInsignia.insigniaId));
    const remainingInsignias = insigniasData.filter((insignia: Insignia) => !userInsigniaIds.includes(Number(insignia.id)));

    remainingInsignias
    .filter((insignia: Insignia) => insignia.categoria === genre)
    .forEach(async (insignia: Insignia) => {
      const remainingBooks = calculateRemainingBooks(insignia);
      console.log("remainingBooks",remainingBooks);
      if (remainingBooks === 0) {
        await fetch('http://localhost:3000/user_insignias', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            usuarioId: newUser.id,
            insigniaId: insignia.id,
          }),
        });
      }
    });

    remainingInsignias
    .filter((insignia) => insignia.categoria === 'geral')
    .forEach(async (insignia) => {
      const remainingBooksForGeneral = insignia.numeroRepresentativo - newUser.totalBooksRead;
      console.log("remainingBooksForGeneral",remainingBooksForGeneral);
      if (remainingBooksForGeneral <= 0) {
        await fetch('http://localhost:3000/user_insignias', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            usuarioId: newUser.id,
            insigniaId: insignia.id,
          }),
        });
      }
    });
  };

  const calculateRemainingBooks = (insignia: Insignia) => {
    if (!user) return insignia.numeroRepresentativo;

    // Obter progresso com base na categoria
    const categoryCount = insignia.categoria === 'geral' ? user.totalBooksRead : user.genresRead[insignia.categoria as keyof typeof user.genresRead] || 0;

    return Math.max(insignia.numeroRepresentativo - categoryCount, 0);
  };

  return (
    <div className='bp-container'>
      {/* Botão de voltar */}
      <button className="back-button" onClick={() => navigate(-1)}>
        <i className='setaIcon'></i>
        Voltar
      </button>

      <div className="book-progress-container">
        <div className="book-progress-wrapper">
          <img src={book.coverImage} alt={`Capa do livro ${book.title}`} className="book-progress-cover" />
        </div>
        <div className="book-progress-info">
          <h1>{book.title}</h1>
          <p><strong>Autor(a):</strong> {book.author}</p>
          <p><strong>Gênero:</strong> {book.genre}</p>
          <p><strong>Resumo:</strong> {book.summary}</p>
        </div>
      </div>
      <div className="options">
        <div className="progressBarWrapper">
          <ProgressBar value={userBook?.progress || 0}></ProgressBar>
          <div className="textProgress">
            {userBook?.pagesRead || 0}/{userBook?.totalPages}<br/>
            Paginas lidas
          </div>
        </div>
        {userBook?.progress != 100 ? (
          <div className="addLeitura" onClick={handleModal}>
            <i className='livroAbertoIcon'></i>
            <div className="textProgress">
              Registrar Leitura
            </div>
          </div>
        ): null}
      </div>
      <CustomDialog 
        open={open}
        onClose={handleModal}
        TransitionComponent={Transition}
        keepMounted
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Registrar Leitura de "{book.title}"
        </DialogTitle>
        <DialogContent>
          <div className="dialogContent-bookProgress">
            <div className='reedPages'>
              Paginas lidas até o momento: {userBook?.pagesRead} de {userBook?.totalPages}<br/>
            </div>
            <CssTextField
              id="pages-to-register"
              label="Número de páginas a serem registradas"
              variant="standard"
              onChange={handlePagesChange}
              value={pagesToRegister}
              margin="dense"
              error={!!errorMessage}
            />
            <div>
              Novo progresso de leitura: {userBook?.pagesRead + pagesToRegister} de {userBook?.totalPages}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <div className="dialogButton-cancel-bookProgress" onClick={handleModal}>
            Cancelar
          </div>
          <div className="dialogButton-bookProgress" onClick={registerRead}>
            Confirmar
          </div>
        </DialogActions>
      </CustomDialog>
    </div>
  );
}

export default BookProgress;