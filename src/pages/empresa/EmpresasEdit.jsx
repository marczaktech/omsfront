import { empreData } from "../../services/empresaData"
import React, { useState } from 'react';
import { Container, Button, Form, Row, Col, Alert,
} from "react-bootstrap";

import Tabs from '../modules/Tabs';
import Footer from '../modules/Footer';
import Header from '../modules/Header';

import { Formik } from 'formik';
import * as Yup from 'yup';
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios'
import LoadSpinner from '../components/LoadSpinner'
import MaskedInput from "react-text-mask";
import { useValidationsBR } from 'validations-br';
import NumberFormat from 'react-number-format';


const EmpresasEdit = () => {

  const id = useParams()
  const {data} = empreData(id.id)

  const queryClient = useQueryClient();

  const [err, setErr] = useState(false);
  const [errmsg, setErrmsg] = useState('');
  const [sucss, setSucss] = useState(false);
  const [sucssmsg, setSucssmsg] = useState('');

  const { mutate: putempresa, isLoading: mutLoad } = useMutation(
    async (vTr) => {
      return axios.put(`/editEmpresa/${id.id}`, vTr)
    },
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries('empreeOne')
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

  function editEmpre(event) {
    const tr = event
    putempresa(tr)
  }

  const schema =
    Yup.object().shape({
      razao_social: Yup.string().required('Preencha a Razão Social'),
      cnpj: Yup.string().required('Preencha o CNPJ').test(
        "is-cnpj","CNPJ inválido",(value) => useValidationsBR('cnpj', value)),
    });

    const cnpjMask = [
      /\d/, /\d/,".", /\d/,/\d/,/\d/,".", 
      /\d/, /\d/, /\d/,"/", /\d/, /\d/,/\d/, /\d/,"-", /\d/, /\d/,
    ];

  const initialValues = { razao_social: data?.data.razao_social, cnpj: data?.data.cnpj }
    
  return (
    <>
      <Header />
      <Tabs />
      <Container>
        <div className="main">
          <h2>Editar {data?.data.razao_social} </h2>
        </div>
            <Formik
                validationSchema={schema}
                onSubmit={ (values) => {
                    editEmpre(values) 
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
                        {/* <Form.Control
                            required
                            type="text"
                            placeholder="00.000.000/0000-00"
                            onChange={handleChange}
                            value={values.cnpj}
                            className={touched.cnpj && errors.cnpj ? "error" : null}
                        /> */}
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
                    <div className='btn-forms'>
                        <Button type="submit">Enviar</Button>
                        <LoadSpinner load={mutLoad}/>                        
                        <Link md="3"className="margin-left-btn btn btn-secondary" to="/Empresas">Voltar</Link>
                        {err ? (
                            <Alert  md="3" variant="danger" className='div-alert'>
                            {errmsg}
                            </Alert>
                        ) : null}
                        {sucss ? 
                            <Alert  md="3" variant="success" className='div-alert'>
                            Empresa  {sucssmsg} alterada com sucesso!!
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

export default EmpresasEdit