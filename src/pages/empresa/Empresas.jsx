import React, { useState } from 'react';
import {
  Container, Table,
  DropdownButton, Dropdown,
  Collapse, Button, Form,
  Row, Col, ToastContainer, Toast, Spinner, Modal, Alert
} from "react-bootstrap";

import { Formik } from 'formik';
import * as Yup from 'yup';

import Tabs from '../modules/Tabs';
import Footer from '../modules/Footer';
import Header from '../modules/Header';
import { useQueryClient, useMutation } from 'react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import MaskedInput from "react-text-mask";
import { useValidationsBR } from 'validations-br';
import NumberFormat from 'react-number-format';

import fechAllEmp from '../../services/empresaData';
import LoadSpinner from '../components/LoadSpinner'




function FormEmp() {
  const [err, setErr] = useState(false);
  const [errmsg, setErrmsg] = useState('');
  const [sucss, setSucss] = useState(false);
  const [sucssmsg, setSucssmsg] = useState('');

  const queryClient = useQueryClient();

  const { mutate: addEmpre, isLoading: mutLoading } = useMutation(
    async (addEmp) => {
      return axios.post('/newEmpresa', addEmp)
    },
    {
      onSuccess: (res) => {
        const result = {
          status: res.status + "-" + res.statusText,
          headers: res.headers,
          data: res.data,
        };
        queryClient.invalidateQueries('empr')
        setSucss(true)
        setErr(false)
        setSucssmsg(res.data.razao_social)
      },
      onError: (err) => {
        setErrmsg(err.response.data.error)
        setSucss(false)
        setErr(true)
      },
    }
  )

  function createEmpresa(event) {
    const emp = event
    addEmpre(emp)
  }

  const schema =
    Yup.object().shape({
      razao_social: Yup.string().required('Preencha a Razão Social'),
      cnpj: Yup.string().required('Preencha o CNPJ').test(
        "is-cnpj","CNPJ inválido",(value) => useValidationsBR('cnpj', value)),
    });

  const initialValues = { razao_social: '', cnpj: '', }

  const cnpjMask = [
    /\d/, /\d/,".", /\d/,/\d/,/\d/,".", 
    /\d/, /\d/, /\d/,"/", /\d/, /\d/,/\d/, /\d/,"-", /\d/, /\d/,
  ];


  return (

    <Formik
      validationSchema={schema}
      onSubmit={createEmpresa}
      initialValues={initialValues}
      enableReinitialize
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

        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} md="4" controlId="razao_social">
              <Form.Label>Razão Social</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Razão Social"
                onChange={handleChange}
                value={values.razao_social}
                className={touched.razao_social && errors.razao_social ? "error" : null}
              />
              {touched.razao_social && errors.razao_social ? (
                <div className="error-message">{errors.razao_social}</div>
              ) : null}
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="cnpj">
              <Form.Label>CNPJ</Form.Label>
              <MaskedInput
                mask={cnpjMask}
                id="cnpj"
                placeholder="00.000.000/0000-00"
                type="text"
                onChange={handleChange}
                value={values.cnpj}
                required
                className={touched.cnpj && errors.cnpj ? "error form-control" : 'form-control'}
              />
              
              {touched.cnpj && errors.cnpj ? (
                <div className="error-message">{errors.cnpj}</div>
              ) : null}
            </Form.Group>
          </Row>
          <div className='btn-forms mb-3'>
            <Button type="submit">Enviar</Button>
            <Button type="reset" onClick={handleReset} className="margin-left-btn" variant="light">Limpar</Button>
            <LoadSpinner load={mutLoading} />
            {err ? (
              <Alert  md="3" variant="danger" className='div-alert'>
                {errmsg}
              </Alert>
            ) : null}
            {sucss ? 
                <Alert  md="3" variant="success" className='div-alert'>
                  Empresa  {sucssmsg} adicionada com sucesso!!
                </Alert> : null
            }
          </div>
        </Form>
      )}
    </Formik>

  )
}

function NewEmp() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(!open)}
        aria-controls="example-collapse-text"
        aria-expanded={open}
        variant="outline-primary"
      >
        Nova Empresa
      </Button>
      <Collapse in={open}>
        <div id="newForm">
          <FormEmp />
        </div>
      </Collapse>
    </>
  );
}

const EmpresasPage = () => {

  const queryClient = useQueryClient();
  const [err, setErr] = useState(false);
  const [errmsg, setErrmsg] = useState('');
  const [sucss, setSucss] = useState(false);
  const [sucssmsg, setSucssmsg] = useState('');
  const [show, setShow] = useState(false);

  const { data: getAll, isFecthing, isLoading: loadAll } = fechAllEmp()

  const { mutate: delEmpre } = useMutation(
    async (deleteId) => {
      return await axios.delete(`/deltEmpresas/${deleteId}`);
    },
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries('empr')
        setSucss(true)
        setSucssmsg(res.data.razao_social)
        setShow(true)
      },
      onError: (err) => {
        setErr(true)
        setErrmsg(err)
      },
    }
  )

  function actionempre(e){
    const actionId = e.target.getAttribute("data-id")
    const action = e.target.getAttribute("data-action")

    if(action === 'del'){
      delEmpre(actionId)
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
                  <strong className="me-auto">Empresa</strong>
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
                    <strong className="me-auto">Empresa {sucssmsg}</strong>
                  </Toast.Header>
                  <Toast.Body>Excluída com Sucesso !!!</Toast.Body>
                </Toast>
              </ToastContainer>
              : null
          }
        <div className="main">
          <h2>Empresa</h2>
          <NewEmp />
        </div>
        <Table striped bordered hover variant="dark" responsive>
          <thead>
            <tr>
              <th>#ID</th>
              <th>Ações</th>
              <th>Empresa</th>
              <th>CNPJ</th>
            </tr>
          </thead>
          <tbody>
            {loadAll ? <tr><td colSpan={3}>Carregando...</td></tr> :
            getAll.length != 0 
              ?
                getAll?.map(empr => {
                  return (
                    <tr key={empr.id}>
                      <td>{empr.id.substring(0, 3)}</td>
                      <td>
                        <DropdownButton title="Ação" id="bg-vertical-dropdown-1">
                          <Link className="dropdown-item" to={`/empresasEdit/${empr.id}`}>Editar</Link> 
                          <Dropdown.Item onClick={actionempre} data-action="del" data-id={empr.id}  data-tag="del">Excluir</Dropdown.Item>
                        </DropdownButton>
                      </td>
                      <td>{empr.razao_social}</td>
                      <td>{empr.cnpj}</td>
                    </tr>
                  )
                })
              :
              <tr><td colSpan={4}>Nenhuma Empresa encontrada</td></tr>
            }
          </tbody>
        </Table>
      </Container>
      <Footer />
    </>
  );
}

export default EmpresasPage