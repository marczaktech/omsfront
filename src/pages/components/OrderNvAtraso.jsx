import React, {useState} from 'react'
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'

import {ToastContainer, Toast, Form} from "react-bootstrap";

import fechAllNvAtr from '../../services/nivelAtrasoData'

export default function OrderNvAtraso(props) {
  const {data: allNvAtr} = fechAllNvAtr()
  const id = props.nvId
  const [err, setErr] = useState(false);
  const [errmsg, setErrmsg] = useState('');
  const [sucss, setSucss] = useState(false);
  const [sucssmsg, setSucssmsg] = useState('');
  const [showStts, setShowStts] = useState(false);


  const queryClient = useQueryClient();

  const { mutate: editNvAtr } = useMutation(
    async (nvAtr) => {
      return axios.put(`/editNvAtrOrder/${props.orderId}`, nvAtr)
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
    
      const nv = {
        nivelAtraso: form.value
      }
      editNvAtr(nv)
    
  };

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
              <strong className="me-auto">Nível Atraso</strong>
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
                <strong className="me-auto">Nível Atraso NFe {sucssmsg}</strong>
              </Toast.Header>
              <Toast.Body>Alterado com Sucesso !!!</Toast.Body>
            </Toast>
          </ToastContainer>
          : null
      }
      <Form noValidate onSubmit={handleSubmit}>
        <Form.Group controlId="nivelAtaso">
          <Form.Select aria-label="nivelAtaso" onChange={handleSubmit} defaultValue={id}>
                <option value="null">Selecione</option>
                {allNvAtr?.map((nvatr) => {
                 
                  return (
                    <option key={nvatr.id} value={nvatr.id}>{nvatr.descricao}</option>
                    )
                })}
              
          </Form.Select>
        </Form.Group>
      </Form>
    </>
  )
}

