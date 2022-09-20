import React from 'react';
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate, useLocation} from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import {userData} from '../../services/userData'
import logoForss from './logo_forss.png'

const Tabs = () =>{
    const { signout, user } = useAuth()
    const navigate = useNavigate()
    const { data } = userData(user.idUser)
    let location = useLocation()
    
    return (    
        <div className="container_dashboard">
            <div className="menu_dashboard">
                <Navbar bg="dark" variant="dark" expand="lg">
                    <Container>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto" activeKey={location.pathname}>
                                <Navbar.Brand href="/Home">
                                    <img
                                        alt="Logo Forss"
                                        src={logoForss}
                                        width="40"
                                        height="30"
                                        className="d-inline-block align-top"
                                    />{' '}
                                    
                                </Navbar.Brand>
                                <Nav.Link href="/Home">Home</Nav.Link>
                                <Nav.Link href="/Pedidos">Pedidos</Nav.Link>
                                <Nav.Link href="/Romaneios">Romaneios</Nav.Link>
                                <Nav.Link href="/Marketplaces">Marketplaces</Nav.Link>
                                <Nav.Link href="/Transportadoras">Transportadoras</Nav.Link>
                                <Nav.Link href="/Empresas">Empresas</Nav.Link>
                            </Nav>

                            <NavDropdown title="API - SHOP" id="nav-api-ml">
                                <Link className='dropdown-item' to="/register-clients">Cadastrar Clientes</Link>
                            </NavDropdown>

                            <NavDropdown title="API - ML" id="nav-api-ml">
                                <Link className='dropdown-item' to="/list-item-ml">Listar Variações</Link>
                            </NavDropdown>
                            <NavDropdown title="Minha Conta" id="basic-nav-dropdown">
                                <Link className="dropdown-item" to={`/userEdit/${user.idUser}`}>Editar</Link>
                                {user.privilegeUser === "1" ?
                                    <><Link className="dropdown-item" to={`/newUser/`}>Novo Usuário</Link>
                                    <Link className="dropdown-item" to={`/Users/`}>Gerenciar Usuários</Link></>
                                : null}
                                
                                <NavDropdown.Divider />
                                <Link className="dropdown-item" to={`/userEditPass/${user.idUser}`}>Alterar Senha</Link>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={() => [signout(), navigate("/")]} >Sair</NavDropdown.Item>
                            </NavDropdown>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </div>
        </div>
    );
}
export default Tabs 