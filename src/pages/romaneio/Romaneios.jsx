import React, {useState, useContext} from 'react';
import {
  Container, Table,
  DropdownButton, Dropdown,
  Collapse, Button, Form,
  Row, Col, Spinner,
  Accordion, Modal, AccordionContext, 
  useAccordionButton, ToastContainer, Toast, Badge
} from "react-bootstrap";
import DatePicker, {registerLocale} from 'react-datepicker'
import ptBR from 'date-fns/locale/pt-BR'
registerLocale('pt-BR', ptBR)
import "react-datepicker/dist/react-datepicker.css";
import Moment from 'moment'
import Tabs from '../modules/Tabs';
import Footer from '../modules/Footer';
import Header from '../modules/Header';
import fechAllTr from '../../services/transpData';
import fechAllRom, {RomData} from '../../services/romaneioData';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useQueryClient, useMutation } from 'react-query';
import FormRomaneio from './FormRomaneio'
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf'
import axios from 'axios';

import { useNavigate } from 'react-router-dom' 


export function ContextAwareToggle({ children, eventKey, callback }) {
  let navigate = useNavigate()
  const { activeEventKey } = useContext(AccordionContext);

  const decoratedOnClick = useAccordionButton(eventKey,() => callback && callback(eventKey))

  const isCurrentEventKey = activeEventKey === eventKey;

  return (
    <button
      md="3" 
      type={children === "Reiniciar" ? "reset" : null}
      onClick={decoratedOnClick}
      className={children === "Reiniciar" ? 'btn btn-warning margin-left-btn': 'btn btn-primary'}
    >
      {children}
    </button>
  )
}

function FormTransp() {
  const {data} = fechAllTr();
  const [transp, setTransp] = useState(1);
   
  const schematr =
    Yup.object().shape({
      transportadora: Yup.string().required('Preencha a transportadora'),
  });

  const initialValuesTr = { transportadora: '' }

  function getNFe(e){
    const tr = e.transportadora
    setTransp(tr)
  }

  

  return (
    <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Body>
          <Formik
            validationSchema={schematr}
            onSubmit={getNFe}
            initialValues={initialValuesTr}
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

              <Form noValidate onSubmit={handleSubmit} id="form-tr">
                <Row className="mb-3">
                  <Form.Group as={Col} md="3" controlId="transportadora">
                    <Form.Label>Transportadora</Form.Label>
                    <Form.Select 
                      aria-label="Transportadora"
                      onChange={handleChange}
                      value={values.transportadora}
                      className={touched.transportadora && errors.transportadora ? "error" : null}
                    >
                      <option>Selecione a Transportadora</option>
                      { data?.map((transp) => {
                        return (<option key={transp.id} value={transp.id} > {transp.nome} </option>)
                      })}
                    </Form.Select>
                    {touched.transportadora && errors.transportadora ? (
                      <div className="error-message">{errors.transportadora}</div>
                    ) : null}
                  </Form.Group>
                </Row>

                <div className='btn-forms mb-3'>
                  <ContextAwareToggle eventKey="1">Enviar</ContextAwareToggle>
                </div>
              </Form>
            )}
          </Formik>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Body>
          <FormRomaneio tr={transp}/>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

function NewRomaneio() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => setOpen(!open)}
        aria-controls="example-collapse-text"
        aria-expanded={open}
        variant="outline-primary"
      >
        Novo Romaneio
      </Button>
      <Collapse in={open}>
        <div id="newForm">
         <FormTransp />
         </div>
      </Collapse>
    </>
  );
} 
 
