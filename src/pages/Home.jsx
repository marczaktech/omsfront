import React, { useState, useRef } from 'react';

import Tabs from './modules/Tabs';
import Footer from './modules/Footer';
import Header from './modules/Header';

import {statusHome} from "../services/statusData";
import { fetchAllTrHome } from "../services/transpData";
import { mktHome } from "../services/mktData";
import LoadSpinner from "./components/LoadSpinner"
import { 
  Container, 
  Row, Col, 
  Button, ToastContainer, 
  Toast, Table, 
  Badge, Accordion } from "react-bootstrap";
import moment from 'moment';
import DatePicker, { registerLocale } from 'react-datepicker';
import ptBR from 'date-fns/locale/pt-BR';
registerLocale('pt-BR', ptBR);
import "react-datepicker/dist/react-datepicker.css";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { Doughnut, Bar, Pie, Line, Chart} from 'react-chartjs-2';
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale,
LinearScale,
BarElement,
Title, PointElement,
LineElement);

import ReactToPrint from 'react-to-print';


const Home = () => {
  const [error, setError] = useState("");
  const [show, setShow] = useState(false)

  const [startDate, setStartDate] = useState(new Date(moment().subtract(7, 'days')));
  const [endDate, setEndDate] = useState(new Date());
  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };


  const [startDateGet, setStartDateGet] = useState(moment(new Date()).subtract(7, 'days').format('YYYY-MM-DDT00:00:00.000Z'));
  const [endDateget, setEndDateget] = useState(moment(new Date()).format('YYYY-MM-DDT00:00:00.000Z'));
  
  function filterBydate(){

    if(startDate && endDate){
      setStartDateGet(moment(startDate).format('YYYY-MM-DDT00:00:00.000Z'))
      setEndDateget(moment(endDate).format('YYYY-MM-DDT00:00:00.000Z'))
    }else{
      setError('Selecione um período')
      setShow(true)
    }
    
  }

  const { data: dataStatus, isFetching: fetchStt, isLoading: loadStt, isFetched: fechtedStt} = statusHome(startDateGet, endDateget)
  const { data: dataTransp, isFetching: fetchTr, isLoading: loadTr, isFetched:fechtedTr } = fetchAllTrHome(startDateGet, endDateget)
  const { data: dataMkt, isFetching: fetchMkt, isLoading: loadMkt, isFetched: fechtedMkt } = mktHome(startDateGet, endDateget)

  // console.log(dataMkt)
  const data = {
    labels: dataStatus?.map(status => {
      return [status.nome]
    }),
    datasets: [
      {
        label: 'Status Pedidos',
        data: dataStatus?.map(status => {
          return [status.order.length]
        }),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  function randomInteger(max, min) {
    // find diff
    let difference = max - min

    // generate random number 
    let rand = Math.random()

    // multiply with difference 
    rand = Math.floor( rand * difference)

    // add with min value 
    rand = rand + min

    return rand
  }

  function randomRgbColor() {
    let r = randomInteger(114, 43)
    let g = randomInteger(190, 68)
    let b = randomInteger(252, 233)
    return [r,g,b]
  }

  const setChartColor = {
    plugins: {
      legend: {
        labels: {
          color: '#fff'
        }
      },
      title: {
        color: '#fff'
      },
      subtitle: {
        display: true,
        color: '#fff'
      }
    },
    scales: {
      x: {
          grid: {
              color: "#939ec8",
          }
      },
      y: {
          grid: {
              color: "#939ec8",
          }   
      }
    }
  }
 
  const dataMKtChart = {
    labels: [`Vendas entre ${moment(startDateGet).format('DD/MM/YYYY')} a ${moment(endDateget).format('DD/MM/YYYY')}`],
    datasets: 
      dataMkt?.data.map(mkt => {
        const rgb = `rgb(${randomRgbColor()})`
        const dMkt = dataMkt?.data.filter(m => m.id === mkt.id)
        const res = dMkt[0]?.order.length
        const nome = mkt.nome.split("-")
        let data =
          {
            type: 'bar',
            label: nome[0],    
            data: [res],
            backgroundColor: rgb
          }
          return data
      })
  }

  const optionsTr = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff'
       }
      },
      title: {
        color: '#fff'
      },
      subtitle: {
        display: true,
        color: '#fff'
      }
    },
    scales: {
      x: {
          grid: {
              color: "#939ec8",
              
          }
      },
      y: {
          grid: {
              color: "#939ec8",
              
          }   
      }
    }
  };

  const dataTr = {
    labels: dataTransp?.data.map(tr => {
      return [tr.nome]
    }),
    datasets: [
      {
        label: 'Atrasado',
        data: dataTransp?.trDelayed.map(tr => tr.order.length),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Entregue',
        data: dataTransp?.trDelivered.map(tr => tr.order.length),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  }

  

  function currencyFormatter(value) {
    if (!Number(value)) return ""
  
    const amount = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value)
  
    return `${amount}`
  }

  const ref = React.createRef()
  const refTotalSale = useRef()
  const refTotalWarrant = useRef()
  const refTotalReturn = useRef()
  const refTotalShip = useRef()

  const totalTranspValue = []
  const totalOrderValue = []
  const totalOrderWarrantyValue = []
  const totalReturnValue = []

  if(fechtedTr){
    dataTransp?.data.map((transp, index) => {
      totalTranspValue.push(transp.order.map(item => parseFloat(item.valor_frete)).reduce((prev, curr) => prev + curr, 0))
    })
  }
  if(fechtedMkt){
    dataMkt?.dataWarranty.map((mkt, index) => {
      totalOrderWarrantyValue.push(mkt.order.map(item => parseFloat(item.valor_total)).reduce((prev, curr) => prev + curr, 0))
    })
    dataMkt?.data.map((mkt, index) => {
      totalOrderValue.push(mkt.order.map(item => parseFloat(item.valor_total)).reduce((prev, curr) => prev + curr, 0))
    })

    dataMkt?.dataProductReturn.map((mkt, index) => {
      totalReturnValue.push(mkt.order.map(item => parseFloat(item.valor_total)).reduce((prev, curr) => prev + curr, 0))
    })
    
  }

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
                    <Toast.Body>{error}</Toast.Body>
                </Toast>
            </ToastContainer>
        ) : null}
        <Row>
          <div className="main-home">
            <h2>Dashboard</h2>
          </div>
          <div className="main-home">
            <div className="filtersHome">
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
          </div>
        </Row>
        <div className="dashboard">
          <Row style={{display: 'flex', alignItems: "center", position: 'relative', background: "#212529", margin: "auto"}}>
            {fetchStt ? <LoadSpinner load={loadStt}/> :
              <Col lg='4'>
                <div className="dashboard-chart">
                  <h2>Status dos Pedidos</h2>
                  <Doughnut data={data} />
                </div>
              </Col>
            }
            <Col lg='4'>
              {!loadMkt ?  <div className="dashboard-chart">
                  <h2>Marketplaces</h2>
                  <Chart type='bar' options={setChartColor} data={dataMKtChart} />
                </div> : null}
            </Col>

            <Col lg='4'>
              <h2>Envios</h2>
              <div className="dashboard-chart">
                <Bar options={optionsTr} data={dataTr} />
              </div>
            </Col>
          </Row>


          <Row>
            <Col lg='12' >
              <Accordion defaultActiveKey="0" style={{padding: 15}}>
                <Accordion.Item  eventKey="0">
                  <Accordion.Header>Relatório de Envios</Accordion.Header>
                  <Accordion.Body>
                  <Row>
                    {fetchTr ? <LoadSpinner load={loadTr}/> :
                      <>
                        <Col lg='12'>
                          <div className="tableReportTr">
                            <h2>Total de Envios  <ReactToPrint
                                      content={() => refTotalShip.current}
                                      documentTitle="Relatorio Envios"
                                      trigger={() => <button className="btn btn-outline-primary">Gerar Pdf</button>}
                                    /></h2>
                            <Table ref={refTotalShip}  bordered hover variant="dark" responsive size="sm" >
                              <thead>
                                <tr>
                                  <th>#ID</th>
                                  <th>Transportadora</th>
                                  <th>R$ Total Frete</th>
                                  <th>Período</th>
                                </tr>
                              </thead>
                              <tbody>
                                {loadTr ? <tr><td colSpan={5}>Carregando...</td></tr> :
                                  dataTransp?.data.length != 0
                                  ?
                                    dataTransp?.data.map((transp, index) => {
                                      return (
                                        <tr key={transp.id}>
                                          <td>{transp.id.substring(0, 3)}</td>
                                          <td>
                                            
                                              <Badge pill bg="secondary">
                                              {transp.nome}
                                              </Badge>
                                              <Badge pill bg="success">
                                              {transp.order.length} Vol.
                                              </Badge>
                                          </td>
                                          <td>
                                            {
                                              
                                              currencyFormatter(transp.order.map(item => parseFloat(item.valor_frete)).reduce((prev, curr) => prev + curr, 0))
                                            }
                                            
                                          </td>
                                          <td>{moment(startDateGet).format('DD/MM/YYYY')} a {moment(endDateget).format('DD/MM/YYYY')}</td>
                                        </tr>
                                      )
                                    })
                                  :
                                    <tr><td colSpan={5}>Nenhuma transportadora encontrada</td></tr>
                                  }
                              </tbody>
                              <tfoot>
                                <tr>
                                  <td></td>
                                  <td><h4 style={{margin: 0}}><Badge bg='warning' text='dark'>Total</Badge></h4></td>
                                  <td><h4 style={{margin: 0}}><Badge bg='success'>{currencyFormatter(totalTranspValue.map(item => parseFloat(item)).reduce((prev, curr) => prev + curr, 0))}</Badge></h4></td>
                                  <td> 
                                  
                                  </td>
                                </tr>
                              </tfoot>
                            </Table>
                          </div>
                        </Col>
                      </>
                    }
                  </Row>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item  eventKey="1">
                  <Accordion.Header>Relatório de Vendas</Accordion.Header>
                  <Accordion.Body>
                    <Row>
                      <Col lg='12'>
                        <div className="tableReportTr">
                          <h2>Total de Vendas   <ReactToPrint
                                      content={() => refTotalSale.current}
                                      documentTitle="Relatório Vendas"
                                      trigger={() => <button className="btn btn-outline-primary">Gerar Pdf</button>}
                                    /></h2>
                          <Table ref={refTotalSale} bordered hover variant="dark" responsive size="sm" >
                            <thead>
                              <tr>
                                <th>#ID</th>
                                <th>Marketplace</th>
                                <th>R$ Total</th>
                                <th>Período</th>
                              </tr>
                            </thead>
                            <tbody>
                              {fetchMkt ? <tr><td colSpan={5}>Carregando...</td></tr> :
                                dataMkt?.data.length != 0
                                ?
                                  dataMkt?.data.map((mkt, index) => {
                                    const nome = mkt.nome.split("-")
                                    return (
                                      <tr key={mkt.id}>
                                        <td>{mkt.id.substring(0, 3)}</td>
                                        <td>
                                          
                                            <Badge pill bg="secondary">
                                            {nome[0]}
                                            </Badge>
                                            <Badge pill bg="success">
                                            <Badge bg="warning" text="dark">{mkt.order.length}</Badge> Pedidos
                                            </Badge>
                                        </td>
                                        <td>
                                          {
                                            currencyFormatter(mkt.order.map(item => parseFloat(item.valor_total)).reduce((prev, curr) => prev + curr, 0))
                                          }
                                          
                                        </td>
                                        <td>{moment(startDateGet).format('DD/MM/YYYY')} a {moment(endDateget).format('DD/MM/YYYY')}</td>
                                      </tr>
                                    )
                                  })
                                :
                                  <tr><td colSpan={5}>Nenhum marketplace encontrado</td></tr>
                                }
                            </tbody>
                            <tfoot>
                                <tr>
                                  <td></td>
                                  <td><h4 style={{margin: 0}}><Badge bg='warning' text='dark'>Total</Badge></h4></td>
                                  <td><h4 style={{margin: 0}}><Badge bg='success'>{currencyFormatter(totalOrderValue.map(item => parseFloat(item)).reduce((prev, curr) => prev + curr, 0))}</Badge></h4></td>
                                  <td> 
                                    
                                  </td>
                                </tr>
                              </tfoot>
                          </Table>
                        </div>
                      </Col>
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
                
                <Accordion.Item  eventKey="2">
                  <Accordion.Header>Relatório de Garantias</Accordion.Header>
                  <Accordion.Body>
                    <Row>
                      <Col lg='12'>
                        <div className="tableReportTr">
                          <h2>Garantias <ReactToPrint
                                      content={() => refTotalWarrant.current}
                                      documentTitle="Relatório de Garantias"
                                      trigger={() => <button className="btn btn-outline-primary">Gerar Pdf</button>}
                                    /></h2>
                          <Table ref={refTotalWarrant} bordered hover variant="dark" responsive size="sm" >
                            <thead>
                              <tr>
                                <th>#ID</th>
                                <th>Marketplace</th>
                                <th>R$ Total</th>
                                <th>Período</th>
                              </tr>
                            </thead>
                            <tbody>
                              {fetchMkt ? <tr><td colSpan={5}>Carregando...</td></tr> :
                                dataMkt?.dataWarranty.length != 0
                                ?
                                  dataMkt?.dataWarranty.map((mkt, index) => {
                                    const nome = mkt.nome.split("-")
                                    return (
                                      <tr key={mkt.id}>
                                        <td>{mkt.id.substring(0, 3)}</td>
                                        <td>
                                          
                                            <Badge pill bg="secondary">
                                            {nome[0]}
                                            </Badge>
                                            <Badge pill bg="warning" text='dark'>
                                            <Badge bg="success" text="light">{mkt.order.length}</Badge> Pedidos
                                            </Badge>
                                        </td>
                                        <td>
                                          {
                                            currencyFormatter(mkt.order.map(item => parseFloat(item.valor_total)).reduce((prev, curr) => prev + curr, 0))
                                          }
                                          
                                        </td>
                                        <td>{moment(startDateGet).format('DD/MM/YYYY')} a {moment(endDateget).format('DD/MM/YYYY')}</td>
                                      </tr>
                                    )
                                  })
                                :
                                  <tr><td colSpan={5}>Nenhum marketplace encontrado</td></tr>
                                }
                            </tbody>
                            <tfoot>
                                <tr>
                                  <td></td>
                                  <td><h4 style={{margin: 0}}><Badge bg='warning' text='dark'>Total</Badge></h4></td>
                                  <td colSpan={1}><h4 style={{margin: 0}}><Badge bg='success'>{currencyFormatter(totalOrderWarrantyValue.map(item => parseFloat(item)).reduce((prev, curr) => prev + curr, 0))}</Badge></h4></td>
                                  <td> 
                                    
                                  </td>
                                </tr>
                              </tfoot>
                          </Table>
                        </div>
                      </Col>
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item  eventKey="4">
                  <Accordion.Header>Relatório de Retorno de produtos</Accordion.Header>
                  <Accordion.Body>
                    <Row>
                      <Col lg='12'>
                        <div className="tableReportTr">
                          <h2>Retorno de produtos <ReactToPrint
                                      content={() => refTotalReturn.current}
                                      documentTitle="Relatório de Devoluções"
                                      trigger={() => <button className="btn btn-outline-primary">Gerar Pdf</button>}
                                    /></h2>

                          <Table ref={refTotalReturn} bordered hover variant="dark" responsive size="sm" >
                            <thead>
                              <tr>
                                <th>#ID</th>
                                <th>Marketplace</th>
                                <th>R$ Total</th>
                                <th>Período</th>
                              </tr>
                            </thead>
                            <tbody>
                              {fetchMkt ? <tr><td colSpan={5}>Carregando...</td></tr> :
                                dataMkt?.dataProductReturn.length != 0
                                ?
                                  dataMkt?.dataProductReturn.map((mkt, index) => {
                                    const nome = mkt.nome.split("-")
                                    return (
                                      <tr key={mkt.id}>
                                        <td>{mkt.id.substring(0, 3)}</td>
                                        <td>
                                          
                                            <Badge pill bg="secondary">
                                            {nome[0]}
                                            </Badge>
                                            <Badge pill bg="danger">
                                            <Badge bg="dark" text="light">{mkt.order.length}</Badge> Pedidos
                                            </Badge>
                                        </td>
                                        <td>
                                          {
                                            currencyFormatter(mkt.order.map(item => parseFloat(item.valor_total)).reduce((prev, curr) => prev + curr, 0))
                                          }
                                          
                                        </td>
                                        <td>{moment(startDateGet).format('DD/MM/YYYY')} a {moment(endDateget).format('DD/MM/YYYY')}</td>
                                      </tr>
                                    )
                                  })
                                :
                                  <tr><td colSpan={5}>Nenhum marketplace encontrado</td></tr>
                                }
                            </tbody>
                            <tfoot>
                                <tr>
                                  <td></td>
                                  <td><h4 style={{margin: 0}}><Badge bg='warning' text='dark'>Total</Badge></h4></td>
                                  <td><h4 style={{margin: 0}}><Badge bg='success'>{currencyFormatter(totalReturnValue.map(item => parseFloat(item)).reduce((prev, curr) => prev + curr, 0))}</Badge></h4></td>
                                  <td></td>
                                </tr>
                              </tfoot>
                          </Table>
                        </div>
                      </Col>
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>      
              </Accordion>
            </Col>
          </Row>

        </div>

      </Container>
      <Footer />
    </>
  );
}

export default Home