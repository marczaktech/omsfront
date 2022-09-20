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
import LoadSpinner from '../components/LoadSpinner'

export default function userEditPass() {

    const id = useParams()
    const {data, isLoading} = userData(id.id)
   
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [show, setShow] = useState(false)

    const { mutate: editUser, isLoading: mutLoading } = useMutation(
        async (user) => {
          return axios.put(`/editUserpass/${id.id}`, user)
        },
        {
          onSuccess: (res) => {
            setSuccess(res)
            setShow(true)
          },
          onError: (err) => {
            setError(err)
            setShow(true)
          },
        }
    )
    const eUser = (event) => {
        editUser(event)
    }

    const schema =
        Yup.object().shape({
            password: Yup.string().min(6, 'Muito Curta').max(50, 'Muito Longa').required('Crie uma senha'),
    });

    const initialValues = { password: ''}

    return (
        <>
            <Header />
            <Tabs />
            {isLoading ? <LoadSpinner />: 
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
                                <Toast.Body>Usuário {success.data.emails} Alterado.</Toast.Body>
                            </Toast>
                            </ToastContainer>
                    ) : null}
                    <Row className="justify-content-md-center">
                        <Col md="auto">
                            <div className="container_form">
                                <div className="login_form">

                                    <Formik
                                        validationSchema={schema}
                                        onSubmit={eUser}
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
                                                <div><h2>Editar Senha</h2></div>

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

                                                <Button variant="primary" type="submit">
                                                    Alterar
                                                </Button>
                                            </Form>
                                        )}
                                    </Formik>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            }
            <Footer />
        </>
    );
}