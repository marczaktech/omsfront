import React, {useState} from 'react'
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'


export default function Register({ setToken }) {

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = async e => {
        e.preventDefault();
        const token = await loginUser({
            email,
            password
        });
        setToken(token);
    }

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col md="auto">
                    <div className="container_form">
                        <div className="login_form">
                            <Form onSubmit={handleSubmit}>
                                <Form.Group md={4} controlId="email">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" placeholder="Enter email" onChange={e => setEmail(e.target.value)}/>
                                    <Form.Text className="text-muted" />
                                </Form.Group>

                                <Form.Group md={4} controlId="password">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password" onChange={e => setPassword(e.target.value)}/>
                                </Form.Group>
                                <Form.Group md={4} controlId="formBasicCheckbox">
                                    <Form.Check type="checkbox" label="Check me out" />
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    Entrar
                                </Button>
                            </Form>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}