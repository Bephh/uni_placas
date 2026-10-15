import { useState, type FormEvent } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, set, serverTimestamp } from 'firebase/database';
import { FirebaseError } from 'firebase/app';
import { auth, db } from '../Firebase/firebase';
import '../css/cadastro.css';

function mensagemDeErro(error: unknown): string {
  if (error instanceof FirebaseError) {

    // pra ver se n deu merda
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'Este e-mail já está cadastrado.';
      case 'auth/invalid-email':
        return 'E-mail inválido.';
      case 'auth/weak-password':
        return 'A senha precisa ter pelo menos 6 caracteres.';
      case 'auth/operation-not-allowed':
        return 'Cadastro por e-mail/senha não está habilitado no Firebase.';
      case 'auth/network-request-failed':
        return 'Falha de conexão. Verifique sua internet e tente novamente.';
    }
  }
  return 'Não foi possível concluir o cadastro. Tente novamente.';
}

function CabecalhoCadastro() {
  return (
    <header className="cadastro-header">
      <a className="cadastro-brand" href="/" aria-label="Página inicial">
        <img className="cadastro-logo" src="src/visual/logo.jpeg" alt="Logo UniPlacas" />
      </a>
      <nav className="cadastro-nav" aria-label="Navegação da página">
        <a href="/">Home</a>
        <a href="/login">Já tem uma conta? Entrar</a>
      </nav>
    </header>
  );
}

// function do cadastro de usuario games
function Cadastro() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);



  // enviar o cadastro para o firebase auth
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro('');

    if (!nome.trim()) {
      setErro('Informe seu nome completo.');
      return;
    }

    setEnviando(true);
    try {
      console.log('[cadastro] 1/4 criando usuário...');
      const credencial = await createUserWithEmailAndPassword(auth, email.trim(), senha);
      console.log('[cadastro] 2/4 usuário criado:', credencial.user.uid);

      await updateProfile(credencial.user, { displayName: nome.trim() });

      try {
        console.log('[cadastro] 3/4 salvando dados no Realtime Database...');
        await Promise.race([
          set(ref(db, `usuarios/${credencial.user.uid}`), {
            nome: nome.trim(),
            cpf,
            telefone,
            email: email.trim(),
            criadoEm: serverTimestamp(),
          }),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Tempo esgotado')), 5000),
          ),
        ]);
      } catch (dbError) {
        console.error('Erro ao salvar dados: ', dbError);
      }

      console.log('[cadastro] 4/4 redirecionando para a tela inicial');
      window.location.href = '/';
    } catch (error) {
      console.error('[cadastro] erro:', error);
      setErro(mensagemDeErro(error));
      setEnviando(false);
    }
  }

  return (
    <main className="cadastro-page">
      <CabecalhoCadastro />
      <h1>Criar conta</h1>
      <p className="cadastro-intro">Crie uma nova conta de usuário.</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="nome">Nome completo</label>
        <input id="nome" name="nome" type="text" required value={nome} onChange={(e) => setNome(e.target.value)} />

        <label htmlFor="cpf">CPF</label>
        <input id="cpf" name="cpf" type="text" inputMode="numeric" required value={cpf} onChange={(e) => setCpf(e.target.value)} />

        <label htmlFor="senha">Senha</label>
        <input id="senha" name="senha" type="password" required minLength={6} autoComplete="new-password" value={senha} onChange={(e) => setSenha(e.target.value)} />

        <label htmlFor="email">E-mail</label>
        <input id="email" name="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label htmlFor="telefone">Número de telefone</label>
        <input id="telefone" name="tel_num" type="tel" required value={telefone} onChange={(e) => setTelefone(e.target.value)} />

        {erro && <p className="cadastro-erro" role="alert">{erro}</p>}

        <button type="submit" disabled={enviando}>
          {enviando ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>
    </main>
  );
}

export default Cadastro;