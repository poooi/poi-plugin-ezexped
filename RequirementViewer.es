import React, { Component } from 'react'

import {
  ListGroup, ListGroupItem,
} from 'react-bootstrap'

import { expedReqs, expedGSReqs, checkAllReq, collectUnmetReqs, renderReqData } from './requirement'

// props:
// fleet: fleet representation
// expedId: target expedition id
// greatSuccess: whether aimming at great success
class RequirementViewer extends Component {
  render() {
    const fleet = this.props.fleet
    const reqObj = expedReqs[ this.props.expedId ]
    const result = checkAllReq(reqObj)(fleet)
    const unmetReqs = collectUnmetReqs(reqObj,result).map( x => renderReqData(x.data) )
    const reqObjGS = expedGSReqs[ this.props.expedId ]
    const gsResult = checkAllReq(reqObjGS)(fleet)
    const unmetReqsGS = collectUnmetReqs(reqObjGS,gsResult).map( x => "GS:"+ renderReqData(x.data) )
    return (
      <ListGroup>
        {
          [...unmetReqs, ...unmetReqsGS].map((x,ind)=>
            <ListGroupItem key={ind}>
              {x}
            </ListGroupItem>)
        }
      </ListGroup>
    )
  }
}

export { RequirementViewer }
