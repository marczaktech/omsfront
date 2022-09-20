import React from "react";
import { Badge, OverlayTrigger, Tooltip} from "react-bootstrap";

const TooltipOverlay = (props) => {

  return (
    <>
        <OverlayTrigger
            overlay=
            {
            <Tooltip id="overlay-example">
            {props.tooltipContent}
            </Tooltip>
            }
            placement={props.placement}
        >
           <Badge bg="light" text="dark">{props.content}</Badge>
        </OverlayTrigger>
  
    </>
    );
};


export default TooltipOverlay;
