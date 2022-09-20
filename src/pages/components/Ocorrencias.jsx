import React, { useState, useRef } from 'react'
import { useQueryClient, useMutation } from 'react-query'
import axios from 'axios'
import { Button, Form, Modal, Table, Tooltip, OverlayTrigger, Alert, Badge } from "react-bootstrap";

import fechAllOcorrencias from '../../services/ocorrenciaData'
import Moment from 'moment';
import NivelAtraso from './NivelAtraso'
import NivelAtrasoEdit from './NivelAtrasoEdit'
import OrderNvAtraso from './OrderNvAtraso'
import { Formik } from 'formik';
import * as Yup from 'yup';
import LoadSpinner from './LoadSpinner'
import '../assets/ocorrenciasStyle.css'

export default function Ocorrencias(props) {
  const [show, setShow] = useState(false);
  const [err, setErr] = useState(false);
  const [errmsg, setErrmsg] = useState('');
  const [sucss, setSucss] = useState(false);
  const [sucssmsg, setSucssmsg] = useState('');
  const [showOcc, setShowOcc] = useState(false);
  const queryClient = useQueryClient();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const oId = props.orderId
  const { data: ocorre, isLoading: loadOcc } = fechAllOcorrencias(oId)
  Moment.locale('pt-br');

  const { mutate: addOcc, isLoading: loadAddOcc } = useMutation(
    async (occ) => {
      return axios.post(`/newOcorrencia/${oId}`, occ)
    },
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries('ocorrencias')
        setSucss(true)
        setErr(false)
        setSucssmsg('adicionada')
      },
      onError: (err) => {
        setErrmsg(err.response.data.error)
        setSucss(false)
        setErr(true)
      },
    }
  )


  const submitOcc = (e) => {
    const form = { descricao: e.descricao }
    addOcc(form)
  };

  const schema = Yup.object().shape({
    descricao: Yup.string(),
  });


  const { mutate: delOcorrencia } = useMutation(
    async (deleteId) => {
      return await axios.delete(`/delOcorrencia/${deleteId}`);
    },
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries('ocorrencias')
        setSucss(true)
        setErr(false)
        setSucssmsg('deletada')
      },
      onError: (err) => {
        setErrmsg(err.response.data.error)
        setSucss(false)
        setErr(true)
      },
    }
  )

  function delOcc(e) {
    const actionId = e.target.getAttribute("data-id")
    delOcorrencia(actionId)
  }

  //Setup Upload File

  // const filesElement = useRef(null);
  // const handleSubmit = async (event) => {
  //   const dataForm = new FormData();
  //   for (const file of filesElement.current.files) {
  //     dataForm.append('file', file);
  //   }
  //   const res = await axios.post(`/upload`, dataForm);

  //  
  // }

  return (
    <>
      <OverlayTrigger
        overlay=
          {
            <Tooltip>
              {props.lastOcc}
            </Tooltip>
          }
        placement="left"
      >
        <Button variant="primary" onClick={handleShow}>
          Exibir
        </Button>
      </OverlayTrigger>
      

      <Modal size="lg" className="modal-ocorr" key={props.orderId} show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Ocorrências - {props.clientName}</Modal.Title>
        </Modal.Header>
        <Modal.Body className='m-body-occ'>
          <div className='form-nivel-alerta'>
            <NivelAtraso />
            <NivelAtrasoEdit />
          </div>
          <Table striped bordered variant="dark" responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>NFe</th>
                <th>Data Venda</th>
                <th>Prev. Entrega</th>
                <th>Transportadora</th>
                <th>Nível Atraso</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><Badge bg="dark" text="light">{oId.substring(0, 3)}</Badge></td>
                <td><Badge bg="light" text="dark">{props.nfe}</Badge></td>
                <td>{props.dataVenda}</td>
                <td>{props.prevEntrega}</td>
                <td>{props.transp}</td>
                <td><OrderNvAtraso orderId={oId} nvId={props.nivelAtrId} /></td>
              </tr>
            </tbody>
          </Table>
          <Table striped bordered hover variant="dark" responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Ocorrências <span className='th-space'></span></th>
                <th>#</th>
              </tr>
            </thead>
            <tbody>
            {loadOcc ? <tr><td colSpan={3}><LoadSpinner load={loadOcc}/></td></tr> :

              ocorre.length != 0 ?
                ocorre?.map((ocorrencias) => {
                  return (
                    <tr key={ocorrencias.id}>
                      <td><Badge bg="dark" text="light">{ocorrencias.id.substring(0, 3)}</Badge></td>
                      <OverlayTrigger
                        overlay=
                        {
                          <Tooltip id="overlay-example">
                            {Moment(ocorrencias.created_at).add(1, "day").format('DD/MM/YYYY')}
                          </Tooltip>
                        }
                        placement="left"
                      >
                        <td>
                          {ocorrencias.descricao}
                        </td>
                      </OverlayTrigger>
                      <td>
                        {/* <Button onClick={delOcc} variant="danger" data-id={ocorrencias.id}>x</Button> */}
                        <Badge style={{cursor: "pointer"}} bg="danger"onClick={delOcc} data-id={ocorrencias.id} text="light">X</Badge>
                      </td>
                    </tr>
                  )
                })
              : 
              <tr><td></td><td>Sem ocorrência</td><td></td></tr>

            }
            </tbody>
          </Table>
          <div className='form-ocorr'>
            <Formik
              validationSchema={schema}
              onSubmit={submitOcc}
              initialValues={{
                descricao: '',
                // files: null

              }}
            >
              {({
                handleSubmit,
                handleChange,
                handleBlur,
                values,
                touched,
                isValid,
                errors,
              }) => (
                <Form id='form-occ' onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="descricao">
                      <Form.Label>Digite a Ocorrência</Form.Label>
                      <Form.Control
                        as="textarea"
                        placeholder="Ocorrência"
                        rows={3}
                        onChange={handleChange}
                        value={values.descricao}
                        className={touched.descricao && errors.descricao ? "error" : null}
                      />
                      {touched.descricao && errors.descricao ? (
                        <div className="error-message">{errors.descricao}</div>
                      ) : null}
                    </Form.Group>

                    {/* <Form.Group controlId="files" className="mb-3">
                      <Form.Label>Enviar Imagem</Form.Label>
                      <Form.Control 
                        type="file"
                        value={values.files}
                        name="files"
                        ref={filesElement}
                      />
                    </Form.Group> */}

                    <Button variant="success" type="submit">Enviar</Button>
                    {err ? (
                      <Alert md="3" variant="danger" className='div-alert'>
                        {errmsg}
                      </Alert>
                    ) : null}
                    {sucss ?
                      <Alert md="3" variant="success" className='div-alert'>
                        Ocorrência {sucssmsg} com sucesso!!
                      </Alert> : null
                    }
                </Form>
              )}
            </Formik>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

