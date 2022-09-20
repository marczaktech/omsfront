import React, {useState} from 'react'
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'

import {ToastContainer, Toast, Form} from "react-bootstrap";

export default function Video(props) {
  const id = props.orderId
  //
  const [err, setErr] = useState(false);
  const [errmsg, setErrmsg] = useState('');
  const [sucss, setSucss] = useState(false);
  const [sucssmsg, setSucssmsg] = useState('');
  const [showStts, setShowStts] = useState(false);
  const [isSwitchOn, setIsSwitchOn] = useState(props.video);

  const queryClient = useQueryClient();

  const { mutate: editVideo } = useMutation(
    async (video) => {
      return axios.put(`/editVidOrder/${id}`, video)
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
    const v = {video: change}
    editVideo(v)
    
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
              <strong className="me-auto">Video</strong>
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
                <strong className="me-auto">Video {sucssmsg}</strong>
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
          id="video"
          checked={isSwitchOn}
        />
      </Form>
    </>
  )
}

