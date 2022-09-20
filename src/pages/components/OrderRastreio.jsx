import React, {useState} from 'react'
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'

import {ToastContainer, Toast, Form} from "react-bootstrap";

export default function Rastreio(props) {
  const id = props.orderId
  //
  const [err, setErr] = useState(false);
  const [errmsg, setErrmsg] = useState('');
  const [sucss, setSucss] = useState(false);
  const [sucssmsg, setSucssmsg] = useState('');
  const [showStts, setShowStts] = useState(false);
  const [isSwitchOn, setIsSwitchOn] = useState(props.rastreio);

  const queryClient = useQueryClient();

  const { mutate: editRastreio } = useMutation(
    async (rastreio) => {
      return axios.put(`/editRastOrder/${id}`, rastreio)
    },
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries('orders')
        setSucss(true)
        setErr(false)
        setShowStts(true)
        if(res.data.nfe){
          setSucssmsg(`NFe ${res.data.nfe}`)
        }else{
          setSucssmsg(`Cliente ${res.data.nome_cliente}`)
        }
      },
      onError: (err) => {
        setShowStts(true)
        setErrmsg(err.response.data.error)
        setSucss(false)
        setErr(true)
      },
    }
  )

  const handleSubmit = () => {
    const change = !isSwitchOn
    setIsSwitchOn(change)
    const v = {rastreio: change}
    editRastreio(v)
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
              <strong className="me-auto">Rastreio</strong>
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
                <strong className="me-auto">Rastreio {sucssmsg}</strong>
              </Toast.Header>
              <Toast.Body>Atualizado com Sucesso !!!</Toast.Body>
            </Toast>
          </ToastContainer>
          : null
      }
      <Form>
        <Form.Switch
          defaultValue={isSwitchOn}
          onChange={handleSubmit}
          id="rastreio"
          checked={isSwitchOn}
        />
      </Form>
    </>
  )
}

