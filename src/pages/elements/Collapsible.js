import React, { useState, useRef } from 'react'

import Styles from '../../styles/elements/Collapsible.module.css'

function Collapsible({ label, children }) {

    const [open, setOpen] = useState(false);
    const contentRef = useRef();

    const toggle = () => {
        setOpen(!open);
    };

    return (
        <div className={Styles.mainContainer}>
            <button onClick={toggle} className={Styles.button}>{label}</button>
            <div ref={contentRef} className={Styles.contentParent}
                style={open ? { height: contentRef.current.scrollHeight + "px" } : { height: "0px" }}>
                <div className={Styles.content}>{children}</div>
            </div>
        </div>
    )
}

export default Collapsible