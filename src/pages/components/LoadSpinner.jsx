import React from 'react'
import {Spinner} from 'react-bootstrap'


export default function Load(props) {
  if (props.load) {
    return (
      <div className="load_style">
        <Spinner animation="border" role="status" variant="primary" >
          <span className="visually-hidden load_margin">Loading...</span>
        </Spinner>
      </div>
    )
  }
}