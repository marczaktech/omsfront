import React, { useState } from 'react';
import { Container, Button, Form, Row, Col, Alert,
} from "react-bootstrap";

import Tabs from '../modules/Tabs';
import Footer from '../modules/Footer';
import Header from '../modules/Header';

import { Formik } from 'formik';
import * as Yup from 'yup';
import { Link, useParams } from 'react-router-dom';
import { transpData } from "../../services/transpData"
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios'
import LoadSpinner from '../components/LoadSpinner'



const TransportadorasEdit = () => {

  const id = useParams()
  const {data} = transpData(id.id)
  
  const queryClient = useQueryClient();


  const [err, setErr] = useState(false);
  const [errmsg, setErrmsg] = useState('');
  const [sucss, setSucss] = useState(false);
  const [sucssmsg, setSucssmsg] = useState('');


  const { mutate: putTransp, isLoading: mutLoad } = useMutation(
    async (vTr) => {
      return axios.put(`/editTransp/${id.id}`, vTr)
    },
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries('transpOne')
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

  function editTransp(event) {
    const tr = event
    putTransp(tr)
  }

  const schema =
    Yup.object().shape({
      nome: Yup.string().required('Preencha o Nome'),
      telefone: Yup.string().required('Digite o telefone'),
      nome_contato: Yup.string().required('Preencha o Nome do Contato')
    });

  const initialValues = { nome: data?.data.nome , telefone: data?.data.telefone , nome_contato: data?.data.nome_contato, link: data?.data.link, cnpj: data?.data.cnpj }
  
  return (
    <>
      <Header />
      <Tabs />
      <Container>
        <div className="main">
          <h2>Editar {data?.data.nome}</h2>
        </div>
        <Formik
          validationSchema={schema}
          onSubmit={ (values) => {
            editTransp(values) 
          }}
          initialValues={initialValues}
          enableReinitialize={true}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
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
                  <Form.Control
                    required
                    type="text"
                    placeholder="00 00000-0000"
                    onChange={handleChange}
                    value={values.telefone}
                    className={touched.telefone && errors.telefone ? "error" : null}
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
                <LoadSpinner load={mutLoad}/>
                <Link md="3"className="margin-left-btn btn btn-secondary" to="/Transportadoras">Voltar</Link>
                  {err ? (
                    <Alert  md="3" variant="danger" className='div-alert'>
                      {errmsg}
                    </Alert>
                  ) : null}
                  {sucss ? 
                      <Alert  md="3" variant="success" className='div-alert'>
                        Transportadora  {sucssmsg} alterada com sucesso!!
                      </Alert> 
                    : null
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


export default TransportadorasEdit
