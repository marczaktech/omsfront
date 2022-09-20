import React, { useState } from 'react';
import {
  Container, Table,
  DropdownButton, Dropdown,
  Collapse, Button, Form,
  Row, Col, ToastContainer, Toast, Spinner, Modal, Alert
} from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';


import Tabs from './modules/Tabs';
import Footer from './modules/Footer';
import Header from './modules/Header';
import LoadSpinner from './components/LoadSpinner'


import { Formik } from 'formik';
import * as Yup from 'yup';

import { useQueryClient, useMutation } from 'react-query';
import axios from 'axios';
import fetchAllStatus from '../services/statusData'

function FormStatus() {
  const [err, setErr] = useState(false);
  const [errmsg, setErrmsg] = useState('');
  const [sucss, setSucss] = useState(false);
  const [sucssmsg, setSucssmsg] = useState('');

  const queryClient = useQueryClient();

  const { mutate: addMkt, isLoading: mutLoading } = useMutation(
    async (addStatus) => {
      return axios.post('/newStatus', addStatus)
    },
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries('status')
        setSucss(true)
        setErr(false)
        setSucssmsg(res.data.nome)
      },
      onError: (err) => {
        setErrmsg(err.response.data.error)
        setSucss(false)
        setErr(true)
      },
    }
  )

  function createMkt(event) {
    const st = event
    addMkt(st)
  }

  const schema =
    Yup.object().shape({
      nome: Yup.string().required('Preencha o Nome'),
      cor: Yup.string().required('Preencha a cor')
    });

  const initialValues = { nome: '', cor: ''}

  return (
    <Formik
      validationSchema={schema}
      onSubmit={createMkt}
      initialValues={initialValues}
      enableReinitialize={true}
    >

      {({
        handleSubmit,
        handleChange,
        handleBlur,
        handleReset,
        values,
        touched,
        isValid,
        errors,
      }) => (

        <Form noValidate onSubmit={handleSubmit} id="form-tr">
          <Row className="mb-3">
            <Form.Group as={Col} md="4" controlId="nome">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Nome"
                onChange={handleChange}
                value={values.nome}
                className={touched.nome && errors.nome ? "error" : null}
              />
              {touched.nome && errors.nome ? (
                <div className="error-message">{errors.nome}</div>
              ) : null}
            </Form.Group>

            <Form.Group as={Col} md="4" controlId="cor">
              <Form.Label>Cor do Status</Form.Label>
              {/* <Form.Control
                required
                type="text"
                placeholder="Digite: vermelho, azul, verde ou laranja"
                onChange={handleChange} 
                value={values.cor}
                className={touched.cor && errors.cor ? "error" : null}
              /> */}
              <Form.Select 
                required
                onChange={handleChange}
                value={values.cor}
                className={touched.cor && errors.cor ? "error" : null}
              >
                <option value>Selecione</option>
                <option value="table-primary">Azul</option>
                <option value="table-secondary">Cinza</option>
                <option value="table-success">Verde</option>
                <option value="table-danger">Vermelho</option>
                <option value="table-warning">Amarelo</option>
                <option value="table-info">Azul Claro</option>
                <option value="table-light">Branco</option>
                <option value="table-dark">Preto</option>
              </Form.Select>
              {touched.cor && errors.cor ? (
                <div className="error-message">{errors.cor}</div>
              ) : null}
            </Form.Group>
          </Row>

          <div className='btn-forms mb-3'>
            <Button md="3" type="submit">Enviar</Button>
            <Button type="reset" onClick={handleReset} className="margin-left-btn" variant="light">Limpar</Button>
            <LoadSpinner load={mutLoading} />
            {err ? (
              <Alert md="3" variant="danger" className='div-alert'>
                {errmsg}
              </Alert>
            ) : null}
            {sucss ?
              <Alert md="3" variant="success" className='div-alert'>
                Status  {sucssmsg} adicionado com sucesso!!
              </Alert> : null
            }
          </div>
        </Form>
      )}
    </Formik>
  );
}

function NewStatus() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(!open)}
        aria-controls="example-collapse-text"
        aria-expanded={open}
        variant="outline-primary"
      >
        Novo Status
      </Button>
      <Collapse in={open}>
        <div id="newForm">
          <FormStatus />
        </div>
      </Collapse>
    </>
  );
}

const Status = () => {
  let navigate = useNavigate();
  const { data } = fetchAllStatus();


  const { mutate: delStts } = useMutation(
    async (deleteId) => {
      return await axios.delete(`/delStatus/${deleteId}`);
    },
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries('status')
        setSucss(true)
        setSucssmsg(res.data.nome)
        setShow(true)
      },
      onError: (err) => {
        console.log(err, '3')
      },
    }
  )

  function action(e) {
    const actionId = e.target.getAttribute("data-id")
    const action = e.target.getAttribute("data-action")

    if (action === 'del') {
      delStts(actionId)
    }
  }

  return (
    <>
      <Header />
      <Tabs />
      <Container>
        <div className="main">
          <h2>Status</h2>
          <NewStatus /> {' '}
          <Button className="btn btn-warning" onClick={() => navigate(-1)}>Voltar</Button>
        </div>
        <Table striped bordered hover variant="dark" >
          <thead>
            <tr>
              <th>#ID</th>
              <th>Ações</th>
              <th>Cor</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((status) => {
              return (
                <tr key={status.id}>
                  <td>{status.id.substring(0, 3)}</td>
                  <td>
                    <DropdownButton title="Ação" id="bg-vertical-dropdown-1">
                      <Dropdown.Item 
                        onClick={action} 
                        data-action="del" 
                        data-id={status.id} 
                        eventKey={status.id}
                      >
                        Excluir
                      </Dropdown.Item>
                    </DropdownButton>
                  </td>
                  <td className={status.cor}>{status.cor}</td>
                  <td>{status.nome}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </Container>
      <Footer />
    </>
  );
}

export default Status