import React, { useState } from 'react'
import { useQueryClient, useMutation } from 'react-query'
import axios from 'axios'
import {
    Collapse, Button,
    Form, Row,
    Col, Alert
  } from "react-bootstrap";

import { Formik } from 'formik';
import * as Yup from 'yup';


function FormNvAlert(){

    const queryClient = useQueryClient();
    const [show, setShow] = useState(false);
    const [err, setErr] = useState(false);
    const [errmsg, setErrmsg] = useState('');
    const [sucss, setSucss] = useState(false);
    const [sucssmsg, setSucssmsg] = useState('');


    const { mutate: addNvalert, isLoading: loadAddNval } = useMutation(
        async (nv) => {
            return axios.post('/newNivelAtraso', nv)
        },
        {
            onSuccess: (res) => {
                queryClient.invalidateQueries('nvatr')
                setSucss(true)
                setErr(false)
                setSucssmsg('adicionado')
            },
            onError: (err) => {
                setErrmsg(err.response.data.error)
                setSucss(false)
                setErr(true)
            },
        }
    )


    const submitNvAlt = (e) => {
        const form = {
            codigo: e.codigo,
            descricao: e.descricao
        }
        addNvalert(form)
    };
    const schema = Yup.object().shape({
        codigo: Yup.string().required('Digite o Código'),
        descricao: Yup.string().required('Digite a Descrição'),
    });
    return (
        <Formik
            validationSchema={schema}
            onSubmit={submitNvAlt}
            initialValues={{
                codigo: '',
                descricao: '',
            }}
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
                <Form className='form-nv-alert' onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Form.Group  as={Col} md="3" controlId="codigo">
                            <Form.Label>Digite o Código</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ex: 1"
                                required
                                onChange={handleChange}
                                value={values.codigo}
                                className={touched.codigo && errors.codigo ? "error" : null}
                            />
                            {touched.codigo && errors.codigo ? (
                                <div className="error-message">{errors.codigo}</div>
                            ) : null}
                        </Form.Group>
                        <Form.Group as={Col} md="3" controlId="descricao">
                            <Form.Label>Digite a descrição</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ex: Aceitável"
                                required
                                onChange={handleChange}
                                value={values.descricao}
                                className={touched.descricao && errors.descricao ? "error" : null}
                            />
                            {touched.descricao && errors.descricao ? (
                                <div className="error-message">{errors.descricao}</div>
                            ) : null}
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <div>
                            <Button variant="primary" type="submit">Enviar</Button>
                            <Button type="reset" onClick={handleReset} className="margin-left-btn" variant="light">Limpar</Button>
                            {err ? (
                                <Alert md="3" variant="danger" className='div-alert'>
                                    {errmsg}
                                </Alert>
                            ) : null}
                            {sucss ?
                                <Alert md="3" variant="success" className='div-alert'>
                                    Nível de atraso {sucssmsg} com sucesso!!
                                </Alert> : null
                            }
                        </div>
                    </Row>
                </Form>
            )}
        </Formik>
    )
}

function NewNv() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button
          onClick={() => setOpen(!open)}
          aria-controls="example-collapse-text"
          aria-expanded={open}
          variant="primary"
        >
          Novo Nível Atraso
        </Button>
        <Collapse in={open}>
          <div className="form-alert">
            <FormNvAlert />
          </div>
        </Collapse>
      </>
    );
  }
export default function NivelAtraso() {

    return (
        <>
            <NewNv />
        </>
    )
}