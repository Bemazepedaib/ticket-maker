import React, { useState, useRef } from 'react'

import Styles from '../../styles/elements/Collapsible.module.css'

function Collapsible(props) {

    const [open, setOpen] = useState(false);
    const contentRef = useRef();

    const toggle = () => {
        setOpen(!open);
    };

    return (
        <div className={Styles.mainContainer}>
            <button onClick={toggle} className={Styles.button}>{props.label}</button>
            <div ref={contentRef} className={Styles.contentParent}
                style={open ? { height: contentRef.current.scrollHeight + "px" } : { height: "0px" }}>
                <div className={Styles.content}>{props.children}</div>
            </div>
        </div>
    )
}

export default Collapsible