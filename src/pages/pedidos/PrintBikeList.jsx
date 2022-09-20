import React, {createRef, useState} from 'react';
import { Table, Button, Container, Modal, Form } from "react-bootstrap"
import {FetchBikeList} from '../../services/orderData';
import { useParams, useNavigate } from 'react-router-dom';
import Moment from 'moment'
import ReactToPrint from 'react-to-print';

const ref = React.createRef();

const PrintRom = () => {
  const id = useParams()
  const [show, setShow] = useState(false)
  const [bikename, setBikename] = useState("")
  const [bikenameid, setBikenameid] = useState(null)

  const {data} = FetchBikeList()

  const options = {
    orientation: 'portrait',
    unit: 'mm',
    format: [210, 300],
  };

  const nomearquivo = `"Lista dia "${Moment().format('DD-MM-YYYY')}`

  function removeBike(e){
    const id = e.target.getAttribute("data-id")

    document.getElementById(`biketr${id}`).style.display = "none";
  }
  let navigate = useNavigate();

  const products = []

  data?.map((order, index) => {
    const product = order.produto.split(", ")
    product.map((p) => {
      products.push(p)
    })
  })

  const [dayList, setDaylist] = useState("Lista Bikes dia" +" "+ Moment().format('DD-MM-YYYY'))

  function haldlechange(e){
    setShow(true)
    const bike = e.target.firstChild.data
    const id = e.target.id
    setBikenameid(id)
    setBikename(bike)
  }

  function changeName(e){
    const newName = document.getElementById("changeName").value
    document.getElementById(bikenameid).innerHTML = newName
    setShow(false)
  }

  return (
    <>
      <Modal show={show} animation={false} onHide={() => setShow(false)} centered closeButton={true}>
        <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
              <span style={{color: "#fff"}}>Alterar Nome da Bike</span>
          </Modal.Title>
        </Modal.Header>
       <Modal.Body>
          <span style={{color: "#fff"}}>{bikename}</span>
          <div className="changeName">
                <Form.Group className="mb-3" controlId="changeName">
                  <Form.Control 
                    type="text"
                    style={{width: "100%", marginTop: "10px"}} 
                    placeholder='Digite o nome para ser impresso'
                  />
                </Form.Group>
                <Button onClick={changeName}>Alterar</Button>
          </div>
        </Modal.Body>
      </Modal>
      <Container>
        <div className="print-page">
          <ReactToPrint
              content={() => ref.current}
              documentTitle={nomearquivo}
              trigger={() => <button className="btn btn-primary">Gerar Pdf</button>}
            />
          <Button className="btn btn-warning margin-left-btn" onClick={() => navigate(-1)}>Voltar</Button>
          <div style={{ marginBottom: 10 }}></div>
          <div>
            
            <Table ref={ref} id="table_bikes" striped bordered hover style={{textAlign: 'center',
                width: "700px",
                height: "auto",
                margin: "0 auto",
                padding: "10mm"}}>
              <thead>
                <tr>
                  <th></th>
                  <th><input style={{border: "none", cursor: 'auto'}} type="text" name="dayList" onChange={(e) => setDaylist(e.target.value)} value={dayList}/></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                
                    {products?.map((order, index) => 
                    {
                      return (
                        <tr key={index} id={`biketr${index}`}>
                          <td scope="row">{index + 1}</td> 
                          <td id={`bike${index}`} onClick={haldlechange} style={{cursor: 'auto'}}>
                              {order}  
                          </td>
                          <td><Button onClick={removeBike} variant="danger" data-id={index} style={{padding: 0}}>X</Button></td> 
                        </tr>
                      )
                    })
                  } 
              </tbody>
            </Table>
          </div>
        </div>
      </ Container>
    </>
  )

}

export default PrintRom