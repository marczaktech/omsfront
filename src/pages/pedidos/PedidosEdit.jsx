import React, { useEffect, useState } from 'react';
import {
  Container, Button,
  Form, Row,
  Col, Alert
} from "react-bootstrap";

import MaskedInput from "react-text-mask";
// import { useValidationsBR } from 'validations-br';
import NumberFormat from 'react-number-format';
import Moment from 'moment';

import Tabs from '../modules/Tabs';
import Footer from '../modules/Footer';
import Header from '../modules/Header';
import LoadSpinner from '../components/LoadSpinner'


import { useQueryClient, useMutation } from 'react-query';
import axios from "axios";
import { OrderData } from '../../services/orderData';
import fechAllEmp from '../../services/empresaData';
import fechAllMkt from '../../services/mktData';
import fechAllStatus from '../../services/statusData';
import fechAllTr from '../../services/transpData';
import DatePicker, { registerLocale } from 'react-datepicker';
import ptBR from 'date-fns/locale/pt-BR';

registerLocale('pt-BR', ptBR);
import "react-datepicker/dist/react-datepicker.css";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { extendWith } from 'lodash';

const PedidosEdit = () => {
  const queryClient = useQueryClient();
  let navigate = useNavigate();

  const id = useParams()
  const { data: order, isLoading: loadAll, isFetching: fetchAll } = OrderData(id.id)

  const { data: empresas } = fechAllEmp()
  const { data: mkts } = fechAllMkt()
  const { data: sts } = fechAllStatus()
  const { data: tr } = fechAllTr()
  

  const [err, setErr] = useState(false);
  const [errmsg, setErrmsg] = useState('');
  const [sucss, setSucss] = useState(false);
  const [sucssmsg, setSucssmsg] = useState('');
  const [startDate, setStartDate] = useState(null)

  useEffect(() => {
    if(order?.data.previsao_entrega === null){
      setStartDate(new Date(Moment().add(5, "day")))
    }else{
      setStartDate(moment(order?.data.previsao_entrega).add(1, 'day').toDate())
    }
  }, [order])
  const phoneNumberMask = [
    "(", /[1-9]/, /\d/, ")",
    " ", /\d/, /\d/, /\d/, /\d/, /\d/, "-",
    /\d/, /\d/, /\d/, /\d/
  ];
  const cpfNumberMask = [
    /\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, "-", /\d/, /\d/
  ];


  const { mutate: edit, isLoading: mutLoading } = useMutation(
    async (edtOrd) => {
      return axios.put(`/editOrder/${id.id}`, edtOrd)
    },
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries('ordOne')
        queryClient.invalidateQueries('orders')
        setSucss(true)
        setErr(false)
        setSucssmsg(res.data.nfe)
      },
      onError: (err) => {
        setErrmsg(err.response.data.error)
        setSucss(false)
        setErr(true)
      },
    }
  )

  function editOrder(event) {
    const order = {
      nfe: event.nfe,
      previsao_entrega: moment(startDate).format('YYYY-MM-DDT00:00:00.000Z'), 
      produto: event.produto,
      numero_serie: event.numero_serie,
      valor_total: (parseFloat(event.valor_total.replace(/[^0-9]/g,'')) / 100).toFixed(2),
      nome_cliente: event.nome_cliente,
      telefone_cliente: event.telefone_cliente,
      cpf_cliente: event.cpf_cliente,
      cidade: event.cidade,
      protocolo_cotacao: event.protocolo_cotacao,
      valor_frete: (parseFloat(event.valor_frete.replace(/[^0-9]/g,'')) / 100).toFixed(2),
      marketplace: event.marketplace,
      status: event.status,
      empresa: event.empresa,
      transportadora: event.transportadora,
      volumes: event.volumes,
      cep: event.cep,
      endereco: event.endereco,
      bairro: event.bairro,
      estado: event.estado,
      complemento: event.complemento,
      produto_extra: event.produto_extra
    }
    edit(order)
  }

  const transp = localStorage.getItem("transp")
  
  const initialValues = {
    nfe: order?.data.nfe,
    previsao_entrega:  startDate,
    produto: order?.data.produto,
    numero_serie: order?.data.numero_serie,
    valor_total: parseFloat(order?.data.valor_total).toFixed(2), //String(parseFloat(order?.data.valor_total + "" ?? "0") * 100),
    nome_cliente: order?.data.nome_cliente,
    telefone_cliente: order?.data.telefone_cliente,
    cpf_cliente: order?.data.cpf_cliente,
    cidade: order?.data.cidade,
    protocolo_cotacao: order?.data.protocolo_cotacao,
    valor_frete: parseFloat(order?.data.valor_frete).toFixed(2), //String(parseFloat(order?.data.valor_frete + "" ?? "0") * 100),
    marketplace: order?.data.marketplaceId,
    status: order?.data.statusId,
    empresa: !order?.data.empresasId ? "sel" : order?.data.empresasId,
    transportadora: order?.data.transportadoraId === null ? JSON.parse(transp).semTransp : order?.data.transportadoraId,
    volumes: order?.data.volumes,
    cep: order?.data.cep,
    endereco: order?.data.endereco,
    bairro: order?.data.bairro,
    estado: order?.data.estado,
    complemento: order?.data.complemento,
    produto_extra: order?.data.produto_extra,
  }
  const schema = Yup.object().shape({
    produto: Yup.string().required('Informe o Produto'),
    nfe: Yup.number().typeError('Digite uma NFe válida').nullable(true),
    valor_total: Yup.string().required('Informe o valor total da venda'),
    nome_cliente: Yup.string().required('Informe o nome do cliente'),
    marketplace: Yup.string().required('Selecione o Marketplace'),
    status: Yup.string().required('Informe o Status do Pedido'),
    empresa: Yup.string().min(5, 'Selecione a empresa de faturamento').required('Selecione a empresa de faturamento').typeError('Selecione a empresa de faturamento'),
    transportadora: Yup.string('Selecione a transportadora').required('Selecione a transportadora'),
  });


  const currencyFormatter = (formatted_value) => {
    // Set to 0,00 when "" and divide by 100 to start by the cents when start typing
    if (!Number(formatted_value)) return "R$ 0,00";
    const br = { style: "currency", currency: "BRL" };

    const value = new Intl.NumberFormat("pt-BR", br).format(formatted_value / 100)

    return value
  };

  
  return (
    <>
      <Header />
      <Tabs />
      <Container>
        <div className="main">
          <h2>Editar Pedido</h2>
        </div>
        {fetchAll ? <Row><LoadSpinner load={fetchAll} /> </Row> :
         
          <Formik
            validationSchema={schema}
            onSubmit={editOrder}
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
              
              <Form noValidate onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} md="4" controlId="previsao_entrega">
                    <Form.Label>Previsão Entrega</Form.Label>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      locale="pt-BR"
                      // value={values.previsao_entrega}
                      name="previsao_entrega"
                      className="form-control"
                      dateFormat="dd/MM/yyyy"
                    />
                    {touched.previsao_entrega && errors.previsao_entrega ? (
                      <div className="error-message">{errors.previsao_entrega}</div>
                    ) : null}
                  </Form.Group>
                  <Form.Group as={Col} md="3" controlId="transportadora">
                    <Form.Label>Transportadora</Form.Label>
                    <Form.Select aria-label="empresa" required
                      onChange={handleChange}
                      value={values.transportadora}
                      className={touched.transportadora && errors.transportadora ? "error" : null}
                      
                    >
                      {tr?.map((transp) => {
                        return (<option key={transp.id} value={transp.id} > {transp.nome} </option>)
                      })}
                    </Form.Select>
                    {touched.transportadora && errors.transportadora ? (
                      <div className="error-message">{errors.transportadora}</div>
                    ) : null}
                  </Form.Group>
                  <Form.Group as={Col} md="3" controlId="protocolo_cotacao">
                    <Form.Label>Protocolo Cotação</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="0000000"
                      required
                      onChange={handleChange}
                      value={values.protocolo_cotacao}
                      className={touched.protocolo_cotacao && errors.protocolo_cotacao ? "error" : null}
                    />
                    {touched.protocolo_cotacao && errors.protocolo_cotacao ? (
                      <div className="error-message">{errors.protocolo_cotacao}</div>
                    ) : null}
                  </Form.Group>
                  <Form.Group as={Col} md="2" controlId="valor_frete">
                    <Form.Label>Valor Frete</Form.Label>
                    {/* <NumberFormat
                      thousandsGroupStyle="thousand"
                      decimalSeparator="."
                      thousandSeparator={true}
                      allowNegative={true}
                      decimalScale={2}
                      fixedDecimalScale={true}
                      prefix="R$"
                      value={values.valor_frete}
                      onChange={handleChange}
                      id="valor_frete"
                      format={currencyFormatter(values.valor_frete)} 
                      className={touched.valor_frete && errors.valor_frete ? "error form-control" : 'form-control'}
                      
                      placeholder="R$0,00"
                    /> */}
                    <NumberFormat
                      id="valor_frete"
                      className={touched.valor_frete && errors.valor_frete ? "error form-control" : 'form-control'}
                      placeholder="R$0,00"

                      value={values.valor_frete}
                      format={currencyFormatter}
                      onChange={handleChange}
                      prefix={"R$ "}
                      allowEmptyFormatting
                      decimalSeparator=","
                      thousandSeparator="."
                      decimalScale={2}
                    />
                    {/* {values.valor_frete} {"  "} {order?.data.valor_frete} */}
                    
                    {touched.valor_frete && errors.valor_frete ? (
                      <div className="error-message">{errors.valor_frete}</div>
                    ) : null}
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md="2" controlId="nfe">
                    <Form.Label>NFe</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="NFe"
                      onChange={handleChange}
                      value={values.nfe}
                      className={touched.nfe && errors.nfe ? "error" : null}
                    />
                    {touched.nfe && errors.nfe ? (
                      <div className="error-message">{errors.nfe}</div>
                    ) : null}
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="produto">
                    <Form.Label>Produto</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Produto"
                      required
                      onChange={handleChange}
                      value={values.produto}
                      className={touched.produto && errors.produto ? "error" : null}
                    />
                    {touched.produto && errors.produto ? (
                      <div className="error-message">{errors.produto}</div>
                    ) : null}
                  </Form.Group>
                  <Form.Group as={Col} md="2" controlId="volumes">
                    <Form.Label>Volumes</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Volumes"
                      required
                      onChange={handleChange}
                      value={values.volumes}
                      className={touched.volumes && errors.volumes ? "error" : null}
                    />
                    {touched.volumes && errors.volumes ? (
                      <div className="error-message">{errors.volumes}</div>
                    ) : null}
                  </Form.Group>
                  <Form.Group as={Col} md="2" controlId="numero_serie">
                    <Form.Label>Numero Série</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="00000000"
                      required
                      onChange={handleChange}
                      value={values.numero_serie}
                      className={touched.numero_serie && errors.numero_serie ? "error" : null}
                    />
                    {touched.numero_serie && errors.numero_serie ? (
                      <div className="error-message">{errors.numero_serie}</div>
                    ) : null}
                  </Form.Group>
                  <Form.Group as={Col} md="2" controlId="valor_total">
                    <Form.Label>Valor Total</Form.Label>
                    {/* <NumberFormat
                      thousandsGroupStyle="thousand"
                      decimalSeparator="."
                      thousandSeparator={true}
                      allowNegative={true}
                      decimalScale={2}
                      fixedDecimalScale={true}
                      prefix="R$"
                      value={values.valor_total}
                      onChange={handleChange}
                      id="valor_total"
                      //format={currencyFormatter} 
                      className={touched.valor_total && errors.valor_total ? "error form-control" : 'form-control'}
                      placeholder="R$0,00"
                    /> */}
                    <NumberFormat
                      id="valor_total"
                      className={touched.valor_total && errors.valor_total ? "error form-control" : 'form-control'}
                      placeholder="R$0,00"

                      value={values.valor_total}
                      format={currencyFormatter}
                      onChange={handleChange}
                      prefix={"R$ "}
                      allowEmptyFormatting
                      decimalSeparator=","
                      thousandSeparator="."
                      decimalScale={2}
                    />
                    {/* {values.valor_total} {"  "} {order?.data.valor_total} */}

                    {touched.valor_total && errors.valor_total ? (
                      <div className="error-message">{errors.valor_total}</div>
                    ) : null}
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md="6" controlId="nome_cliente">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Nome do Cliente"
                      required
                      onChange={handleChange}
                      value={values.nome_cliente}
                      className={touched.nome_cliente && errors.nome_cliente ? "error" : null}
                    />
                    {touched.nome_cliente && errors.nome_cliente ? (
                      <div className="error-message">{errors.nome_cliente}</div>
                    ) : null}
                  </Form.Group>
                  <Form.Group as={Col} md="3" controlId="telefone_cliente">
                    <Form.Label>Telefone</Form.Label>
                    <MaskedInput
                      mask={phoneNumberMask}
                      id="telefone_cliente"
                      placeholder="00 00000-0000"
                      type="text"
                      onChange={handleChange}
                      value={values.telefone_cliente}
                      className={touched.telefone_cliente && errors.telefone_cliente ? "error form-control" : 'form-control'}
                    />
                    {touched.telefone_cliente && errors.telefone_cliente ? (
                      <div className="error-message">{errors.telefone_cliente}</div>
                    ) : null}
                  </Form.Group>
                  <Form.Group as={Col} md="3" controlId="cpf_cliente">
                    <Form.Label>CPF / CNPJ</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="CPF / CNPJ"
                      onChange={handleChange}
                      value={values.cpf_cliente}
                      className={touched.cpf_cliente && errors.cpf_cliente ? "error form-control" : 'form-control'}
                    />
                    {touched.cpf_cliente && errors.cpf_cliente ? (
                      <div className="error-message">{errors.cpf_cliente}</div>
                    ) : null}
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md="2" controlId="cep">
                    <Form.Label>CEP</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="CEP"
                      onChange={handleChange}
                      value={values.cep}
                      className={touched.cep && errors.cep ? "error" : null}
                    />
                    {touched.cep && errors.cep ? (
                      <div className="error-message">{errors.cep}</div>
                    ) : null}
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="endereco">
                    <Form.Label>Endereço</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Av. ______________, Nº"
                      onChange={handleChange}
                      value={values.endereco}
                      className={touched.endereco && errors.endereco ? "error" : null}
                    />
                    {touched.endereco && errors.endereco ? (
                      <div className="error-message">{errors.endereco}</div>
                    ) : null}
                  </Form.Group>
                  <Form.Group as={Col} md="2" controlId="cidade">
                    <Form.Label>Cidade</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Cidade"
                      onChange={handleChange}
                      value={values.cidade}
                      className={touched.cidade && errors.cidade ? "error" : null}
                    />
                    {touched.cidade && errors.cidade ? (
                      <div className="error-message">{errors.cidade}</div>
                    ) : null}
                  </Form.Group>
                  <Form.Group as={Col} md="2" controlId="bairro">
                    <Form.Label>Bairro</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Bairro"
                      onChange={handleChange}
                      value={values.bairro}
                      className={touched.bairro && errors.bairro ? "error" : null}
                    />
                    {touched.bairro && errors.bairro ? (
                      <div className="error-message">{errors.bairro}</div>
                    ) : null}
                  </Form.Group>
                  <Form.Group as={Col} md="2" controlId="estado">
                    <Form.Label>Estado</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Estado"
                      onChange={handleChange}
                      value={values.estado}
                      className={touched.estado && errors.estado ? "error" : null}
                    />
                    {touched.estado && errors.estado ? (
                      <div className="error-message">{errors.estado}</div>
                    ) : null}
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md="5" controlId="produto_extra">
                    <Form.Label>Produto Extra</Form.Label>
                    <Form.Control
                      placeholder="Produto Extra"
                      as="textarea" rows={3}
                      onChange={handleChange}
                      value={values.produto_extra}
                      className={touched.produto_extra && errors.produto_extra ? "error" : null}
                    />
                    {touched.produto_extra && errors.produto_extra ? (
                      <div className="error-message">{errors.produto_extra}</div>
                    ) : null}
                  </Form.Group>
                  <Form.Group as={Col} md="3" controlId="marketplace">
                    <Form.Label>Marketplace</Form.Label>
                    <Form.Select aria-label="Markeplace" required
                      onChange={handleChange}
                      value={values.marketplace}
                      className={touched.marketplace && errors.marketplace ? "error" : null}
                    >
                      <option value=" ">Selecione</option>
                      {mkts?.map((getMkt) => {
                        return (<option key={getMkt.id} value={getMkt.id} > {getMkt.nome} </option>)
                      })}
                    </Form.Select>
                    {touched.marketplace && errors.marketplace ? (
                      <div className="error-message">{errors.marketplace}</div>
                    ) : null}
                  </Form.Group>

                  <Form.Group as={Col} md="2" controlId="status">
                    <Form.Label>Status</Form.Label>
                    <Form.Select aria-label="Status" required
                      onChange={handleChange}
                      value={values.status}
                      className={touched.status && errors.status ? "error" : null}
                    >
                      <option value=" ">Selecione</option>
                      {sts?.map((status) => {
                        return (<option key={status.id} value={status.id}>{status.nome}</option>)
                      })}
                    </Form.Select>
                    {touched.status && errors.status ? (
                      <div className="error-message">{errors.status}</div>
                    ) : null}
                  </Form.Group>

                  <Form.Group as={Col} md="2" controlId="empresa">
                    <Form.Label>Empresa</Form.Label>
                    <Form.Select 
                      aria-label="empresa" 
                      required
                      onChange={handleChange}
                      value={values.empresa}
                      className={touched.empresa && errors.empresa ? "error" : null}
                    >
                      <option value="sel">Selecione</option>
                      {empresas?.map((empr) => {
                        return (<option key={empr.id} value={empr.id} > {empr.razao_social} </option>)
                      })}
                    </Form.Select>
                    {touched.empresa && errors.empresa ? (
                      <div className="error-message">{errors.empresa}</div>
                    ) : null}
                  </Form.Group>
                </Row>
                <div className='btn-forms mb-3'>
                  <Button type="submit">Enviar</Button>
                  <Button className="btn btn-warning margin-left-btn" onClick={() => navigate(-1)}>Voltar</Button>
                  <LoadSpinner load={mutLoading} />
                  {err ? (
                    <Alert md="3" variant="danger" className='div-alert' >
                      {errmsg}
                    </Alert>
                  ) : null}
                  {sucss ?
                    <Alert md="3" variant="success" className='div-alert' >
                      Pedido  {sucssmsg} alterado com sucesso!!
                    </Alert> : null
                  }
                </div>
              </Form>
            )}
          </Formik>
        }
      </Container>
      <Footer />
    </>
  );
}


export default PedidosEdit