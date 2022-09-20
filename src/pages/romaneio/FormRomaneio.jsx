import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom' 
import {
  Alert,
  Button,
  Form,
  Row,
  Col,
} from "react-bootstrap";

import DatePicker, { registerLocale } from 'react-datepicker'
import ptBR from 'date-fns/locale/pt-BR'
registerLocale('pt-BR', ptBR)
import "react-datepicker/dist/react-datepicker.css";


import fechAllTr from '../../services/transpData';
import  { FechDayOrders } from '../../services/orderData';

import { Field, Formik } from "formik";

import { useQueryClient, useMutation } from 'react-query';
import axios from "axios";
import LoadSpinner from '../components/LoadSpinner'
import CustomSelect from "../components/CustomSelect";
import {ContextAwareToggle} from './Romaneios'

const MyEnhancedForm = (props) => {
  const {data} = fechAllTr();
  const {data: ordersDay} = FechDayOrders(props.trId)
  const [startDate, setStartDate] = useState(new Date());
  const [err, setErr] = useState(false);
  const [errmsg, setErrmsg] = useState('');
  const [sucss, setSucss] = useState(false);
  const [sucssmsg, setSucssmsg] = useState('');
  const queryClient = useQueryClient();
  const [show, setShow] = useState(true);
  
  const arraynfe = ordersDay?.map((dayorders) => {
    return ({label: dayorders.nome_cliente +' - '+ dayorders.nfe , value: dayorders.id })
  })
  
  const initialValues = { data_coleta: startDate, transportadora: props.trId , qtd_volumes: '', orders: [ ] }
  const { mutate: addRom, isLoading: mutLoading } = useMutation(
      async (addTr) => {
        return axios.post('/newRom', addTr)
      },
      {
        onSuccess: (res) => {
          queryClient.invalidateQueries('romaneios')
          setSucss(true)
          setErr(false)
          setSucssmsg(res.data.nome)
          reload()
        },
        onError: (err) => {
          setErrmsg(err.response.data.error)
          setSucss(false)
          setErr(true)
        },
      }
    )

    function createRom(event) {
      const rom = event
      console.log(rom)
      addRom(rom)
    }

    let navigate = useNavigate()

    function reload(){
      navigate(0)
    }

  return (
    <>
    <Formik
      onSubmit={createRom}
      initialValues={initialValues}
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
            <Form.Group as={Col} md="2" controlId="data_coleta">
              <Form.Label>Data Coleta</Form.Label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                locale="pt-BR"
                value={values.data_coleta}
                name="data_coleta"
                className="form-control"
                dateFormat="dd/MM/yyyy"
              />
              {touched.data_coleta && errors.data_coleta ? (
                <div className="error-message">{errors.data_coleta}</div>
              ) : null}
            </Form.Group>
            <Form.Group as={Col} md="3" controlId="transportadora">
              <Form.Label>Transportadora</Form.Label>
              <Form.Select aria-label="Transportadora"
                disabled
                onChange={e => { handleChange(e); getNFe(e) }}
                value={values.transportadora}
                className={touched.transportadora && errors.transportadora ? "error" : null}
              >
                <option value={null}>Selecione a Transportadora</option>
                {data?.map((transp) => {
                  return (<option key={transp.id} value={transp.id} > {transp.nome} </option>)
                })}
              </Form.Select>
              {touched.transportadora && errors.transportadora ? (
                <div className="error-message">{errors.transportadora}</div>
              ) : null}
            </Form.Group>
            <Form.Group as={Col} md="4">
              <Form.Label>NFe's</Form.Label>
                <Field
                  className="custom-select"
                  name="orders"
                  id="orders"
                  options={arraynfe}
                  component={CustomSelect}
                  placeholder="Selecione as Notas"
                  isMulti={true}
                  value={values.orders}
                />
              {touched.orders && errors.orders ? (
                <div className="error-message">{errors.orders}</div>
              ) : null}
            </Form.Group>
            <Form.Group as={Col} md="3" controlId="qtd_volumes">
              <Form.Label>Quantidade Volumes</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Volumes"
                onChange={handleChange}
                value={values.qtd_volumes}
                className={touched.qtd_volumes && errors.qtd_volumes ? "error" : null}
              />
              {touched.qtd_volumes && errors.qtd_volumes ? (
                <div className="error-message">{errors.qtd_volumes}</div>
              ) : null}
            </Form.Group>

          </Row>

          <div className='btn-forms mb-3'>
            <Button md="3" type="submit">Enviar</Button>
            
            {/* <Button type="reset" onClick={handleReset} className="margin-left-btn" variant="light">Limpar</Button>  */}
            <Button type="reset" className="margin-left-btn" variant="warning" onClick={reload}>Reiniciar</Button>

            <LoadSpinner load={mutLoading} />
            {err ? (
              <Alert md="3" variant="danger" className='div-alert' onClose={() => setShow(false)} dismissible>
                {errmsg}
              </Alert>
            ) : null}
            {sucss ?
              <Alert md="3" variant="success" className='div-alert' onClose={() => setShow(false)} dismissible>
                Romaneio  {sucssmsg} adicionado com sucesso!!
              </Alert> : null
            }
          </div>
        </Form>
      )}
    </Formik>

    {/* <ContextAwareToggle eventKey="0">Reiniciar</ContextAwareToggle> */}
    </>
  );
};

const FormRomaneio = (props) => {
  
  const transpId = props.tr
  
  return (
    <>
      <MyEnhancedForm trId={transpId} />
    </>
  );
}


export default FormRomaneio