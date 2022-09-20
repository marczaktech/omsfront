import React, {useState} from 'react'
import { Form, Button, Container, Row, Col,ToastContainer, Toast } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {useMutation} from 'react-query'
import axios from 'axios'
import useAuth from '../../hooks/useAuth';
import {useNavigate, useParams} from 'react-router-dom'
import Tabs from '../modules/Tabs';
import Footer from '../modules/Footer';
import Header from '../modules/Header';
import {userData} from '../../services/userData'
import LoadSpinner from '../../pages/components/LoadSpinner'

export default function userEdit() {
 
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [show, setShow] = useState(false)

    const { mutate: addUser, isLoading: mutLoading } = useMutation(
        async (user) => {
          return axios.post('/newUser', user)
        },
        {
          onSuccess: (res) => {
            setSuccess(res)
            setShow(true)
            setTimeout(() => {
                navigate("/")
            }, 3000)
          },
          onError: (err) => {
            setError(err)
            setShow(true)
            console.log(err, 'err')
          },
        }
    )
    const createUser = (event) => {
        addUser(event)
    }

    const schema =
        Yup.object().shape({
        name: Yup.string().required('Preencha o Nome'),
        email: Yup.string().required('Preencha o E-mail'),
        password: Yup.string().min(6, 'Muito Curta').max(50, 'Muito Longa').required('Crie uma senha'),
        privilege: Yup.number('Selecione o privilégio do usuário').required('Selecione o privilégio do usuário'),
    });

    const initialValues = { name: '', email: '', password: '', privilege: 'selecione'}


    return (
        <>
            <Header />
            <Tabs />
            <Container>
                    {error ? (
                        <ToastContainer className="p-3" position="top-end">
                        <Toast  className="d-inline-block m-1" 
                                bg="danger" 
                                onClose={() => setShow(false)} 
                                show={show} delay={3000} autohide
                        >
                            <Toast.Header>
                            <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                            <strong className="me-auto">Erro</strong>
                            </Toast.Header>
                            <Toast.Body>{error.response.data.error}</Toast.Body>
                        </Toast>
                        </ToastContainer>
                    ) : null}
                    {success ? (
                            <ToastContainer className="p-3" position="top-end">
                            <Toast  className="d-inline-block m-1" 
                                    bg="success" 
                                    onClose={() => setShow(false)} 
                                    show={show} delay={3000} autohide
                            >
                                <Toast.Header>
                                <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                                <strong className="me-auto">Sucesso {success.data.name}</strong>
                                </Toast.Header>
                                <Toast.Body>Usuário {success.data.emails} cadastrado.</Toast.Body>
                            </Toast>
                            </ToastContainer>
                    ) : null}
                    <Row className="justify-content-md-center">
                        <Col md="auto">
                            <div className="container_form">
                                <div className="login_form">

                                    <Formik
                                        validationSchema={schema}
                                        onSubmit={addUser}
                                        initialValues={initialValues}
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

                                            <Form onSubmit={handleSubmit}>
                                                <div><h2>Criar Usuário</h2></div>
                                                <Form.Group as={Col} md={12} className="input-register" controlId="name">
                                                    <Form.Label>Nome</Form.Label>
                                                    <Form.Control 
                                                        type="text" 
                                                        placeholder="Digite seu Nome"
                                                        onChange={handleChange}  
                                                        value={values.name}
                                                        className={touched.name && errors.name ? "error" : null}
                                                    />
                                                    {touched.name && errors.name ? (
                                                        <div className="error-message">{errors.name}</div>
                                                    ) : null}
                                                    <Form.Text className="text-muted" />
                                                </Form.Group>

                                                <Form.Group as={Col} md={12} className="input-register" controlId="email">
                                                    <Form.Label>Email</Form.Label>
                                                    <Form.Control 
                                                        type="email" 
                                                        placeholder="Digite seu E-mail"
                                                        onChange={handleChange}  
                                                        value={values.email}
                                                        className={touched.email && errors.email ? "error" : null}
                                                    />
                                                    {touched.email && errors.email ? (
                                                        <div className="error-message">{errors.email}</div>
                                                    ) : null}
                                                    <Form.Text className="text-muted" />
                                                </Form.Group>

                                                <Form.Group as={Col} md={12} className="input-register" controlId="password">
                                                    <Form.Label>Password</Form.Label>
                                                    <Form.Control 
                                                        type="password" 
                                                        placeholder="Password" 
                                                        onChange={handleChange}  
                                                        value={values.password}
                                                        className={touched.password && errors.password ? "error" : null}
                                                    />
                                                    {touched.password && errors.password ? (
                                                        <div className="error-message">{errors.password}</div>
                                                    ) : null}
                                                </Form.Group>

                                                <Form.Group controlId="privilege">
                                                    <Form.Label>Privilégio</Form.Label>
                                                    <Form.Select 
                                                        aria-label="privilege"
                                                        onChange={handleChange}
                                                        value={values.privilege}
                                                        className={touched.privilege && errors.privilege ? "error" : null}
                                                    >
                                                        <option value='selecione'>Selecione</option>
                                                        <option value={1}>Administrador</option>
                                                        <option value={2}>Usuário</option>
                                                    </Form.Select>
                                                    {touched.privilege && errors.privilege ? (
                                                    <div className="error-message">{errors.privilege}</div>
                                                    ) : null}
                                                </Form.Group>
                                                
                                                <Button variant="primary" type="submit">
                                                    Cadastrar
                                                </Button>
                                            </Form>
                                        )}
                                    </Formik>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            <Footer />
        </>
    );
}