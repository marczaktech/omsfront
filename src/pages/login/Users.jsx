import React, { useState } from 'react';
import {
  Container, Table,
  DropdownButton, Dropdown,
  Collapse, Button, Form,
  Row, Col, ToastContainer, Toast, Spinner, Modal, Alert
} from "react-bootstrap";
import Tabs from '../../pages/modules/Tabs';
import Footer from '../../pages/modules/Footer';
import Header from '../../pages/modules/Header';
import { useQueryClient, useMutation } from 'react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import fetchUsers from '../../services/userData';




const Users = () => {

  const {data: getAll, isLoading: loadAll } = fetchUsers()

  const queryClient = useQueryClient();
  const [err, setErr] = useState(false);
  const [errmsg, setErrmsg] = useState('');
  const [sucss, setSucss] = useState(false);
  const [sucssmsg, setSucssmsg] = useState('');
  const [show, setShow] = useState(false);


  const { mutate: delUser } = useMutation(
    async (deleteId) => {
      return await axios.delete(`/delUser/${deleteId}`);
    },
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries('users')
        setSucss(true)
        setSucssmsg(res.data.name)
        setShow(true)
      },
      onError: (err) => {
        console.log(err, '3')
      },
    }
  )

  function actione(e){
    const actionId = e.target.getAttribute("data-id")
    const action = e.target.getAttribute("data-action")

    if(action === 'del'){
      delUser(actionId)
    }
  }
  return (
    <>
      <Header />
      <Tabs />
      <Container>
          <Modal show={loadAll} animation={false} centered>
            <Modal.Body>
              <div className='spiner-container'>
                  <Spinner animation="border" role="status" variant="primary" >
                    <span className="visually-hidden load_margin">Loading...</span>
                  </Spinner>
              </div>
            </Modal.Body>
          </Modal>
          {err ? (
            <ToastContainer className="p-3" position="top-end">
              <Toast  className="d-inline-block m-1" 
                      bg="danger" 
                      onClose={() => setShow(false)} 
                      show={show} delay={3000} autohide
              >
                <Toast.Header>
                  <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                  <strong className="me-auto">Usuário</strong>
                </Toast.Header>
                <Toast.Body>{errmsg}</Toast.Body>
              </Toast>
            </ToastContainer>
          ) : null}
          {sucss ? 
              <ToastContainer className="p-3" position="top-end">
                <Toast  className="d-inline-block m-1" 
                        bg="success" 
                        onClose={() => setShow(false)} 
                        show={show} delay={3000} autohide
                >
                  <Toast.Header>
                    <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                    <strong className="me-auto">Usuário {sucssmsg}</strong>
                  </Toast.Header>
                  <Toast.Body>Excluído com Sucesso !!!</Toast.Body>
                </Toast>
              </ToastContainer>
              : null
          }
        <div className="main">
          <h2>Usuários</h2>
        </div>
        <Table striped bordered hover variant="dark" responsive>
          <thead>
            <tr>
              <th>#ID</th>
              <th>Ações</th>
              <th>Nome</th>
              <th>E-mail</th>
            </tr>
          </thead>
          <tbody>
            {loadAll ? <tr><td colSpan={3}>Carregando...</td></tr> :
            getAll.length != 0 
              ?
                getAll?.map(user => {
                  return (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>
                        <DropdownButton title="Ação" id="bg-vertical-dropdown-1">
                          <Link className="dropdown-item" to={`/userEdit/${user.id}`}>Editar</Link> 
                          <Dropdown.Item onClick={actione} data-action="del" data-id={user.id}  data-tag="del">Excluir</Dropdown.Item>
                        </DropdownButton>
                      </td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                    </tr>
                  )
                })
              :
              <tr><td colSpan={4}>Nenhum Usuário encontrado</td></tr>
            }
          </tbody>
        </Table>
      </Container>
      <Footer />
    </>
  );
}

export default Users