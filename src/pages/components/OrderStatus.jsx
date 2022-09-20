import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'

import { ToastContainer, Toast, Form } from "react-bootstrap";

import fechAllStatus from '../../services/statusData'

export default function Status(props) {
  const { data: allStatus } = fechAllStatus()
  const id = props.statusId
  // 
  const [err, setErr] = useState(false);
  const [errmsg, setErrmsg] = useState('');
  const [sucss, setSucss] = useState(false);
  const [sucssmsg, setSucssmsg] = useState('');
  const [showStts, setShowStts] = useState(false);


  const queryClient = useQueryClient();

  const { mutate: editStatus } = useMutation(
    async (status) => {
      return axios.put(`/editSttsOrder/${props.orderId}`, status)
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
      status: form.value,
      nivelAtraso: props.nivelAtrId
    }
    editStatus(status)
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
              <strong className="me-auto">Status</strong>
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
              <strong className="me-auto">Status NFe {sucssmsg}</strong>
            </Toast.Header>
            <Toast.Body>Alterado com Sucesso !!!</Toast.Body>
          </Toast>
        </ToastContainer>
        : null
      }
      <Form noValidate onSubmit={handleSubmit}>
        <Form.Group controlId="status">
          <Form.Select aria-label="Status" id="status" onChange={handleSubmit} defaultValue={id}>
            {allStatus?.map((status) => {
              return (<option key={status.id} value={status.id}>{status.nome}</option>)
            })}
          </Form.Select>
        </Form.Group>
      </Form>
    </>
  )
}

