import React, { useEffect, useState } from 'react';
import { Button,
  Form, Row,
  Col, Alert,
} from "react-bootstrap";
import MaskedInput from "react-text-mask";
import NumberFormat from 'react-number-format';
import LoadSpinner from './LoadSpinner'
import moment from 'moment';
import 'moment/locale/pt-br';
import { useQueryClient, useMutation } from 'react-query';
import axios from "axios";
import fechAllEmp from '../../services/empresaData';
import fechAllMkt from '../../services/mktData';
import fetchAllStatus from '../../services/statusData';
import DatePicker, { registerLocale } from 'react-datepicker';
import ptBR from 'date-fns/locale/pt-BR';
registerLocale('pt-BR', ptBR);
import "react-datepicker/dist/react-datepicker.css";
import { Formik } from 'formik';
import * as Yup from 'yup';



const FormOrder = () => {
    
    const [validated, setValidated] = useState(false);
    const [err, setErr] = useState(false);
    const [errmsg, setErrmsg] = useState('');
    const [sucss, setSucss] = useState(false);
    const [sucssmsg, setSucssmsg] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    
    
    const queryClient = useQueryClient();
    
    const { data: empresas } = fechAllEmp()
    const { data: mkts } = fechAllMkt()
    const { data: sts } = fetchAllStatus()
    
    const phoneNumberMask = [
        "(", /[1-9]/, /\d/, ")",
        " ", /\d/, /\d/, /\d/, /\d/, /\d/, "-",
        /\d/, /\d/, /\d/, /\d/
    ];

    const cepNumberMask = [
        /\d/, /\d/, ".",
        /\d/, /\d/, /\d/,"-", /\d/, /\d/, /\d/
    ];
    
    
    
    const useDebounce = (initialValue = "", delay) => {
        const [actualValue, setActualValue] = useState(initialValue);
        const [debounceValue, setDebounceValue] = useState(initialValue);
        useEffect(() => {
        const debounceId = setTimeout(() => setDebounceValue(actualValue), delay);
        return () => clearTimeout(debounceId);
        }, [actualValue, delay]);
        return [debounceValue, setActualValue];
    };
    
    const [valorTotal, setValorTotal] = useDebounce('', 1200);
    const [valorFrete, setValorFrete] = useDebounce(0, 1200);
    
    const { mutate: addOrder, isLoading: mutLoading } = useMutation(
        async (addord) => {
        return axios.post('/newOrder', addord)
        },
        {
        onSuccess: (res) => {
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
    
    function createOrd(event) {
        const order = {
            // nfe: event.nfe,
            data_venda: moment(startDate).format('YYYY-MM-DDT00:00:00.000Z'),
            // previsao_entrega: moment(startDatePv).format('YYYY-MM-DDT00:00:00.000Z'),
            produto: event.produto,
            valor_total: valorTotal,
            nome_cliente: event.nome_cliente,
            telefone_cliente: event.telefone_cliente,
            cpf_cliente: event.cpf_cliente,
            cidade: event.cidade,
            protocolo_cotacao: event.protocolo_cotacao,
            valor_frete: valorFrete,
            video: event.video,
            rastreio: event.rastreio,
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
        addOrder(order)
    }
    
    const schema = Yup.object().shape({
        data_venda: Yup.string().required('Selecione a Data da Venda'),
        produto: Yup.string().required('Digite o nome do produto'),
        valor_total: Yup.string().required('Digite o valor total da venda'),
        nome_cliente: Yup.string().required('Digite o nome do cliente'),
        protocolo_cotacao: Yup.string(),
        valor_frete: Yup.string(),
        marketplace: Yup.string().required('Selecione o marketplace'),
        status: Yup.string().required('Digite o status do pedido'),
        empresa: Yup.string().required('Selecione a empresa de faturamento'),
        volumes: Yup.string().required('Digite a quantidade de volumes'),   
    })
    
    const initialValues = {
        data_venda: startDate,
        produto: '',
        valor_total: '',
        nome_cliente: '',
        telefone_cliente: '',
        cpf_cliente: '',
        cidade: '',
        protocolo_cotacao: '',
        valor_frete: '',
        marketplace: '',
        status: '',
        empresa: '',
        volumes: '',
        cep : '',
        endereco: '',
        bairro: '',
        estado: '',
        complemento: '',
        produto_extra: ''
    }
    
    return (
        <Formik
        validationSchema={schema}
        onSubmit={createOrd}
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
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
                <Form.Group as={Col} md="3" controlId="data_venda">
                    <Form.Label>Data Venda</Form.Label>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        locale="pt-BR"
                        value={values.data_venda}
                        name="data_venda"
                        className="form-control"
                        dateFormat="dd/MM/yyyy"
                    />
                    {touched.data_venda && errors.data_venda ? (
                        <div className="error-message">{errors.data_venda}</div>
                    ) : null}
                </Form.Group>
                <Form.Group as={Col} md="7" controlId="produto">
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
                {/* <Form.Group as={Col} md="4" controlId="previsao_entrega">
                    <Form.Label>Previsão Entrega</Form.Label>
        
                    <DatePicker
                        selected={startDatePv}
                        onChange={(date) => setstartDatePv(date)}
                        locale="pt-BR"
                        value={values.previsao_entrega}
                        name="data_coleta"
                        className="form-control"
                        dateFormat="dd/MM/yyyy"
                    />
                    {touched.previsao_entrega && errors.previsao_entrega ? (
                        <div className="error-message">{errors.previsao_entrega}</div>
                    ) : null}
                </Form.Group> */}
                {/* <Form.Group as={Col} md="4" controlId="nfe">
                    <Form.Label>NFe</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        placeholder="NFe"
                        onChange={handleChange}
                        value={values.nfe}
                        className={touched.nfe && errors.nfe ? "error" : null}
                    />
                    {touched.nfe && errors.nfe ? (
                        <div className="error-message">{errors.nfe}</div>
                    ) : null}
                </Form.Group> */}
            </Row>
            <Row className="mb-3">
                
                {/* <Form.Group as={Col} md="2" controlId="numero_serie">
                    <Form.Label>Numero Série</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="00000000"
                        onChange={handleChange}
                        value={values.numero_serie}
                        className={touched.numero_serie && errors.numero_serie ? "error" : null}
                    />
                    {touched.numero_serie && errors.numero_serie ? (
                        <div className="error-message">{errors.numero_serie}</div>
                    ) : null}
                </Form.Group> */}
                <Form.Group as={Col} md="2" controlId="valor_total">
                    <Form.Label>Valor Total</Form.Label>
                    <NumberFormat
                        required
                        thousandSeparator={'.'}
                        decimalSeparator={','}
                        prefix={'R$'}
                        placeholder="R$0,00"
                        id="valor_total"
                        onChange={handleChange}
                        value={values.valor_total}
                        className={touched.valor_total && errors.valor_total ? "error form-control" : 'form-control'}
                        onValueChange={(values) => {
                        const { formattedValue, value } = values;
                            setValorTotal(value)
                        }}
                    />
                    {touched.valor_total && errors.valor_total ? (
                        <div className="error-message">{errors.valor_total}</div>
                    ) : null}
                </Form.Group>
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
                <Form.Group as={Col} md="2" controlId="telefone_cliente">
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
                <Form.Group as={Col} md="2" controlId="cpf_cliente">
                    <Form.Label>CPF / CNPJ</Form.Label>
                    <Form.Control
                        placeholder="CPF / CNPJ"
                        type="text"
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
                    <MaskedInput
                        mask={cepNumberMask}
                        id="cep"
                        type="text"
                        placeholder="CEP"
                        onChange={handleChange}
                        value={values.cep}
                        className={touched.cep && errors.cep ? "error form-control" : "form-control"}
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
                    <Form.Select aria-label="Markeplace"
                        onChange={handleChange}
                        value={values.marketplace}
                        className={touched.marketplace && errors.marketplace ? "error" : null}
                    >
                        <option value={null}>Selecione o Marketplace</option>
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
                    <Form.Select aria-label="Status"
                        onChange={handleChange}
                        value={values.status}
                        className={touched.status && errors.status ? "error" : null}
                    >
                        <option value={null}>Selecione o Status</option>
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
                    <Form.Select aria-label="empresa"
                        onChange={handleChange}
                        value={values.empresa}
                        className={touched.empresa && errors.empresa ? "error" : null}
                    >
                        <option value={null}>Selecione a Empresa</option>
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
                <Button type="reset" onClick={handleReset} className="margin-left-btn" variant="light">Limpar</Button>
                <LoadSpinner load={mutLoading} />
                {err ? (
                <Alert md="3" variant="danger" className='div-alert' >
                    {errmsg}
                </Alert>
                ) : null}
                {sucss ?
                <Alert md="3" variant="success" className='div-alert' >
                    Pedido  {sucssmsg} adicionado com sucesso!!
                </Alert> : null
                }
            </div>
            </Form>
        )}
        </Formik>
    )
    
}

export default FormOrder