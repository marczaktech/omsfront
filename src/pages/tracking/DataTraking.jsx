import React, {useState, useContext} from 'react'
import { Container, Row, Col, Badge, Card } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css'
import {getOrderTrack} from '../../services/orderData'
import fedex from './assets/img/fedex.jpg'
import LoadSpinner from '../components/LoadSpinner'


const Data = (props) =>{
    const cpf = props.cpf
   
    const {data: order, isFetching, isLoading } = getOrderTrack(cpf)

    function getbadgecolor(param){
        switch(param) {
            case 'vermelho':
              return 'danger';
            case 'verde':
              return 'success';
            case 'azul':
              return 'primary';
            case 'laranja':
              return 'warning';
            default:
              return 'secondary';
        }
    }
    function getbadgeTextcolor(param){
        switch(param) {
            case 'vermelho':
              return 'light';
            case 'verde':
              return 'light';
            case 'azul':
              return 'light';
            case 'laranja':
              return 'dark';
            default:
              return 'light';
        }
    }
    return (
        <>
            <Container>
                <Row className="justify-content-md-center">
                    <Col md="auto">
                        <Card text="dark" border="primary">

                            {isFetching ? 
                                <Card.Body>
                                    <Card.Title><LoadSpinner load={isFetching}/></Card.Title>
                                </Card.Body> :
                            
                            order?.data ? 
                                <Card.Body>
                                    <Card.Title><span>Olá {order?.data.nome_cliente} !!!</span></Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted" style={{ textAlign: 'center'}}>Dados para Rastreamento</Card.Subtitle>
                                    
                                    <ul>
                                        {order?.data.transportadora != null ? 
                                            <>
                                                <li>Status: <Badge bg={getbadgecolor(order?.data.status.cor)} text={getbadgeTextcolor(order?.data.status.cor)}>{order?.data.status.nome}</Badge></li>
                                                <li><span>Acesse o Link da Transportadora {order?.data.transportadora.nome }: </span></li>
                                                
                                                    {
                                                        order?.data.transportadora != null 
                                                        ? 
                                                            <li>
                                                                <a target="_blank" href={`http://${order?.data.transportadora.link}`}>{order?.data.transportadora.link}</a>
                                                            </li>
                                                        : null 
                                                    }
                                                <li><span>Informe a Nota Fiscal:</span></li>
                                                <li><Badge bg='warning' text='dark'>{order?.data.nfe}</Badge></li>
                                                
                                                <li><span>Se necessário informe nosso CNPJ:</span></li>
                                                <li>{order?.data.empresas != null ? <Badge bg='warning' text='dark'>{order?.data.empresas.cnpj}</Badge> : null }</li>
                                                {
                                                    order?.data.transportadora.nome === 'Fedex'
                                                    ? 
                                                    <li style={{listStyle: 'none'}}>
                                                        <img
                                                            alt="Logo Forss"
                                                            src={fedex}
                                                            width="100%"
                                                            className="d-inline-block align-top"
                                                        />
                                                    </li>
                                                    : null 
                                                }
                                            </>

                                            :  <li style={{listStyle: 'none', textAlign: 'center'}} ><Badge bg="warning" text='dark'>Pedido em Processamento</Badge></li>}
                                        
                                        {order?.data.tracking_code != null ? <li>Se necessário informe o código de rastreio: {order?.data.tracking_code}</li> : null}
                                    </ul>
                                    
                                
                                </Card.Body>
                            : 
                            
                                <Card.Body>
                                    <Card.Title><span>Nenhum dado encontrado</span></Card.Title>
                                </Card.Body>
                            }
                            
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
}


const DataTracking = (props) => {
  
    const cpf = props.cpf
    
    return (
        <>
            <Data cpf={cpf} />
        </>
    );
}
  
  
export default DataTracking