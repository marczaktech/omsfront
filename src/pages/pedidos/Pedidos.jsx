import React, { useState, useRef, useEffect } from 'react';
import {
  Container, Table,
  DropdownButton, Dropdown,
  Collapse, Button,
  Form, Row,
  Col, Popover,
  OverlayTrigger, Modal,
  ToastContainer, Toast, Spinner, Tooltip, InputGroup, Badge,
  Navbar, Nav, NavDropdown,
} from "react-bootstrap";

import moment from 'moment';
import 'moment/locale/pt-br';
import Tabs from '../modules/Tabs';
import Header from '../modules/Header';

import Ocorrencias from '../components/Ocorrencias'
import OrderStatus from '../components/OrderStatus'
import OrderVideo from '../components/OrderVideo'
import OrderRastreio from '../components/OrderRastreio'
// import PaginationJs from '../components/PaginationJs'
import FormOrder from '../components/FormOrder'
import { useQueryClient, useMutation, useIsFetching } from 'react-query';
import axios from "axios";
import fechAllOrders from '../../services/orderData';
import fechAllMkt from '../../services/mktData';
import fechAllEmp from '../../services/empresaData';
import fetchAllStatus from '../../services/statusData';
import fechAllTr from '../../services/transpData';
import DatePicker, { registerLocale } from 'react-datepicker';
import ptBR from 'date-fns/locale/pt-BR';
registerLocale('pt-BR', ptBR);
import "react-datepicker/dist/react-datepicker.css";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import SelectOrderEmpresas from '../components/SelectOrderEmpresas';
import TooltipOverlay from '../components/TooltipOverlay';

