import Image from 'next/image';
import html2canvas from 'html2canvas';

import Styles from 'ticketmaker/styles/Home.module.css'

import { useRef, useState } from 'react';

import Input from './elements/Input';
import Select from './elements/Select';

function Home() {

  const [empresa, setEmpresa] = useState('/logo_carmel.png')

  const [campania, setCampania] = useState("")
  const [fecha, setFecha] = useState("")
  const [cliente, setCliente] = useState("")
  const [articulo, setArticulo] = useState("")
  const [precio, setPrecio] = useState(0)
  const [cantidad, setCantidad] = useState(0)
  const articulos = useRef([])
  const total = useRef(0.0)

  const inputRef = useRef(null)
  const ticketRef = useRef(null)

  const printTicket = useRef()

  const resetCampos = () => {
    setArticulo("")
    setPrecio(0)
    setCantidad(0)
  }

  const resetTodo = () => {
    setCampania("")
    setFecha("")
    setCliente("")
    setArticulo("")
    setPrecio(0)
    setCantidad(0)
    
  }

  const pushArticulo = () => {
    const newArticulo = {
      articulo: articulo,
      cantidad: cantidad,
      precio: precio
    }
    articulos.current.push(newArticulo)
    let aux = parseFloat(total.current)
    aux += parseFloat(newArticulo.precio)
    total.current = aux.toFixed(2)
    resetCampos();
    inputRef.current.focus();
  }

  const spliceArticulo = (articulo) => {
    const index = articulos.current.indexOf(articulo)
    if (index > -1) articulos.current.splice(index, 1)
    let aux = parseFloat(total.current)
    aux -= parseFloat(articulo.precio)
    if (aux.toFixed(2) < 0) total.current = 0
    total.current = aux.toFixed(2)
  }

  const makeTicket = async () => {
    const element = printTicket.current;
    const canvas = await html2canvas(element);

    const data = canvas.toDataURL('image/jpg');
    const link = document.createElement('a');

    if (typeof link.download === 'string') {
      link.href = data;
      link.download = `${empresa === '/logo_carmel.png' ? "CRML_" : "PCFK_" }${campania}_${cliente.split(" ")[0]+"_"}${cliente.split(" ")[1]}.jpg`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(data);
    }
    resetTodo()
    ticketRef.current.focus()
  }

  return (
    <>
      <div className={Styles.mainContainer}>
        <div className={Styles.ticket} ref={printTicket}>
          <Image src={empresa} width={440} height={95} alt="logo empresa" priority></Image>
          <div className={Styles.ticketHeader}>
            <div>Pedido de Campaña #{campania}</div>
            {fecha}
          </div>
          <hr className={Styles.linea}></hr>
          <div className={Styles.ticketClient}>
            Para:&nbsp;<div className={Styles.client}>{cliente}</div>
          </div>
          <div className={Styles.ticketProducts}>
            {articulos.current ? articulos.current.map(articulo => (
              <div className={Styles.articulo} onClick={() => { spliceArticulo(articulo) }}
                key={articulo.precio + articulo.cantidad + articulo.articulo}>
                {articulo.cantidad}&nbsp;&nbsp;{articulo.articulo}
                <div className={Styles.precio}>S/{articulo.precio}</div>
              </div>
            )) : null}
          </div>
          <hr className={Styles.linea}></hr>
          <div className={Styles.total}>
            <b>TOTAL:</b> S/{total.current}
          </div>
          <div className={Styles.final}>¡Gracias por tu compra!</div>
        </div>
        <div className={Styles.addForm}>
          <div className={Styles.fourFlex}>
            <Select estado={empresa} cambiarEstado={setEmpresa}></Select>
            <Input estado={campania} cambiarEstado={setCampania} label={"Campaña"} placeholder={"Agregue una campaña"} innerRef={ticketRef}></Input>
            <Input estado={fecha} cambiarEstado={setFecha} label={"Fecha"} placeholder={"Agregue una fecha"} ></Input>
            <Input estado={cliente} cambiarEstado={setCliente} label={"Cliente"} placeholder={"Agregue un cliente"} ></Input>
          </div>
          <div className={Styles.fourFlex}>
            <Input estado={articulo} cambiarEstado={setArticulo} label={"Artículo"} placeholder={"Agregue un artículo"} innerRef={inputRef}></Input>
            <Input estado={precio} cambiarEstado={setPrecio} label={"Precio"} placeholder={"Agregue un precio"} tipo={"number"}></Input>
            <Input estado={cantidad} cambiarEstado={setCantidad} label={"Cantidad"} placeholder={"Agrege una cantidad de articulos"} tipo={"number"} ></Input>
            <button type='button' className={Styles.botonArticulo} onClick={pushArticulo}>Agregar artículo</button>
          </div>
          <button type='button' className={Styles.botonTicket} onClick={makeTicket}>Finalizar ticket</button>
        </div>
      </div >

    </>
  )
}

export default Home;