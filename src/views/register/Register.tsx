import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../model/User';
import './Register.css';
import { styled, TextField } from '@mui/material';

const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#3C5845',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#3C5845',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#3C5845',
    },
    '&:hover fieldset': {
      borderColor: '#3C5845',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#3C5845',
    },
  },
});

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    try {
      // Verifica se o email já está cadastrado
      const response = await fetch(`https://808f28bf159ffb2cff0491f6299f6d0f.serveo.net/user?email=${email}`);
      const users: User[] = await response.json();
  
      if (users.length > 0) {
        setError('Esse Usuário já está em uso.');
      } else {
        // Obtenha todos os usuários para verificar o último ID
        const allUsersResponse = await fetch('https://808f28bf159ffb2cff0491f6299f6d0f.serveo.net/user');
        const allUsers: User[] = await allUsersResponse.json();

        // Encontra o maior ID e incrementa
        const lastId = allUsers.reduce((maxId, user) => {
          const currentId = typeof user.id === 'number' ? user.id : parseInt(user.id, 10);
          return currentId > maxId ? currentId : maxId;
        }, 0);

        // Modelo do novo usuário com valores iniciais
        const newUser = {
          id: (lastId + 1).toString(),
          name,
          email,
          password,
          nivel: 0,
          pontos: 0,
          sequencia: 0,
          sequenciaMaxima: 0,
          pagesRead: 0,
          totalBooksRead: 0,
          genresRead: {
            romance: 0,
            aventura: 0,
            investigacao: 0,
            economia: 0,
          },
          lastReadDate: "",
        };
  
        // Cria um novo usuário no backend
        await fetch('https://808f28bf159ffb2cff0491f6299f6d0f.serveo.net/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUser),
        });
        navigate('/login'); // Redireciona para a página de login após o registro
      }
    } catch (err) {
      setError('Erro ao registrar o usuário.');
      console.error(err);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Criar Conta</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
          }}
        >
          <div>
            <CssTextField
              id="name"
              label="Nome"
              variant="standard"
              onChange={(e) => setName(e.target.value)}
              value={name}
              margin="dense"
              fullWidth
              required
            />
          </div>
          <div>
            <CssTextField
              id="email"
              label="Usuário"
              variant="standard"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              margin="dense"
              fullWidth
              required
            />
          </div>
          <div>
            <CssTextField
              id="password"
              label="Senha"
              type="password"
              variant="standard"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              margin="dense"
              fullWidth
              required
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button className='register-button' type="submit">Registrar</button>
        </form>
      </div>
      <p onClick={() => navigate('/login')} className="login-link">
        Já tem uma conta? <span>Entrar</span>
      </p>
    </div>
  );
};

export default Register;
