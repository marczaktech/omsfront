import React, {useState, useContext} from 'react'
import { Form, Button, Container, Row, Col, Navbar, Nav, NavDropdown,
    Accordion, Modal, AccordionContext, 
    useAccordionButton } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'
import logoForss from '../modules/logo_forss.png'
import { Formik } from 'formik';
import * as Yup from 'yup';
import DataTracking from './DataTraking'
import { toSafeInteger } from 'lodash';

export function ContextAwareToggle({ children, eventKey, callback }) {
    const { activeEventKey } = useContext(AccordionContext);
  
    const decoratedOnClick = useAccordionButton(
      eventKey,
      () => callback && callback(eventKey),
    );
  
    const isCurrentEventKey = activeEventKey === eventKey;
  
    return (
      <Button
        type="submit"
        onClick={decoratedOnClick}
        style={{marginTop: 5}}
      >
        {children}
      </Button>
    );
  }
  
  async function getRodo(){

    const encodedParams = new URLSearchParams();
    encodedParams.set('auth_type', 'DEV');
    encodedParams.set('grant_type', 'password');
    encodedParams.set('username', '18841300000169');
    encodedParams.set('password', 'mcz@2021');

    const options = {
        method: 'POST',
        url: 'https://tracking-apigateway.rte.com.br/token',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: encodedParams,
    }

    const result = await axios.request(options)
        .then(function (response) {
            console.log(response.data);
        })
        .catch(function (error) {
            console.error(error);
    })

    return result

  }
const OrderTracking = () =>{

    const [cpfCliente, setCpfCliente] = useState("")

    function getOrder(e){
        setCpfCliente(e.cpf_cliente)
    }

    const schematr =
        Yup.object().shape({
        cpf_cliente: Yup.string().required('Digite o CPF ou CNPJ'),
    });

    const teste = getRodo()

    console.log(teste)

    return (
        <>
            <div className="container_dashboard">
                <div className="menu_dashboard">
                    <Navbar bg="dark" variant="dark" expand="lg">
                        <Container>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="me-auto">
                                    <Navbar.Brand>
                                        <img
                                            alt="Logo Forss"
                                            src={logoForss}
                                            width="40"
                                            height="30"
                                            className="d-inline-block align-top"
                                        />{' '}
                                    </Navbar.Brand>
                                </Nav>
                                
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>
                </div>
            </div>
            <Container>
                <Row className="justify-content-md-center">
                    <Col md="8">
                        <Accordion className="accordion-tracking" defaultActiveKey="0" >
                            <Accordion.Item eventKey="0">
                                <Accordion.Body>
                                    <Formik
                                        validationSchema={schematr}
                                        onSubmit={getOrder}
                                        initialValues={{cpf_cliente: ''}}
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

                                        <Form onSubmit={handleSubmit} id="formTracking">
                                            <Row>
                                                <Form.Group md={4} controlId="cpf_cliente">
                                                    <Form.Label>CPF ou CNPJ</Form.Label>
                                                    <Form.Control 
                                                        requerid="true"
                                                        type="text"
                                                        name="cpf_cliente"
                                                        value={values.cpf_cliente}
                                                        onChange={handleChange}
                                                        placeholder="Digite o CPF ou CNPJ"
                                                    />
                                                    
                                                </Form.Group>
                                            
                                                <Form.Text className="text-muted">
                                                    Somente números.
                                                </Form.Text>
                                                
                                            </Row>
                                            <div>
                                            {touched.cpf_cliente && errors.cpf_cliente ? (
                                                    <div className="error-message">{errors.cpf_cliente}</div>
                                                    ) : <ContextAwareToggle eventKey="1">Rastrear</ContextAwareToggle>}
                                                
                                            </div>
                                        </Form>
                                        )}
                                    </Formik>
                                </Accordion.Body>
                            </Accordion.Item>

                            <Accordion.Item eventKey="1">
                                <Accordion.Body>
                                    <DataTracking cpf={cpfCliente}/>
                                    <ContextAwareToggle eventKey="0">Pesquisar novamente</ContextAwareToggle>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>                   
                    </Col>
                </Row>
            </Container>
        </>
    )
}
export default OrderTracking