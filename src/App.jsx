import React, {Fragment} from 'react'
import './pages/assets/base.css';
import { Route, Routes } from "react-router-dom"

import Home from "./pages/Home"
import Marketplaces from "./pages/marketplace/Marketplaces"
import MarketplaceEdit from "./pages/marketplace/MarketplaceEdit"
import Pedidos from "./pages/pedidos/Pedidos"
import Romaneios from "./pages/romaneio/Romaneios"
import RomaneiosEdit from "./pages/romaneio/RomaneiosEdit"
import Status from "./pages/Status"
import Transportadoras from "./pages/transportadora/Transportadoras"
import TransportadorasEdit from "./pages/transportadora/TransportadorasEdit"
import Login from "./pages/login/Login"
import newUser from "./pages/login/newUser"
import userEdit from "./pages/login/userEdit"
import Register from "./pages/login/Register"
import userEditPass from "./pages/login/userEditPass"
import Users from "./pages/login/Users"
import Empresas from "./pages/empresa/Empresas"
import EmpresasEdit from "./pages/empresa/EmpresasEdit"
import PedidosEdit from "./pages/pedidos/PedidosEdit"
import ImportOrders from "./pages/pedidos/ImportOrders"
import PrintRom from "./pages/romaneio/PrintRom"
import PrintBikeList from "./pages/pedidos/PrintBikeList"
import ListMLBItem from "./pages/apiMLB/listItem"
import RegisterClients from "./pages/shopApi/RegisterClients"
import Rastreio from "./pages/tracking/OrderTracking"
import useAuth from './hooks/useAuth'

const Private = ({ Item }) => {
  const { signed } = useAuth();
  
  return signed > 0 ? <Item /> : <Login />;
}


export default function App() {

  return (
    <Fragment>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/*" element={<Login/>} />
        <Route path="/rastreio" element={<Rastreio/>} />

        <Route path="/Users" element={<Private Item={Users}/>} />
        <Route path="/userEdit/:id" element={<Private Item={userEdit}/>} />
        <Route path="/userEditPass/:id" element={<Private Item={userEditPass}/>} />
        <Route path="/newUser" element={<Private Item={newUser}/>} />
        <Route exact path="/home" element={<Private Item={Home}/>} />
        <Route path="/ImportOrders" element={<Private Item={ImportOrders}/>} />
        <Route path="/pedidos" element={<Private Item={Pedidos}/>} />
        <Route path="/pedidosEdit/:id" element={<Private Item={PedidosEdit}/>} />
        <Route path="/marketplaces" element={<Private Item={Marketplaces}/>} />
        <Route path="/editMkt/:id" element={<Private Item={MarketplaceEdit}/>} />
        <Route path="/romaneios" element={<Private Item={Romaneios}/>} />
        <Route path="/editRom/:id" element={<Private Item={RomaneiosEdit}/>} />
        <Route path="/status" element={<Private Item={Status}/>} />
        <Route path="/transportadoras" element={<Private Item={Transportadoras}/>} />
        <Route path="/transportadorasEdit/:id" element={<Private Item={TransportadorasEdit}/>} />
        <Route path="/empresas" element={<Private Item={Empresas}/>} />
        <Route path="/empresasEdit/:id" element={<Private Item={EmpresasEdit}/>} />
        <Route path="/PrintRom/:id" element={<Private Item={PrintRom}/>} />
        <Route path="/PrintBikeList" element={<Private Item={PrintBikeList}/>} />
        <Route path="/list-item-ml" element={<Private Item={ListMLBItem}/>} />
        <Route path="/register-clients" element={<Private Item={RegisterClients}/>} />

      </Routes>
    </Fragment>
  )
}
