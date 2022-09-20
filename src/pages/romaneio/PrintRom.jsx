import React from 'react';
import { Table, Button, Container } from "react-bootstrap"
import {RomData} from '../../services/romaneioData';
import { useParams, useNavigate } from 'react-router-dom';
import Moment from 'moment'
import ReactToPrint from 'react-to-print';

const ref = React.createRef();


const PrintRom = () => {
  const id = useParams()

  const {data} = RomData(id.id)

  const options = {
      orientation: 'landscape',
      unit: 'in',
  };
  const nomearquivo = `"Romaneio"${Moment().format('DD-MM-YYYY')}`
  let navigate = useNavigate();
  return (
    <Container>
      <div className="print-page">
        <ReactToPrint
            content={() => ref.current}
            documentTitle={nomearquivo}
            trigger={() => <button className="btn btn-primary">Gerar Pdf</button>}
          />
        <Button className="btn btn-warning margin-left-btn" onClick={() => navigate(-1)}>Voltar</Button>
        <div style={{ marginBottom: 10 }}></div>
        <div ref={ref}>
          
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Nome</th>
                <th>NFe</th>
              </tr>
            </thead>
            <tbody>
             {data?.data.order.map((order, index) => {
                return (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{order.nome_cliente}</td>
                    <td>{order.nfe}</td>
                  </tr>
                )
             })

             }
            </tbody>
            <tfoot>
              <tr>
                <td></td>
              </tr>
            </tfoot>
          </Table>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Transportadora</th>
                <th>Responsável coleta</th>
                <th>Hora</th>
                <th>Data da Coleta</th>
                <th>QTD Volumes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{data?.data.transportadora.nome}</td>
                <td>__________________________________</td>
                <td>__:__</td>
                <td>{Moment(data?.data.data_coleta).add(1, 'day').format('DD/MM/YYYY')}</td>
                <td>{data?.data.qtd_volumes}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td></td>
              </tr>
            </tfoot>
          </Table>
        </div>
      </div>
    </ Container>
  )

}

export default PrintRom