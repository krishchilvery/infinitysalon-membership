import React from 'react'
import * as classes from './AlertTemplate.module.css'

export default function AlertTemplate({ style, options, message, close }){
    let alertClass = classes.infoAlert;
    switch(options.type) {
        case 'info':
            alertClass = classes.infoAlert
            break
        case 'success':
            alertClass = classes.successAlert
            break
        case 'error':
            alertClass = classes.errorAlert
            break
        default:
            alertClass = classes.infoAlert
            break
    }
    return (
        <div style={style} className={[alertClass, classes.alert].join(" ")}>
          {message}
          <div style={style} className={classes.closeButton} onClick={close} onKeyDown={()=>{}} role="button" tabIndex={0}>x</div>
        </div>
      )
}