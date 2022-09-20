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
import fechAllMkt from '../../services/mktData';
import LoadSpinner from '../components/LoadSpinner'


function FormMkt() {
  const [err, setErr] = useState(false);
  const [errmsg, setErrmsg] = useState('');
  const [sucss, setSucss] = useState(false);
  const [sucssmsg, setSucssmsg] = useState('');

  const queryClient = useQueryClient();

  const { mutate: addMkt, isLoading: mutLoading } = useMutation(
    async (addMkt) => {
      return axios.post('/newMkt', addMkt)
    },
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries('mkts')
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
    const tr = event
    addMkt(tr)
  }

  const schema =
    Yup.object().shape({
      nome: Yup.string().required('Preencha o Nome')
    });

  const initialValues = { nome: '' }

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
                Marketplace  {sucssmsg} adicionado com sucesso!!
              </Alert> : null
            }
          </div>
        </Form>
      )}
    </Formik>
  );
}

function Newmkt() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(!open)}
        aria-controls="example-collapse-text"
        aria-expanded={open}
        variant="outline-primary"
      >
        Novo Marketplace
      </Button>
      <Collapse in={open}>
        <div id="newForm">
          <FormMkt />
        </div>
      </Collapse>
    </>
  );
}


const Marketplaces = () => {
  const queryClient = useQueryClient();
  const [err, setErr] = useState(false);
  const [errmsg, setErrmsg] = useState('');
  const [sucss, setSucss] = useState(false);
  const [sucssmsg, setSucssmsg] = useState('');
  const [show, setShow] = useState(false);

  const { data: getAll, isFecthing, isLoading: loadAll } = fechAllMkt()

  const { mutate: delMkt } = useMutation(
    async (deleteId) => {
      return await axios.delete(`/delMkt/${deleteId}`);
    },
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries('mkts')
        setSucss(true)
        setSucssmsg(res.data.nome)
        setShow(true)
      },
      onError: (err) => {
        setErrmsg(err)
        setErr(true)
      },
    }
  )

  function actionmkts(e) {
    const actionId = e.target.getAttribute("data-id")
    const action = e.target.getAttribute("data-action")

    if (action === 'del') {
      delMkt(actionId)
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
            <Toast className="d-inline-block m-1"
              bg="danger"
              onClose={() => setShow(false)}
              show={show} delay={3000} autohide
            >
              <Toast.Header>
                <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                <strong className="me-auto">MarketPlace</strong>
              </Toast.Header>
              <Toast.Body>{errmsg}</Toast.Body>
            </Toast>
          </ToastContainer>
        ) : null}
        {sucss ?
          <ToastContainer className="p-3" position="top-end">
            <Toast className="d-inline-block m-1"
              bg="success"
              onClose={() => setShow(false)}
              show={show} delay={3000} autohide
            >
              <Toast.Header>
                <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                <strong className="me-auto">MarketPlace {sucssmsg}</strong>
              </Toast.Header>
              <Toast.Body>Excluído com Sucesso !!!</Toast.Body>
            </Toast>
          </ToastContainer>
          : null
        }
        <div className="main">
          <h2>Marketplaces</h2>
          <Newmkt />
        </div>
        <Table striped bordered hover variant="dark" responsive>
          <thead>
            <tr>
              <th>#ID</th>
              <th>Ações</th>
              <th>Nome</th>
            </tr>
          </thead>
          <tbody>
          {loadAll ? <tr><td colSpan={3}>Carregando...</td></tr> :
            getAll?.length != 0 
              ?
                getAll?.map((mkts, index) => {
                  return (
                    <tr key={mkts.id}>
                      <td>{mkts.id.substring(0, 3)}</td>
                      <td>
                        <DropdownButton title="Ação" id="bg-vertical-dropdown-1">
                          <Link className="dropdown-item" to={`/editMkt/${mkts.id}`}>Editar</Link>
                          <Dropdown.Item onClick={actionmkts} indexkey={index} data-action="del" data-id={mkts.id} eventKey={mkts.id}>Excluir</Dropdown.Item>
                        </DropdownButton>
                      </td>
                      <td>{mkts.nome}</td>
                    </tr>
                  )
                })
              :
              <tr><td colSpan={3}>Nenhum Marketplace encontrado</td></tr>
            }
          </tbody>
        </Table>
      </Container>
      <Footer />
    </>
  );
}

export default Marketplaces