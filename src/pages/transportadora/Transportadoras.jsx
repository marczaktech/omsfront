import React, { useState } from 'react';
import {
  Container,
  Table,
  DropdownButton,
  Dropdown,
  Collapse,
  Button,
  Form,
  Row,
  Col,
  Alert,
  ToastContainer,
  Toast,
  Spinner,
  Modal
} from "react-bootstrap";

import Tabs from '../modules/Tabs';
import Footer from '../modules/Footer';
import Header from '../modules/Header';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { useQueryClient, useMutation } from 'react-query';
import axios from "axios";
import { Link } from 'react-router-dom';
import fechAllTr from '../../services/transpData';
import LoadSpinner from '../components/LoadSpinner'

import MaskedInput from "react-text-mask";



function FormTransp() {
  const [err, setErr] = useState(false);
  const [errmsg, setErrmsg] = useState('');
  const [sucss, setSucss] = useState(false);
  const [sucssmsg, setSucssmsg] = useState('');

  const queryClient = useQueryClient();

  const { mutate: addTransp, isLoading: mutLoading } = useMutation(
    async (addTr) => {
      return axios.post('/newTransp', addTr)
    },
    {
      onSuccess: (res) => {
        const result = {
          status: res.status + "-" + res.statusText,
          headers: res.headers,
          data: res.data,
        };
        queryClient.invalidateQueries('transp')
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

  function createTransp(event) {
    const tr = event
    addTransp(tr)
  }

  const schema =
    Yup.object().shape({
      nome: Yup.string().required('Preencha o Nome'),
      telefone: Yup.string().required('Preencha o Telefone'),
      nome_contato: Yup.string().required('Preencha o Nome do Contato')
    });

  const initialValues = { nome: '', telefone: '', nome_contato: '', link: '', cnpj: '' }

  const phoneNumberMask = [
    "(",/[1-9]/, /\d/, ")",
    " ", /\d/, /\d/, /\d/, /\d/,/\d/, "-",
     /\d/, /\d/, /\d/, /\d/
  ]
  return (
    <Formik
      validationSchema={schema}
      onSubmit={ (values, { resetForm }) => {
        createTransp(values)
        
      }}
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
            <Form.Group as={Col} md="4" controlId="telefone">
              <Form.Label>Telefone</Form.Label>
              {/* <Form.Control
                required
                type="text"
                placeholder="00 00000-0000"
                onChange={handleChange}
                value={values.telefone}
                className={touched.telefone && errors.telefone ? "error" : null}
              /> */}
              <MaskedInput
                  mask={phoneNumberMask}
                  id="telefone"
                  placeholder="00 00000-0000" 
                  type="text"
                  onChange={handleChange}
                  value={values.telefone}
                  className={touched.telefone && errors.telefone ? "error form-control" : 'form-control'}
                />
              {touched.telefone && errors.telefone ? (
                <div className="error-message">{errors.telefone}</div>
              ) : null}
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="nome_contato">
              <Form.Label>Pessoa Contato</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Nome Contato"
                onChange={handleChange}
                value={values.nome_contato}
                className={touched.nome_contato && errors.nome_contato ? "error" : null}
              />
              {touched.nome_contato && errors.nome_contato ? (
                <div className="error-message">{errors.nome_contato}</div>
              ) : null}
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="link">
              <Form.Label>Link de Rastreio</Form.Label>
              <Form.Control
                type="text"
                placeholder="Link Rastreio"
                onChange={handleChange}
                value={values.link}
                className={touched.link && errors.link ? "error" : null}
              />
              {touched.link && errors.link ? (
                <div className="error-message">{errors.link}</div>
              ) : null}
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="cnpj">
              <Form.Label>CNPJ</Form.Label>
              <Form.Control
                type="text"
                placeholder="CNPJ"
                onChange={handleChange}
                value={values.cnpj}
                className={touched.cnpj && errors.cnpj ? "error" : null}
              />
              {touched.cnpj && errors.cnpj ? (
                <div className="error-message">{errors.cnpj}</div>
              ) : null}
            </Form.Group>
          </Row>

          <div className='btn-forms mb-3'>
            <Button md="3" type="submit">Enviar</Button>
            <Button type="reset" onClick={handleReset} className="margin-left-btn" variant="light">Limpar</Button>
            <LoadSpinner load={mutLoading} />
            {err ? (
              <Alert  md="3" variant="danger" className='div-alert'>
                {errmsg}
              </Alert>
            ) : null}
            {sucss ? 
                <Alert  md="3" variant="success" className='div-alert'>
                  Transportadora  {sucssmsg} adicionada com sucesso!!
                </Alert> : null
            }
          </div>
        </Form>
      )}
    </Formik>
  );
}

function NewTransp() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(!open)}
        aria-controls="example-collapse-text"
        aria-expanded={open}
        variant="outline-primary"
      >
        Nova Transportadora
      </Button>
      <Collapse in={open}>
        <div id="newForm">
          <FormTransp />
        </div>
      </Collapse>
    </>
  );
}



