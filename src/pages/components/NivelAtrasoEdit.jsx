import React, { useState } from 'react'
import { useQueryClient, useMutation } from 'react-query'
import axios from 'axios'
import { Collapse, Button, Table, Alert } from "react-bootstrap";
import fechAllNvAtr from '../../services/nivelAtrasoData'

function FormNvAlertEdit() {

    const queryClient = useQueryClient();
    const [err, setErr] = useState(false);
    const [errmsg, setErrmsg] = useState('');
    const [sucss, setSucss] = useState(false);
    const [sucssmsg, setSucssmsg] = useState('');

    const { data: nvAtraso } = fechAllNvAtr()


    const { mutate: delnv } = useMutation(
        async (deleteId) => {
            return await axios.delete(`/delNivelAtraso/${deleteId}`);
        },
        {
            onSuccess: (res) => {
                queryClient.invalidateQueries('nvatr')
                setSucss(true)
                setErr(false)
                setSucssmsg('deletado')
            },
            onError: (err) => {
                setErrmsg(err.response.data.error)
                setSucss(false)
                setErr(true)
            },
        }
    )


    const delNvAtr = (e) => {
        const actionId = e.target.getAttribute("data-id")
        delnv(actionId)
    };
    return (
        <Table striped bordered hover variant="dark" responsive>
            <thead>
                <tr>
                    <th>Código</th>
                    <th>Descrição <span className='th-space'></span></th>
                    <th>X</th>
                </tr>
            </thead>
            <tbody>
                {nvAtraso?.map((nvatr) => {
                    return (
                        <tr key={nvatr.id}>
                            <td>{nvatr.codigo}</td>
                            <td>{nvatr.descricao}</td>
                            <td>
                                <Button onClick={delNvAtr} variant="danger" data-id={nvatr.id}>x</Button>
                            </td>
                        </tr>
                    )
                })}
                <tr>
                    <td colSpan={3}>
                        {err ? (
                            <Alert md="3" variant="danger" className='div-alert margin-bot-zero'>
                                {errmsg}
                            </Alert>
                        ) : null}
                        {sucss ?
                            <Alert md="3" variant="success" className='div-alert margin-bot-zero'>
                                Nível de atraso {sucssmsg} com sucesso!!
                            </Alert> : null
                        }
                    </td>
                </tr>
            </tbody>
        </Table>
    )
}

function NvEdit() {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button
                onClick={() => setOpen(!open)}
                aria-controls="example-collapse-text"
                aria-expanded={open}
                variant="danger"
                className="margin-left-btn"
            >
                Deletar Nível Atraso
            </Button>
            <Collapse in={open}>
                <div className="form-alert">
                    <FormNvAlertEdit />
                </div>
            </Collapse>
        </>
    );
}

export default function NivelAtrasoEdit(props) {
    return (
        <>
            <NvEdit />
        </>
    )
}