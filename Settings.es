import React from 'react'
import { 
  FormControl,
} from 'react-bootstrap'

// TODO
// - parametrize requirement.es
// - perhaps consider keeping an instance as prop
// - need reduxified config
// - i18n

const settingsClass = () => (
  <div style={{
    display: "flex", 
    justifyContent: "space-between"}}>
    <div style={{flex: "4", alignSelf: "center"}}>Recommended number of sparkled ships:</div>
    <FormControl style={{flex: "1"}} componentClass="select">
      {
        [4,5,6].map((num, ind) =>
          <option key={ind} value={num}>
            {num}
          </option>
        )
      }
    </FormControl>        
  </div>)

export {
  settingsClass,
}