const Transportadoras = () => {
  const queryClient = useQueryClient();
  const [err, setErr] = useState(false);
  const [errmsg, setErrmsg] = useState('');
  const [sucss, setSucss] = useState(false);
  const [sucssmsg, setSucssmsg] = useState('');
  const [show, setShow] = useState(false);
  
  const { data: getAll, isFecthing, isLoading: loadAll } = fechAllTr()
  
  const { mutate: delTransp } = useMutation(
    async (deleteId) => {
      console.log(deleteId, '1')
      return await axios.delete(`/delTr/${deleteId}`);
    },
    {
      onSuccess: (res) => {
        const result = {
          status: res.status + "-" + res.statusText,
          headers: res.headers,
          data: res.data,
        };
        queryClient.invalidateQueries('transp')
        setSucss(true)
        setSucssmsg(res.data.nome)
        setShow(true)
        console.log(result.data.nome, '2')
      },
      onError: (err) => {
        console.log(err, '3')
      },
    }
  )
  
  function actionTransp(e){
    const actionId = e.target.getAttribute("data-id")
    const action = e.target.getAttribute("data-action")

    if(action === 'del'){
      delTransp(actionId)
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
                  <strong className="me-auto">Transportadora</strong>
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
                    <strong className="me-auto">Transportadora {sucssmsg}</strong>
                  </Toast.Header>
                  <Toast.Body>Excluída com Sucesso !!!</Toast.Body>
                </Toast>
              </ToastContainer>
              : null
          }
        <div className="main">
          <h2>Transportadoras</h2>
          <NewTransp />
        </div>
        <Table striped bordered hover variant="dark" responsive>
          <thead>
            <tr>
              <th>#ID</th>
              <th>Ações</th>
              <th>Nome</th>
              <th>Telefone</th>
              <th>Pessoa Contato</th>
              <th>Link</th>
              <th>CNPJ</th>
            </tr>
          </thead>
          <tbody>
            {loadAll ? <tr><td colSpan={5}>Carregando...</td></tr> :
              getAll.length != 0
              ?
                getAll?.map((transp, index) => {
                  return (
                    <tr key={transp.id}>
                      <td>{transp.id.substring(0, 3)}</td>
                      <td>
                        <DropdownButton title="Ação" id="bg-vertical-dropdown-1" disabled={transp.nome === "Sem Transportadora" ? true : false}>
                          <Link className="dropdown-item" to={`/transportadorasEdit/${transp.id}`}>Editar</Link>  
                          <Dropdown.Item onClick={actionTransp} indexkey={index} data-action="del" data-id={transp.id} eventKey={transp.id}>Excluir</Dropdown.Item>
                        </DropdownButton>
                      </td>
                      <td>{transp.nome}</td>
                      <td>{transp.telefone}</td>
                      <td>{transp.nome_contato}</td>
                      <td>{transp.link}</td>
                      <td>{transp.cnpj}</td>
                    </tr>
                  )
                })
              :
                <tr><td colSpan={5}>Nenhuma transportadora encontrada</td></tr>
              }
          </tbody>
        </Table>
      </Container>
      <Footer />
    </>
  );
}


export default Transportadoras