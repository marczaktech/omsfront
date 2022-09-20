import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'

import { ToastContainer, Toast, Form } from "react-bootstrap";

import fechAllEmp from '../../services/empresaData'

export default function SelectOrderEmpresas(props) {
  const id = props.id
  const { data: allEmp } = fechAllEmp()
  // 
  const [err, setErr] = useState(false);
  const [errmsg, setErrmsg] = useState('');
  const [sucss, setSucss] = useState(false);
  const [sucssmsg, setSucssmsg] = useState('');
  const [showStts, setShowStts] = useState(false);


  const queryClient = useQueryClient();

  const { mutate: editEmpresa } = useMutation(
    async (status) => {
      return axios.put(`/editEmpresaOrder/${id}`, status)
    },
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries('orders')
        setSucss(true)
        setErr(false)
        setShowStts(true)
        setSucssmsg(res.data.nfe)
      },
      onError: (err) => {
        setShowStts(true)
        setErrmsg(err.response.data.error)
        setSucss(false)
        setErr(true)
      },
    }
  )

  const handleSubmit = (event) => {

    const form = event.currentTarget;

    const status = {
      empresa: form.value
    }
    editEmpresa(status)
  }

  return (
    <>
      {err ? (
        <ToastContainer className="p-3" position="top-end">
          <Toast
            className="d-inline-block m-1"
            bg="danger"
            onClose={() => setShowStts(false)}
            show={showStts} delay={3000} autohide
          >
            <Toast.Header>
              <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
              <strong className="me-auto">Empresa</strong>
            </Toast.Header>
            <Toast.Body>{errmsg}</Toast.Body>
          </Toast>
        </ToastContainer>
      ) : null}
      {sucss ?
        <ToastContainer className="p-3" position="top-end">
          <Toast
            className="d-inline-block m-1"
            bg="success"
            onClose={() => setShowStts(false)}
            show={showStts} delay={3000} autohide
          >
            <Toast.Header>
              <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
              <strong className="me-auto">Empresa {sucssmsg}</strong>
            </Toast.Header>
            <Toast.Body>Alterado com Sucesso !!!</Toast.Body>
          </Toast>
        </ToastContainer>
        : null
      }
      <Form noValidate onSubmit={handleSubmit}>
        <Form.Group controlId="empresa">
          <Form.Select aria-label="empresa" id="empresa" onChange={handleSubmit}>
            <option>Selecione</option>
            {allEmp?.map((empresa) => {
              return (<option key={empresa.id} value={empresa.id}>{empresa.razao_social}</option>)
            })}
          </Form.Select>
        </Form.Group>
      </Form>
    </>
  )
}

