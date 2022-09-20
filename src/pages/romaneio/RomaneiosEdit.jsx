import React, {useState, useContext} from 'react';
import { Container, Button, Form, Row, Col, Alert} from "react-bootstrap";
import DatePicker, {registerLocale} from 'react-datepicker'
import ptBR from 'date-fns/locale/pt-BR'
registerLocale('pt-BR', ptBR)
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment'
import Tabs from '../modules/Tabs';
import Footer from '../modules/Footer';
import Header from '../modules/Header';
import {RomData} from '../../services/romaneioData';


import { Field, Formik } from "formik";
import * as Yup from 'yup';
import { useQueryClient, useMutation } from 'react-query';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CustomSelect from "../components/CustomSelect";
import LoadSpinner from '../components/LoadSpinner'


 
const RomaneiosEdit = () =>{
  const queryClient = useQueryClient();
  const [err, setErr] = useState(false);
  const [errmsg, setErrmsg] = useState('');
  const [sucss, setSucss] = useState(false);
  const [sucssmsg, setSucssmsg] = useState('');
  const [show, setShow] = useState(false);
  let navigate = useNavigate();

  const id = useParams()
  const {data} = RomData(id.id)

  const initialValues = { responsavel_coleta: data?.data.responsavel_coleta }
  const { mutate: updRom, isLoading: mutLoading } = useMutation(
      async (addTr) => {
        return axios.put(`/editRom/${id.id}`, addTr)
      },
      {
        onSuccess: (res) => {
          queryClient.invalidateQueries('romaneios')
          setSucss(true)
          setErr(false)
          setSucssmsg(res.data.nome)
        },
        onError: (err) => {
          setErrmsg(err.response.data.error)
          setSucss(false)
          setErr(true)
        },
      }
    )

    function editRom(event) {
      const rom = event
      console.log(rom)
      updRom(rom)
    }

  return (
    <>
      <Header />
      <Tabs />
      <Container>
          <div className="main">
            <h2>Editar </h2>
          </div>
          <Formik
            onSubmit={editRom}
            initialValues={initialValues}
            enableReinitialize={true}
          >
            {({
              handleSubmit,
              handleChange,
              values,
              touched,
              errors,
            }) => (

              <Form noValidate onSubmit={handleSubmit} id="form-tr">
                <Row className="mb-3">
                  <Form.Group as={Col} md="3" controlId="responsavel_coleta">
                    <Form.Label>Responsável Coleta</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Responsável Coleta"
                      onChange={handleChange}
                      value={values.responsavel_coleta}
                      className={touched.responsavel_coleta && errors.responsavel_coleta ? "error" : null}
                    />
                    {touched.responsavel_coleta && errors.responsavel_coleta ? (
                      <div className="error-message">{errors.responsavel_coleta}</div>
                    ) : null}
                  </Form.Group>
                </Row>

                <div className='btn-forms mb-3'>
                  <Button md="3" type="submit">Enviar</Button>
                  <Button className="btn btn-warning margin-left-btn" onClick={() => navigate(-1)}>Voltar</Button>
                  <LoadSpinner load={mutLoading} />
                  {err ? (
                    <Alert md="3" variant="danger" className='div-alert'>
                      {errmsg}
                    </Alert>
                  ) : null}
                  {sucss ?
                    <Alert md="3" variant="success" className='div-alert'>
                      Romaneio  {sucssmsg} editado com sucesso!!
                    </Alert> : null
                  }
                </div>
              </Form>
            )}
          </Formik>
      </Container>
      <Footer />
    </>
  );
}
export default RomaneiosEdit