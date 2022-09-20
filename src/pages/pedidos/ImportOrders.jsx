import React, { useState, useRef, useEffect } from 'react';
import Tabs from '../modules/Tabs';
import Header from '../modules/Header';
import Footer from '../modules/Footer';
import DatePicker, { registerLocale } from 'react-datepicker';
import ptBR from 'date-fns/locale/pt-BR';
registerLocale('pt-BR', ptBR);
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
// import getOrders from '../../services/blingData_bkp'
import { useQuery, useMutation } from 'react-query';
import {v4 as uuidv4} from 'uuid'
import {
    Container, Table, Button,
    Row, Col, Modal,
    ToastContainer, Toast, Spinner, Form, InputGroup
} from "react-bootstrap";

import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

async function fetchData({queryKey}){
    const startDate  = queryKey[1]
    const endDate = queryKey[2]
    const searchNumber = queryKey[3]
    const { data } = await axios.get(`/importOrders/?&start=${startDate}&end=${endDate}&number=${searchNumber}`);
            
    return data
}
const ImportOrders = () => {
    const [searchNumber, setSearchNumber] = useState("")
    const [showAlert, setShowAlert] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(null)
    const [startDate, setStartDate] = useState(new Date(moment().subtract(1, 'days')));
    const [endDate, setEndDate] = useState(new Date());
    const onChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
        if(start && end){
            setStartDateGet(moment(start).format('DD/MM/YYYY'))
            setEndDateget(moment(end).format('DD/MM/YYYY'))
        }else{
            setError('Selecione um período')
            setShowAlert(true)
        }
    }

    function filterByNumber(e){
        const number = e.target.value
        setSearchNumber(number)
      }

    const [startDateGet, setStartDateGet] = useState(moment(new Date()).subtract(1, 'days').format('DD/MM/YYYY'));
    const [endDateget, setEndDateget] = useState(moment(new Date()).format('DD/MM/YYYY'));
    
    const {data, isLoading: loadAll, refetch} = useQuery(['blingOrders', startDateGet, endDateget, searchNumber], fetchData, {
        refetchOnWindowFocus: false,
        enabled: false 
    })
    console.log(data)
    function getSecondWord(w){
        const word = w.split(" ")
        return word[1]
    }

    const { mutate: createOrders, isLoading: mutLoading } = useMutation(
        async (data) => {
        return axios.post('/manyOrders', data)
        },
        {
        onSuccess: (res) => {
            setSuccess(true)
            setShowAlert(true)
        },
        onError: (err) => {
            console.log(err)
            setError(err)
            setShowAlert(true)
        },
        }
    )

    const createData = []

    function addOrders(){
        data?.orders.map((order, index) => {
            let qtdProdutos = order?.pedido.itens?.map((i, index) => {
                let qtd = i.item.quantidade.split('.')
                return  (qtd[0]++)
            })
            let qtdTotal = 0;

            for (let i = 0; i < qtdProdutos.length; i++) {
                qtdTotal += qtdProdutos[i];
            }
            
            let produtos = order?.pedido.itens?.map((i, index) => {
                                let qtd = i.item.quantidade.split('.')
                                let total = qtd[0]
                                return index >= 1 ? " " + total +' Un - '+ i?.item.descricao : total +' Un - '+ i?.item.descricao
                            }).toString()

            const cod_produtos = []
            
            order?.pedido.itens?.map((i, index) => {
                cod_produtos.push(i.item.codigo)
            })
            const products = []

            order?.pedido.itens?.map((i, index) => {
               products.push(
                {
                    id: uuidv4(),
                    erp_code: i.item.codigo,
                    name: i.item.descricao,
                    price: i.item.valorunidade,
                    discount: i.item.descontoItem,
                    quantity: i.item.quantidade
                }
               )
            })

            createData.push({
                id: order?.pedido.numero + "-" + order?.pedido.cliente?.id,
                data_venda: moment(order?.pedido.data).format('YYYY-MM-DDT00:00:00.000Z'),
                produto: produtos,
                codigo_produtos: cod_produtos.join(),
                codigo_venda: order?.pedido.numero,
                volumes: qtdTotal.toString(),
                valor_total: order?.pedido.valorfrete > 0.00 ? order?.pedido.totalprodutos : order?.pedido.totalvenda,
                nome_cliente: order?.pedido.cliente?.nome,
                telefone_cliente: order?.pedido.cliente?.fone,
                cpf_cliente: order?.pedido.cliente?.cnpj,
                cep: order?.pedido.transporte?.enderecoEntrega?.cep,
                endereco: order?.pedido.transporte?.enderecoEntrega?.endereco + " - " + order?.pedido.transporte?.enderecoEntrega?.numero,
                cidade: order?.pedido.transporte?.enderecoEntrega?.cidade,
                bairro: order?.pedido.transporte?.enderecoEntrega?.bairro,
                estado: order?.pedido.transporte?.enderecoEntrega?.uf,
                complemento: order?.pedido.transporte?.enderecoEntrega?.complemento,
                marketplace: {
                    connect: {  
                        nome: order?.pedido.tipoIntegracao === 'Api' 
                                ? 
                                    getSecondWord(order?.pedido.observacaointerna)+"-"+order?.pedido.tipoIntegracao
                                : 
                                order?.pedido.tipoIntegracao+"-"+order?.pedido.intermediador.nomeUsuario
                    }
                },
                status: {
                    connect: { id: data?.status.id },
                },
                empresas: {},
                ocorrencias: {
                    create: {
                        id: uuidv4(),
                        descricao: 'Pedido Criado'
                    },
                },
                products: {
                    create: products
                },
                transportadora: {},
                romaneio: {},
                nivelAtraso: {},
            })
        })
        createOrders(createData)
    }
    return (
        <>
            <Header />
            <Tabs />
            <Container>
                <Modal show={loadAll} animation={false} centered>
                    <Modal.Body>
                        <div className='spiner-container'>
                        <Spinner animation="border" role="status" variant="primary" >
                            <span className="visually-hidden load_margin">Loading...</span>
                        </Spinner>
                        </div>
                    </Modal.Body>
                </Modal>
                <Modal show={mutLoading} animation={false} centered>
                    <Modal.Body>
                        <div className='spiner-container'>
                        <Spinner animation="border" role="status" variant="primary" >
                            <span className="visually-hidden load_margin">Loading...</span>
                        </Spinner>
                        </div>
                    </Modal.Body>
                </Modal>
                {success ?
                    <ToastContainer className="p-3" position="top-end">
                        <Toast className="d-inline-block m-1"
                        bg="success"
                        onClose={() => setShowAlert(false)}
                        show={showAlert} delay={3000} autohide
                        >
                        <Toast.Header>
                            <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                            <strong className="me-auto">Pedidos</strong>
                        </Toast.Header>
                        <Toast.Body>Importados com Sucesso !!!</Toast.Body>
                        </Toast>
                    </ToastContainer>
                    : null
                }
                {error ? (
                    <ToastContainer className="p-3" position="top-end">
                    <Toast className="d-inline-block m-1"
                        bg="danger"
                        onClose={() => setShowAlert(false)}
                        show={showAlert} delay={3000} autohide
                    >
                        <Toast.Header>
                        <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                        <strong className="me-auto">Erro</strong>
                        </Toast.Header>
                        <Toast.Body>{error}</Toast.Body>
                    </Toast>
                    </ToastContainer>
                     ) : null
                }
                <Row>
                    <div className="main-home">
                        <h2>Importar Pedidos</h2>
                    </div>
                </Row>
                <div className="main-home import-orders">
                    <Row>
                        <Col md={5}>
                            <div className="filters">
                                <div className="date">
                                <InputGroup>
                                    <DatePicker
                                        className="form-control"
                                        selected={startDate}
                                        onChange={onChange}
                                        startDate={startDate}
                                        endDate={endDate}
                                        locale="pt-BR"
                                        dateFormat="dd/MM/yyyy"
                                        selectsRange
                                    />
                                    <Button onClick={refetch} >
                                        Buscar por Data
                                    </Button>
                                </InputGroup>
                                </div>
                            </div>
                        </Col>

                        <Col md={4}>
                            <div className='filters'>
                                <InputGroup>
                                    <Form.Control
                                        id="searchNumber"
                                        type="number"
                                        placeholder="Nº do pedido"
                                        onChange={filterByNumber}
                                        value={searchNumber}
                                    />
                                    <Button onClick={refetch} type="submit" id="button-addon2">
                                        Buscar por Nº
                                    </Button>
                                </InputGroup>
                            </div>
                        </Col>

                        <Col md={3}>
                            <div className="">
                                <div className="filters">
                                    <Button variant="success" onClick={addOrders}>Salvar Pedidos</Button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>

                <Row>
                    <Table responsive striped bordered hover variant="dark">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Cliente</th>
                                <th>Produto</th>
                                <th>Data Venda</th>
                                <th>Marketplace</th>
                            </tr>
                        </thead>
                        <tbody>
                            { loadAll ? <tr><td colSpan={5}><span>load</span></td></tr>  :
                                !data ? <tr><td colSpan={5}><span>Importe os pedidos</span></td></tr> :
                                data?.orders.map((order, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{order?.pedido.cliente?.nome}</td>
                                        <td>
                                            {order?.pedido.itens?.map((i, index) => {
                                                let qtd = i.item.quantidade.split('.')
                                                let total = qtd[0]
                                                return(
                                                    <span key={index}>{total}un - {i?.item.descricao}</span>
                                                )
                                                })
                                            }
                                        </td>
                                        <td>{moment(order?.pedido.data).format("DD/MM/YYYY")}</td>
                                        <td>{
                                                order?.pedido.tipoIntegracao === 'Api' 
                                                ? 
                                                    getSecondWord(order?.pedido.observacaointerna)
                                                : 
                                                order?.pedido.tipoIntegracao
                                            }
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </Row>
            </Container>
            <Footer />
        </>
    )
}


export default ImportOrders