function NewOrder() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Collapse in={open}>
        <div id="newForm">
          <Button
            onClick={() => setOpen(false)}
            variant="outline-danger"
          >
            Fechar
          </Button>
          <FormOrder />
        </div>
      </Collapse>
      <Button
        onClick={() => setOpen(!open)}
        aria-controls="example-collapse-text"
        aria-expanded={open}
        variant="outline-primary"
      >
        Novo Pedido
      </Button>
      
    </>
  );
}
const Pedidos = () => {
  const { data: sts, isFetching:  stsLoad} = fetchAllStatus()
  const { data: marketplaces, isFetching:  mktLoad} = fechAllMkt()
  const { data: empresas, isFetching:  empLoad} = fechAllEmp()
  const { data: transp, isFetching: loadTr} = fechAllTr()

  const queryClient = useQueryClient();
  const [err, setErr] = useState(false);
  const [errmsg, setErrmsg] = useState('');
  const [sucss, setSucss] = useState(false);
  const [sucssmsg, setSucssmsg] = useState('');
  const [showOrder, setShowOrder] = useState(false);
  const [showAlertOrder, setShowAlertOrder] = useState(true);
  const [MsgAtr, setMsgAtr] = useState('');
  const [Atr, setAtr] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [showAlert, setShowAlert] = useState(false);

    // set day alert //
    //checking if have a item called "data" in local storage
    const localStorageDate = localStorage.getItem("data")

    //if false, set a new item in localstorage
    if(!localStorageDate){
      const newDate = moment().format()
      localStorage.setItem("data", JSON.stringify({ newDate }))
    }
    //get a item of localstorage and set a new const
    const storageDate = JSON.parse(localStorageDate).newDate
    //check if past 20 min and set a const to showalert
    const sData = moment(storageDate).fromNow() === "20 minutes ago" ? 'showAlert': 'hideAlert' 

    useEffect(() => {
      if(sData === 'showAlert'){
        setShowAlert(true)
        const newDate = moment().format()
        localStorage.setItem("data", JSON.stringify({ newDate }))
      }else{
        setShowAlert(false)
      }
    }, [])
  
  //Search transp. 
  if(!loadTr){
    const transpData = transp?.filter(tr => { if(tr.nome === "Sem Transportadora"){return {id:tr.id, nome:tr.nome}} })
    const semTransp = transpData[0].id
    localStorage.setItem("transp", JSON.stringify({ semTransp }))
  }
 
    //Filters
    const getFilter = localStorage.getItem("filters")
    
    if(!getFilter){
      const [searchName, setSearchName] = useState(' ')
      const [status, setStatus] = useState(0) 
      const [filterTr, setFilterTr] = useState(0) 
      const [filterEmpresa, setFilterEmpresa] = useState(0) 
      const [filterMKt, setFilterMKt] = useState(0) 
      const [startDate, setStartDate] =useState(new Date(moment().subtract(1, 'day')))
      const [endDate, setEndDate] = useState(new Date())

      localStorage.setItem("filters", JSON.stringify({ searchName,
        status, filterEmpresa,
        filterMKt,startDate, endDate, filterTr }))
    }

    const [searchName, setSearchName] = useState(JSON.parse(getFilter).searchName === 0 ? ' ': JSON.parse(getFilter).searchName)
    const [status, setStatus] = useState(JSON.parse(getFilter).status === 0 ? 0 : JSON.parse(getFilter).status)
    const [filterTr, setFilterTr] = useState(JSON.parse(getFilter).filterTr === 0 ? 0 : JSON.parse(getFilter).filterTr)
    const [filterEmpresa, setFilterEmpresa] = useState(JSON.parse(getFilter).filterEmpresa === 0 ? 0 : JSON.parse(getFilter).filterEmpresa)
    const [filterMKt, setFilterMKt] = useState(JSON.parse(getFilter).filterMKt === 0 ? 0 : JSON.parse(getFilter).filterMKt)
    const [startDate, setStartDate] = useState(JSON.parse(getFilter).startDate === 0 ? new Date(moment().subtract(1, 'day')) : new Date(JSON.parse(getFilter).startDate))
    const [endDate, setEndDate] = useState(JSON.parse(getFilter).endDate === 0 ? new Date(moment().format("YYYY-MM-DD")) : new Date(JSON.parse(getFilter).endDate))

    localStorage.setItem("filters", JSON.stringify({ searchName,
      status, filterEmpresa,
      filterMKt,startDate, endDate, filterTr }))

    const onChange = (dates) => {
      const [start, end] = dates;

      setStartDate(start);
      setEndDate(end);
    };

    const [startDateGet, setStartDateGet] = useState(JSON.parse(getFilter).startDate === 0 ? moment().subtract(1, 'day').format('YYYY-MM-DDT00:00:00.000Z') : moment(JSON.parse(getFilter).startDate).format('YYYY-MM-DDT00:00:00.000Z'));
    const [endDateget, setEndDateget] = useState(JSON.parse(getFilter).endDate === 0 ? moment().format('YYYY-MM-DDT00:00:00.000Z') : moment(JSON.parse(getFilter).endDate).format('YYYY-MM-DDT00:00:00.000Z'))

    function filterBydate(){

      if(startDate && endDate){
        setStartDateGet(moment(startDate).format('YYYY-MM-DDT00:00:00.000Z'))
        setEndDateget(moment(endDate).format('YYYY-MM-DDT00:00:00.000Z'))
      }else{
        setErrmsg('Selecione um período')
        setErr(true)
        setShowOrder(true)
      }
    
    }

    function filterByname(e){
      const name = e.nome_cliente
      setSearchName(name)
    }
    
    function handleStatusChange(e){
      setStatus(e.target.value)
    }
    function handleMktChange(e){
      setFilterMKt(e.target.value)
    }
    function handlefilterEmpresaChange(e){
      setFilterEmpresa(e.target.value)
    }
    function handlefilterTransportadora(e){
      setFilterTr(e.target.value)
    }

    function resetFilters(){
      setSearchName(' ')
      setStatus(0) 
      setFilterTr(0) 
      setFilterEmpresa(0) 
      setFilterMKt(0) 
      setStartDate(new Date(moment().subtract(1, 'day')))
      setEndDate(new Date())
      setStartDateGet(moment().subtract(1, 'day').format('YYYY-MM-DDT00:00:00.000Z'))
      setEndDateget(moment().format('YYYY-MM-DDT00:00:00.000Z'))
    }

 
  
  const ref = useRef(null)

  //get orders data
  const { data, isLoading: loadAll, isFetching: fetchAll } = fechAllOrders(activePage, 
                                                      startDateGet, 
                                                      endDateget, 
                                                      searchName, 
                                                      filterEmpresa,
                                                      filterMKt,
                                                      status,
                                                      filterTr)
  
  const deliveredID = data?.getStatusIdDelivered.id

  //Delete item
  const { mutate: delOrder } = useMutation(
    async (deleteId) => {
      return await axios.delete(`/delOrder/${deleteId}`);
    },
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries('orders')
        setSucss(true)
        setSucssmsg(res.data.nfe)
        setShowOrder(true)
      },
      onError: (err) => {
        console.log(err, '3')
      },
    }
  )

  function action(e) {
    const actionId = e.target.getAttribute("data-id")
    const action = e.target.getAttribute("data-action")

    if (action === 'del') {
      delOrder(actionId)
    }
  }

  function checkImage(src, call1, call2) {
    var img = new Image()
    img.onload = call1
    img.onerror = call2
    img.src = src
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
        <Modal show={fetchAll} animation={false} centered>
          <Modal.Body>
            <div className='spiner-container'>
              <Spinner animation="border" role="status" variant="primary" >
                <span className="visually-hidden load_margin">Loading...</span>
              </Spinner>
            </div>
          </Modal.Body>
        </Modal>
        {err ? (
            <ToastContainer className="p-3" position="top-end">
              <Toast className="d-inline-block m-1"
                bg="danger"
                onClose={() => setShowOrder(false)}
                show={showOrder} delay={3000} autohide
              >
                <Toast.Header>
                  <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                  <strong className="me-auto">Pedido</strong>
                </Toast.Header>
                <Toast.Body>{errmsg}</Toast.Body>
              </Toast>
            </ToastContainer>
          ) : null
        }
        {sucss ?
          <ToastContainer className="p-3" position="top-end">
            <Toast className="d-inline-block m-1"
              bg="success"
              onClose={() => setShowOrder(false)}
              show={showOrder} delay={3000} autohide
            >
              <Toast.Header>
                <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                <strong className="me-auto">Pedido {sucssmsg}</strong>
              </Toast.Header>
              <Toast.Body>Excluído com Sucesso !!!</Toast.Body>
            </Toast>
          </ToastContainer>
          : null
        }
        
        {showAlert ? 
          <ToastContainer className="p-3" position="top-end">
            { data?.orders.map((order) => {
                if(order.statusId != deliveredID){
                  if (moment(order.previsao_entrega).format('YYYY-MM-DD') < moment().format('YYYY-MM-DD')) {
                      return (
                        <Toast key={order.id}
                          bg="danger"
                          onClose={() => setShowAlertOrder(false)}
                          show={showAlertOrder}
                          delay={10000} autohide={true}
                        >
                          <Toast.Header>
                            <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                            <strong className="me-auto">Pedido Atrasado</strong>
                          </Toast.Header>
                          <Toast.Body>
                            Nota Fiscal {order.nfe}
                          </Toast.Body>
                        </Toast>
                      )
                  }
                }
                if(moment(moment(order.previsao_entrega).format("YYYYMMDD"), "YYYYMMDD").fromNow() === 'in 3 days'){
                  return (
                    <Toast key={order.id}
                      bg="primary"
                      onClose={() => setShowAlertOrder(false)}
                      show={showAlertOrder}
                      delay={10000}
                    >
                      <Toast.Header>
                        <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                        <strong className="me-auto">Pedido: {order.nome_cliente}</strong>
                      </Toast.Header>
                      <Toast.Body>
                        Previsão de entrega está próximo!!!
                      </Toast.Body>
                    </Toast>
                  )
                }
              }) 
            }
            
          </ToastContainer>
          : null 
        }
        <div className="main">
          <h2>Pedidos</h2>
          <NewOrder />
          <div className="ordersLink">
            <Button onClick={resetFilters}>Limpar</Button>
            <Link to="/Status" className='btn btn-outline-warning margin-left-btn'>Status</Link>  
            <Link className="btn btn-outline-light margin-left-btn" to={`/PrintBikeList`}>Imprimir Lista</Link>
            <Link className="btn btn-outline-success margin-left-btn" to={`/ImportOrders`}>Importar Pedidos</Link>
          </div>
        </div>
      </Container>
        <div className='padding-table'>
          <div className="main">
            <Navbar bg="dark" variant="dark" expand="lg">
              <Container>
                <Navbar.Toggle aria-controls="orderFilters" />
                <Navbar.Collapse id="orderFilters">
                    <Nav className="me-auto">
                        <Nav.Item>
                          <div className="filterSelect">
                            <Form.Group controlId="filterMkt">
                              <Form.Select aria-label="filterMkt"
                                onChange={handleMktChange}
                                value={filterMKt}
                              >
                                <option value={0}>Todas as Lojas</option>
                                {marketplaces?.map((mkt) => {
                                    const nome = mkt.nome.split("-")
                                    return (<option key={mkt.id} value={mkt.id}>{nome[0]}</option>)
                                })}
                              </Form.Select>
                            </Form.Group>
                          </div>
                        </Nav.Item>
                        <Nav.Item>
                          <div className="ordersAction">
                            <div className="filterSelect">
                              <Form.Group controlId="filterEmpresa">
                                  <Form.Select aria-label="filterEmpresa"
                                    onChange={handlefilterEmpresaChange}
                                    value={filterEmpresa}
                                  >
                                  <option value={0}>Todas Empresas</option>
                                  {empresas?.map((filterEmpresa) => {
                                      return (<option key={filterEmpresa.id} value={filterEmpresa.id}>{filterEmpresa.razao_social}</option>)
                                  })}
                                  </Form.Select>
                              </Form.Group>
                            </div>
                          </div>
                        </Nav.Item>
                        <Nav.Item>
                          <div className="ordersAction">
                            <div className="filterSelect">
                              <Form.Group controlId="status">
                                <Form.Select aria-label="Status"
                                  onChange={handleStatusChange}
                                  value={status}
                                >
                                  <option value={0}>Todos Status</option>
                                  {sts?.map((status) => {
                                      return (<option key={status.id} value={status.id}>{status.nome}</option>)
                                  })}
                                </Form.Select>
                              </Form.Group>
                            </div>
                          </div>
                        </Nav.Item>
                        <Nav.Item>
                          <div className="filterSelect">
                            <Form.Group controlId="filterTr">
                              <Form.Select aria-label="filterTr"
                                onChange={handlefilterTransportadora}
                                value={filterTr}
                              >
                                <option value={0}>Todas Transportadora</option>
                                {transp?.map((tr) => {
                                    return (<option key={tr.id} value={tr.id}>{tr.nome}</option>)
                                })}
                              </Form.Select>
                            </Form.Group>
                          </div>
                        </Nav.Item>
                        <Nav.Item>
                          <div className="ordersAction">
                            <div className="date">
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
                                <Button onClick={filterBydate}>Filtrar</Button>
                            </div>
                          </div>
                        </Nav.Item>
                        <Nav.Item>
                          <div className="ordersAction">
                            <div className="filter-nome">
                              <Formik
                                validationSchema={Yup.object().shape({
                                  nome_cliente: Yup.string()})}
                                onSubmit={filterByname}
                                initialValues={{nome_cliente: searchName}}
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
                                  <Form onSubmit={handleSubmit}>
                                    <div className="filterNome">
                                      <Form.Control
                                          id="nome_cliente"
                                        type="text"
                                        placeholder="Filtrar por Nome"
                                        onChange={handleChange}
                                        value={values.nome_cliente}
                                        aria-describedby="basic-addon2"
                                        className={touched.nome_cliente && errors.nome_cliente ? "error" : null}
                                      />
                                      <Button type="submit" id="button-addon2">
                                        Filtrar
                                      </Button>
                                    </div>
                                    {touched.nome_cliente && errors.nome_cliente ? (
                                        <div className="error-message">{errors.nome_cliente}</div>
                                      ) : null}
                                  </Form>
                                  
                                )}
                              </Formik>
                            </div>
                          </div>
                        </Nav.Item>
                    </Nav>
                </Navbar.Collapse>
              </Container>
            </Navbar>
          </div>
          
          <Table ref={ref} responsive striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>#</th>
                <th>Ações</th>
                <th>Loja</th>
                <th>Empresa <span className='th-space'></span></th>
                <th>Data Venda</th>
                <th>Cliente <span className='th-space'></span></th>
                <th>Produto <span className='th-space'></span><span className='div-product'></span> Número/Série</th>
                <th>Valor Venda</th>
                <th>NFE</th>
                <th>Cotação <span className='div-product'></span> Valor/Frete</th>
                <th>Previsão Entrega</th>
                <th>Transp.</th>
                <th>TOTAL</th>
                <th>Ocorrências</th>
                <th>Cidade</th>
                <th>Video</th>
                <th>Rastreio</th>
                <th>Status <span className='th-space'></span></th>
                <th>Nível Atraso</th>
              </tr>
            </thead>
            <tbody>
              {data?.orders.length != 0 
                ?
                  data?.orders.map((orders, index) => {
                    const lastOcrre =  orders.ocorrencias[orders.ocorrencias.length - 1];
                    const orderId = orders.id
                    const clientName = orders.nome_cliente
                    const statusId = orders.statusId
                    const popover = (
                      <Popover id="popover-basic">
                        <Popover.Header as="h3">{orders.nome_cliente}</Popover.Header>
                        <Popover.Body>
                          <div className='info-client'>
                            <p>Telefone: {orders.telefone_cliente}</p>
                            <p>CPF: {orders.cpf_cliente}</p>
                          </div>
                        </Popover.Body>
                      </Popover>
                    )

                    const cotacao = (
                      <Popover id="popover-basic">
                        <Popover.Header as="h3">MARKETPLACE: {orders.marketplace.nome}</Popover.Header>
                        <Popover.Body>
                          <div className='info-client'>
                            {orders.empresas === null ? <SelectOrderEmpresas id={orders.id}/> : <p>RAZÃO SOCIAL: {orders.empresas.razao_social} </p>}
                            <p>CNPJ REMETENTE: {orders.empresas === null ? "Selecione" : orders.empresas.cnpj }</p>
                            <p>NOME DESTINATÁRIO: {orders.nome_cliente}</p>
                            <p>CPF /CNPJ: {orders.cpf_cliente}</p>
                            <p>-------------------------</p>
                            <p>CEP: {orders.cep}</p>
                            <p>Endereço: {orders.endereco}</p>
                            <p>Bairro: {orders.bairro}</p>
                            <p>Estado: {orders.estado}</p>
                            <p>Complemento: {orders.complemento}</p>
                            <p>-------------------------</p>
                            <p>VOLUMES: {orders.volumes}</p>
                            <p>PESO: 16kg</p>
                            <p>MEDIDAS: A= 78cm L= 22cm C= 146cm</p>
                            <p>MATERIAL: Bicicleta</p>
                          </div>
                        </Popover.Body>
                      </Popover>
                    )

                    const nome_cliente = orders.nome_cliente.split(" (")
                    const mktName = orders.marketplace.nome.split("-")
                   
                    let img = `https://www.bling.com.br/imagens/tela-lojas-virtuais/icons/${mktName[0].toLowerCase()}.svg`
                    return (
                      <tr key={orders.id} className={orders.status.cor}>
                        <td>
                          <Badge bg="dark">
                            <OverlayTrigger
                                overlay=
                                {
                                  <Tooltip id="overlay-example">
                                  {orders.id}
                                  </Tooltip>
                                }
                                placement="right"
                                rootClose
                              >
                                <p><Badge bg="light" text="dark">{index + 1}</Badge> <Badge bg="light" text="dark">ID:{orders.id.substring(0, 4)}</Badge></p>
                              </OverlayTrigger>
                          </Badge>
                        </td>
                        <td>
                          <DropdownButton title="Ação" id="bg-vertical-dropdown-1">
                            <Link className="dropdown-item" to={`/pedidosEdit/${orders.id}`}>Editar</Link>
                            <Dropdown.Item
                              onClick={action}
                              data-action="del"
                              data-id={orders.id}
                              eventKey={orders.id}
                            >
                              Excluir
                            </Dropdown.Item>
                          </DropdownButton>
                        </td>
                        <td>
                          <div className="empre-name-comp">
                            <>
                              <OverlayTrigger
                                overlay=
                                {
                                <Tooltip id="overlay-example">
                                {orders.marketplace.nome}
                                </Tooltip>
                                }
                                placement="right"
                              >   
                                 <p><img width={30} alt={orders.marketplace.nome.substring(0, 4)} src={img}></img></p>
                              </OverlayTrigger>
                              
                            </>
                          </div>
                        </td>
                        <td>
                          <div className="empre-name-comp">
                            {orders.empresas === null 
                              ? <SelectOrderEmpresas id={orders.id}/> 
                              :  
                                <TooltipOverlay 
                                  placement="right" 
                                  tooltipContent={orders.empresas === null ? "Informe um CNPJ" : orders.empresas.cnpj} 
                                  content={orders.empresas.razao_social.substring(0, 10)}
                                />
                            }
                          </div>
                        </td>
                        <td>
                          {moment(orders.data_venda).add(1, 'DAY').format('DD/MM/YYYY')}
                        </td>
                        <td>
                          <OverlayTrigger rootClose trigger="click" placement="right" overlay={popover}>
                            <Button variant="success" style={{fontSize: 12}}> 
                              {nome_cliente[0]}
                            </Button>
                          </OverlayTrigger>
                        </td>
                        <td style={{fontSize: 14}}>
                          <TooltipOverlay 
                            placement="right" 
                            tooltipContent={orders.produto} 
                            content={orders.produto.substring(0, 30)}
                          />
                          <Badge bg="success" text="light">Nº Série:  <Badge bg="light" text="dark">{orders.numero_serie}</Badge></Badge>
                        </td>
                        <td>
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(orders.valor_total)}
                        </td>
                        <td>
                          {!orders.nfe ?  
                          <Badge bg="danger">S/NFe</Badge>
                          : <Badge bg="primary">{orders.nfe}</Badge>}
                        </td>
                        <td>
                          {!orders.transportadoraId ? 
                              <OverlayTrigger rootClose trigger="click" placement="right" overlay={cotacao}>
                                <Button variant="success">Cotação</Button>
                              </OverlayTrigger>
                          :
                            orders.transportadora.nome === "Mercado Envios" ? 
                              <Badge bg="success" text="light">{orders.transportadora.nome}</Badge>
                            :
                            <div style={{fontSize: 14}}>
                              <Badge bg="warning" text="dark">{orders.protocolo_cotacao }</Badge>
                              
                              <Badge bg="success" text="light">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(orders.valor_frete)}</Badge>
                              
                            </div>
                          }
                        </td>
                        <td>{moment(orders.previsao_entrega).add(1, 'DAY').format('DD/MM/YYYY') === "Invalid date" ? <Badge bg="danger">Sem Previsão</Badge> : moment(orders.previsao_entrega).add(1, 'DAY').format('DD/MM/YYYY')}</td>
                        <td>
                          {orders.transportadoraId === null ? <Badge bg="danger" text="light">Não Definida</Badge> : <Badge bg="info" text="dark">{orders.transportadora.nome}</Badge>}
                        </td>
                        <td>
                          {orders.valor_frete ? (
                            new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(orders.valor_frete) + parseFloat(orders.valor_total))
                          ) :
                            new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(orders.valor_total)
                          }
                        </td>
                        <td>
                          <Ocorrencias
                            lastOcc={lastOcrre?.descricao}
                            orderId={orderId}
                            clientName={clientName}
                            prevEntrega={moment(orders.previsao_entrega).add(1, 'DAY').format('DD/MM/YYYY')}
                            dataVenda={moment(orders.data_venda).add(1, 'DAY').format('DD/MM/YYYY')}
                            nfe={orders.nfe}
                            transp={orders.transportadoraId === null ? <span>Não Definida</span> : orders.transportadora.nome}
                            nivelAtrId={orders.nivelAtrasoId}
                          />
                          
                        </td>
                        <td>
                          <TooltipOverlay 
                            placement="left" 
                            tooltipContent={orders.estado} 
                            content={orders.cidade}
                          />
                        </td>
                        <td>
                          <OrderVideo video={orders.video} orderId={orderId} />
                        </td>
                        <td>
                          <OrderRastreio rastreio={orders.rastreio} orderId={orderId} />
                        </td>
                        <td><OrderStatus statusId={statusId} orderId={orderId} nivelAtrId={orders.nivelAtrasoId}/></td>
                        <td>
                          {orders.nivelAtraso ? 
                            <div className="empre-name-comp">
                              <TooltipOverlay 
                                placement="left" 
                                tooltipContent={orders.nivelAtraso.descricao} 
                                content={orders.nivelAtraso.codigo}
                              />
                            </div>
                          : ''}
                        </td>
                      </tr>
                    )
                  })
                :
                  <tr><td colSpan={19}>Nenhum Pedido Encontrado</td></tr>
              }
            </tbody>
            <tfoot>
              {/* <tr>
                <td colSpan={19}>
                  <PaginationJs
                    activePage={activePage}
                    setActivePage={setActivePage}
                    pages={data?.getTotalOrders}
                  />
                </td>
              </tr> */}
              <tr>
                <td colSpan={19}>
                  <Badge bg="warning" text="dark">
                    Total {data?.totalData}
                  </Badge>
                </td>
              </tr>
            </tfoot>
          </Table>
        </div>
    </>
  )
}


export default Pedidos