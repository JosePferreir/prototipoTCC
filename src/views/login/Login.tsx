import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../model/User';
import './Login.css';
import { styled, TextField } from '@mui/material';

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

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();

  // Estados para armazenar o email, senha e erros
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Função para lidar com o login
  const handleLogin = async () => {
    try {
      // Faz uma chamada para json-server para obter o usuário pelo email
      const response = await fetch(`http://localhost:3000/user?email=${email}`);
      const users: User[] = await response.json();

      // Verifica se o usuário existe e se a senha está correta
      if (users.length > 0 && users[0].password === password) {
        const userData = users[0];
        
        onLogin(userData);
        navigate('/home');
      } else {
        setError('Email ou senha incorretos.');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor.');
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <div>
            <CssTextField
                id="email"
                label="Usuário"
                variant="standard"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                margin="dense"
                fullWidth
              />
          </div>
          <div>
            <CssTextField
                id="senha"
                label="senha"
                type="password"
                variant="standard"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                margin="dense"
                fullWidth
              />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit">Entrar</button>
        </form>
      </div>
      <p className="create-account-link" onClick={() => navigate('/register')}>
          Não tem uma conta? <span>Criar conta</span>
      </p>
    </div>
  );
};

export default Login;