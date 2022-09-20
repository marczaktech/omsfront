import React, { useState } from 'react';
import {
  Container,
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
import { Link, useParams, useNavigate } from 'react-router-dom';
import {MktData} from '../../services/mktData';
import LoadSpinner from '../components/LoadSpinner'




const Marketplaces = () => {
  const queryClient = useQueryClient();
  let navigate = useNavigate();

  const [err, setErr] = useState(false);
  const [errmsg, setErrmsg] = useState('');
  const [sucss, setSucss] = useState(false);
  const [sucssmsg, setSucssmsg] = useState('');
  const [show, setShow] = useState(false);

  const id = useParams()
  const {data, isFetching: loadAll} = MktData(id.id)

  const { mutate: editMkt, isLoading: mutLoading } = useMutation(
    async (vmkt) => {
      return axios.put(`/editMkt/${id.id}`, vmkt)
    },
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries('mktOne')
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

  function EditarMkt(event) {
    const tr = event
    editMkt(tr)
  }

  const schema =
    Yup.object().shape({
      nome: Yup.string().required('Preencha o Nome')
    });

  const initialValues = { nome: data?.data.nome }

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
          <h2>Marketplace {data?.data.nome} </h2>
        </div>
        <Formik
          validationSchema={schema}
          onSubmit={EditarMkt}
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
                <Button className="btn btn-warning margin-left-btn" onClick={() => navigate(-1)}>Voltar</Button>                <LoadSpinner load={mutLoading} />
                
                {err ? (
                  <Alert md="3" variant="danger" className='div-alert'>
                    {errmsg}
                  </Alert>
                ) : null}
                {sucss ?
                  <Alert md="3" variant="success" className='div-alert'>
                    MarketPlace  {sucssmsg} alterado com sucesso!!
                  </Alert> : null
                }
              </div>
            </Form>
          )}
        </Formik>
      </Container>
      <Footer />
    </>
  );
}

export default Marketplaces