const Romaneios = () =>{

  const {data: allRom, isLoading: loadAll} = fechAllRom();
  const queryClient = useQueryClient();
  const [err, setErr] = useState(false);
  const [errmsg, setErrmsg] = useState('');
  const [sucss, setSucss] = useState(false);
  const [sucssmsg, setSucssmsg] = useState('');
  const [show, setShow] = useState(false);

  const { mutate: delRom } = useMutation(
    async (deleteId) => {
      return await axios.delete(`/delRom/${deleteId}`);
    },
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries('romaneios')
        setSucss(true)
        setSucssmsg(res.data.id)
        setShow(true)
      },
      onError: (err) => {
        setErr(true)
        setErrmsg(err)
      },
    }
  )

  function actionmkts(e) {
    const actionId = e.target.getAttribute("data-id")
    const action = e.target.getAttribute("data-action")

    if (action === 'del') {
      delRom(actionId)
    }
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
        {err ? (
          <ToastContainer className="p-3" position="top-end">
            <Toast className="d-inline-block m-1"
              bg="danger"
              onClose={() => setShow(false)}
              show={show} delay={3000} autohide
            >
              <Toast.Header>
                <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                <strong className="me-auto">Romaneio</strong>
              </Toast.Header>
              <Toast.Body>{errmsg}</Toast.Body>
            </Toast>
          </ToastContainer>
        ) : null}
        {sucss ?
          <ToastContainer className="p-3" position="top-end">
            <Toast className="d-inline-block m-1"
              bg="success"
              onClose={() => setShow(false)}
              show={show} delay={3000} autohide
            >
              <Toast.Header>
                <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                <strong className="me-auto">Romaneio</strong>
              </Toast.Header>
              <Toast.Body>Excluído com Sucesso !!!</Toast.Body>
            </Toast>
          </ToastContainer>
          : null
        }
        <div className="main">
          <h2>Romaneios</h2>
          <NewRomaneio />
        </div>
        <Table striped bordered hover variant="dark" responsive>
          <thead>
            <tr>
              <th>Ações</th>
              <th>Pedidos</th>
              <th>NFe's</th>
              <th>Data Coleta</th>
              <th>Volumes</th>
              <th>Transportadora</th>
              <th>Responsável Coleta</th>
            </tr>
          </thead>
          <tbody>
          {loadAll ? <tr><td colSpan={7}>Carregando...</td></tr> :
            allRom?.length != 0 
              ?
                allRom?.map((rom, index) => {
                  console.log(rom.data_coleta)
                  return (  
                    <tr key={rom.id.substring(0, 3)}>
                      <td>
                          <DropdownButton  title="Ação" id="bg-vertical-dropdown-1">
                            <Link className="dropdown-item" to={`/PrintRom/${rom.id}`}>Imprimir</Link>
                            <Link className="dropdown-item" to={`/editRom/${rom.id}`}>Editar</Link>
                            <Dropdown.Item 
                              onClick={actionmkts} 
                              indexkey={index} 
                              data-action="del" 
                              data-id={rom.id} 
                              eventKey={rom.id}>Excluir</Dropdown.Item>
                          </DropdownButton>
                          
                      </td>
                      <td>
                        <Badge bg="secondary" text="light">{rom.order.length}</Badge>
                      </td>
                      <td>
                        {
                          rom.order?.map((order) => {
                            return (
                              <Badge style={{margin: 2}}bg="light" key={order.id} text="dark"> {order.nfe}</Badge>
                            )
                          })
                        }
                      </td>
                      <td>{Moment(rom.data_coleta).add(1, 'day').format('DD/MM/YYYY')}</td>
                      <td><Badge bg="warning" text="dark">{rom.qtd_volumes}</Badge></td>
                      <td><Badge style={{margin: 2}} bg="info" text="dark">{rom.transportadora.nome}</Badge></td>
                      <td>{rom.responsavel_coleta === null ? 'Não informado' : rom.responsavel_coleta }</td>
                    </tr>
                  )
                })
              :
              <tr><td colSpan={7}>Nenhum romaneio encontrado</td></tr>
            }
            
          </tbody>
        </Table>
        </Container>
      <Footer />
    </>
  );
}
export default Romaneios