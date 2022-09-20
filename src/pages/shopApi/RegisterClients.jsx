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
import { v4 as uuid } from 'uuid'
import {
    Container, Table, Button,
    Row, Col, Modal,
    ToastContainer, Toast, Spinner, Form, InputGroup
} from "react-bootstrap";
import axios from 'axios';

async function getOrders({ queryKey }) {
    const startDate = queryKey[1]
    const endDate = queryKey[2]
    const name = queryKey[3]

    const { data } = await axios.get(`/getOrderToShopApi/?start=${startDate}&end=${endDate}&name=${name}`);
    return data
}
const RegisterClients = () => {
    const [searchName, setSearchName] = useState("")
    const [showAlert, setShowAlert] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(null)
    const [startDate, setStartDate] = useState(new Date(moment().subtract(1, 'days')));
    const [endDate, setEndDate] = useState(new Date());
    const [arraySuccess, setArraySuccess] = useState([])
    const [arrayError, setArrayError] = useState([])


    const onChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
        if (start && end) {
            setStartDateGet(moment(start).format('YYYY-MM-DDT00:00:00.000Z'))
            setEndDateget(moment(end).format('YYYY-MM-DDT00:00:00.000Z'))
        } else {
            setError('Selecione um período')
            setShowAlert(true)
        }
    }

    function filterByNumber(e) {
        const name = e.target.value
        setSearchName(name)
    }

    const [startDateGet, setStartDateGet] = useState(moment(new Date()).subtract(1, 'days').format('YYYY-MM-DDT00:00:00.000Z'));
    const [endDateget, setEndDateget] = useState(moment(new Date()).format('YYYY-MM-DDT00:00:00.000Z'));

    const { data, isLoading, refetch, isFetched } = useQuery(['ImportOrders', startDateGet, endDateget, searchName], getOrders, {
        refetchOnWindowFocus: false,
        enabled: false
    })
    // console.log(data)

    const { mutate: create, isLoading: mutLoading } = useMutation(
        async (data) => {
            return axios.post('/createClient', data)
        },
        {
            onSuccess: (res) => {
                console.log(res)
                setShowAlert(true)
                setArraySuccess(res.data.msgSuccess)
                setArrayError(res.data.msgError)
            },
            onError: (err) => {
                console.log(err)
                setError(err)
                setShowAlert(true)
            },
        }
    )

    const clients = []

    if (isFetched) {
        if (data) {
            data.map(sale => {
                const verifyCpfCnpj = sale.cpf_cliente.length
                const name = sale.nome_cliente.split(' ', sale.nome_cliente.length)
                const fantasia = name.pop()
                clients.push({
                    nome: name.join(" "),
                    fantasia: fantasia,
                    tipo: 'C',
                    fisicaJuridica: verifyCpfCnpj > 11 ? 'J' : 'F',
                    cpfCnpj: sale.cpf_cliente, cep: sale.cep,
                    endereco: sale.endereco,
                    complemento: sale.complemento,
                    bairro: sale.bairro,
                    cidade: sale.cidade,
                    uf: sale.estado,
                    pais: "",
                    telefone1: sale.telefone_cliente,
                    telefone2: null,
                    fax: null,
                    entregaCep: null,
                    entregaEndereco: null,
                    entregaNumero: null,
                    entregaComplemento: null,
                    entregaBairro: null,
                    entregaCidade: null,
                    entregaUf: null,
                    entregaPais: null,
                    entregaPontoRef1: null,
                    entregaPontoRef2: null,
                    faturamentoCep: null,
                    faturamentoEndereco: null,
                    faturamentoNumero: null,
                    faturamentoComplemento: null,
                    faturamentoBairro: null,
                    faturamentoCidade: null,
                    faturamentoUf: null,
                    faturamentoPais: null,
                    faturamentoPontoRef1: null,
                    faturamentoPontoRef2: null,
                    UrlContatos: null,
                })
            })

        }
    }

    function createClient() {
        create(clients)
    }

    return (
        <>
            <Header />
            <Tabs />
            <Container>
                <Modal show={isLoading} animation={false} centered>
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
                            <Toast.Body>Adicionados com Sucesso !!!</Toast.Body>
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
                {arraySuccess.length != 0 ?
                    <ToastContainer className="p-3" position="top-end">
                        {arraySuccess.map((msg, index) => {
                            return (
                                <Toast
                                    key={index}
                                    bg="success"
                                    onClose={() => setShowAlert(false)}
                                    show={showAlert} delay={3000} autohide
                                >
                                    <Toast.Header>
                                        <strong className="me-auto">Importado Com sucesso</strong>
                                    </Toast.Header>
                                    <Toast.Body>{msg}</Toast.Body>
                                </Toast>
                            )
                        })}
                    </ToastContainer>
                    : null}

                {arrayError.length != 0 ?
                    <ToastContainer className="p-3" position="top-end">
                        {arrayError.map((msg, index) => {
                            return (
                                <Toast key={index}
                                    bg="danger"
                                    onClose={() => setShowAlert(false)}
                                    show={showAlert} delay={10000}
                                >
                                    <Toast.Header>
                                        <strong className="me-auto">Erro</strong>
                                    </Toast.Header>
                                    <Toast.Body>{msg}</Toast.Body>
                                </Toast>
                            )

                        })}
                    </ToastContainer>
                    : null}
                <Row>
                    <div className="main-home">
                        <h2>Enviar Clientes para o Shop</h2>
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
                                        id="searchName"
                                        type="text"
                                        placeholder="Nome do Cliente"
                                        onChange={filterByNumber}
                                        value={searchName}
                                    />
                                    <Button onClick={refetch} type="submit" id="button-addon2">
                                        Buscar pelo Nome
                                    </Button>
                                </InputGroup>
                            </div>
                        </Col>

                        <Col md={3}>
                            <div className="">
                                <div className="filters">
                                    {isFetched ?
                                        <Button variant="success" onClick={createClient}>Enviar Cliente{data.length > 1 ? 's': null}</Button>
                                        : null
                                    }

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
                                {/* <th>Produto</th> */}
                                <th>Data Venda</th>
                                {/* <th>Marketplace</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? <tr>
                                <td colSpan={5}>
                                    <Spinner animation="border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </Spinner>
                                </td>
                            </tr> :
                                !data ? <tr><td colSpan={5}><span>Nenhum pedido encontrado, tente outra data ou importe do Bling</span></td></tr> :
                                    data.map((order, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{order.nome_cliente}</td>
                                                {/* <td>
                                                {order?.pedido.itens?.map((i, index) => {
                                                    let qtd = i.item.quantidade.split('.')
                                                    let total = qtd[0]
                                                    return(
                                                        <span key={index}>{total}un - {i?.item.descricao}</span>
                                                    )
                                                    })
                                                }
                                            </td> */}
                                                <td>{moment(order.data_venda).format("DD/MM/YYYY")}</td>
                                                {/* <td>{
                                                    order?.pedido.tipoIntegracao === 'Api' 
                                                    ? 
                                                        getSecondWord(order?.pedido.observacaointerna)
                                                    : 
                                                    order?.pedido.tipoIntegracao
                                                }
                                            </td> */}
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


export default RegisterClients