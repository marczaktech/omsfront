import React, {useState, useEffect} from 'react'
import { Form, Button, Container, Row, Col,ToastContainer, Toast,Modal,Spinner } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'
import useAuth from '../../hooks/useAuth';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useMutation } from 'react-query';

export default function Login() {

    const {signin, signed} = useAuth()
    const navigate = useNavigate()
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("")
    const [show, setShow] = useState(false)
    const location = useLocation();

    const userToken = localStorage.getItem("user_token");

    const { mutate: login, isLoading: mutLoading } = useMutation(
        async (user) => {
          return axios.post('/checkUser', user)
        },
        {
          onSuccess: (res) => {
            signin(res.data.email, res.data.id, res.data.privilege)
            navigate("/home")
          },
          onError: (err) => {
            setError(err)
            setShow(true)
          },
        }
    )

    const loginUser = (event) => {
        login(event)
    }

    const schema =
        Yup.object().shape({
        email: Yup.string().required('Digite seu E-mail'),
        password: Yup.string().required('Digite sua Senha'),
    });

    const initialValues = { email: '', password: ''}

    return (
        userToken === null ?  
            <div className="loginPage">
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
                    <Row className="justify-content-md-center">
                        <Col md="auto">
                            <div className="container_form">
                                <div className="login_form">
                                    <Formik
                                        validationSchema={schema}
                                        onSubmit={loginUser}
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
                                                <div><h2>Login</h2></div>
                                                <Form.Group md={4} controlId="email">
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

                                                <Form.Group md={4} controlId="password">
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
                                                
                                                <Row>
                                                    <Col>
                                                        <Button variant="primary" type="submit">
                                                            Entrar
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </Form>
                                        )}
                                    </Formik>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        :                                    
        <>
            <Container>
                <Modal show={true} animation={false} centered>
                    <Modal.Body>
                        <div className='spiner-container'>
                            <Spinner animation="border" role="status" variant="primary" >
                                <span className="visually-hidden load_margin">Loading...</span>
                            </Spinner>
                        </div>
                        <div className="spiner-container">
                            {location.pathname === "/" ? <Link to="/home">Home</Link> : ""}
                        </div>
                    </Modal.Body>
                </Modal>
            </Container>
        </>
        
    );
}