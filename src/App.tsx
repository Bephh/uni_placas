import './App.css'
import Cadastro from './pages/cadastro'
import DadosVeiculo from './pages/dadosVeiculo'
import Login from '../src/pages/Login'
import Home from './pages/home'
import Termos from './pages/termos'
import PrivateRoute from './components/privateRoutes'
import { Route, Routes } from 'react-router-dom'
import Historico from './pages/historico'
import Sobre from './pages/sobre'
import Perfil from './pages/perfil'
import Checkout from './pages/checkout'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/termos" element={<Termos />} />
      <Route path="/sobre" element={<Sobre />} />
      <Route path="/checkout/:placa" element={<Checkout />} />

      <Route element={<PrivateRoute />}>
        <Route path="/veiculo/:placa" element={<DadosVeiculo />} />
        <Route path="/historico" element={<Historico />} />
        <Route path="/perfil" element={<Perfil />} />
      </Route>

      <Route path="*" element={<Home />} />
    </Routes>
  )
}

export default App
