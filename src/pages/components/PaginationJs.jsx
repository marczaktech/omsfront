import React from "react";
import {Pagination,} from "react-bootstrap";

const PaginationJs = ({ activePage, pages, setActivePage }) => {

  const getPages = () => {
    const elements = [];
    for (let number = 1; number <= pages; number++) {
      elements.push(
        <Pagination.Item onClick={() => setActivePage(number)} key={number} active={activePage === number ? true : false}>
          {number}
        </Pagination.Item>,
      );
    }
    return elements;
  };

  return (
    <>
      <Pagination>
        {getPages()}
      </Pagination>
  
    </>
    );
};


export default PaginationJs;
