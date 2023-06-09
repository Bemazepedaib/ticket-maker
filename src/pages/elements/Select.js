import React from 'react'

import Styles from '../../styles/elements/Select.module.css'

function Select({ estado, cambiarEstado }) {
    return (
        <div className={Styles.grupoSelect}>
            <div className={Styles.label}> Empresa </div>
            <select
                className={Styles.input}
                value={estado}
                onBlur={e => { cambiarEstado(e.target.value) }}
                onChange={e => { cambiarEstado(e.target.value) }}
            >
                <option value={'/logo_carmel.png|/fondo_carmel.svg|CARMEL'}>Carmel</option>
                <option value={'/logo_pcfk.png|/fondo_pcfk.svg|PACIFIKA'}>Pacifika</option>
            </select>
        </div>
    )
}

export default Select