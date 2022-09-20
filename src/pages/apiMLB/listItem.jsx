import React, { useEffect, useState } from 'react';
import {
  Container, Table,
  DropdownButton, Dropdown,
  Collapse, Button, Form,
  Row, Col, ToastContainer, Toast, Spinner, Modal, Alert
} from "react-bootstrap";


import Tabs from '../modules/Tabs';
import Footer from '../modules/Footer';
import Header from '../modules/Header';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import LoadSpinner from '../components/LoadSpinner'
import {useQuery} from 'react-query'

async function getitem({queryKey}) {
    const id = queryKey[1]
    const response = await axios.get(`https://api.mercadolibre.com/items/${id}`)
    return response.data
}

const ListItem = () => {

    const [item, setItem] = useState("MLB1759029197")
    
    function searchItem(){
        setItem(document.getElementById("mlbitem").value)
    }

    const {data, isLoading} = useQuery(['mlbitem', item], getitem)
  return (
    <>
      <Header />
      <Tabs />
      <Container>
        <div className="main">
            <Row>
                <Col>
                    <h2>Listar Item MLB</h2>
                </Col>
            </Row>
        </div>
        <div className='table-listMlb'>
            <Table striped bordered hover variant="dark" responsive>
                <tbody>
                    <tr>
                        <th className='inputItem'>
                            <div className="inputItem">
                                <Form.Group controlId="mlbitem">
                                    <Form.Control
                                        type="text"
                                        placeholder="Digite o Código ex: MLB1759029197 "
                                        required
                                    />
                                </Form.Group>
                            </div>
                            
                        </th>
                        <th>
                            <div className="btn-submit-ml-item">
                                <Button onClick={searchItem}>Enviar</Button>
                            </div>
                        </th>
                        <th>
                            <a href={data?.permalink} target="_blank">{data?.title}</a>
                        </th>
                    </tr>
                </tbody>
            </Table>
        </div>
        <Table striped bordered hover variant="dark" responsive>
            <thead>
                <tr>
                    <th>#ID</th>
                    <th>Variações do Item {data?.id}</th>
                </tr>
            </thead>
            <tbody>
                { isLoading ? <tr><td colSpan={2}><LoadSpinner load={true}></LoadSpinner></td></tr>:
                    data?.variations.map(item => {
                        return (
                          <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.attribute_combinations.map(att => {
                                return (att?.name + ": " + att?.value_name + "  || ")
                            })}</td>
                          </tr>
                        )
                    })
                }
        
            </tbody>
        </Table>
      </Container>
      <Footer />
    </>
  );
}

export default ListItem
