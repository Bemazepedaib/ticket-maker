import React from 'react'

import Styles from '../../styles/elements/Input.module.css'

function Input({ estado, cambiarEstado, label, placeholder, tipo, innerRef }) {

    const onChange = (e) => { cambiarEstado(e.target.value) }

    return (
        <div className={Styles.grupoLabel}>
            <div className={Styles.label}> {label} </div>
            <input 
                className={Styles.input}
                placeholder={placeholder} 
                value={estado} 
                onChange={onChange} 
                ref={innerRef ? innerRef : null}
                type={tipo ? tipo : "text"}
            />
        </div>
    )
}

export default Input;