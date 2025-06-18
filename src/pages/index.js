import Image from 'next/image';
import html2canvas from 'html2canvas';

import Styles from 'ticketmaker/styles/Home.module.css'

import { useRef, useState, useEffect } from 'react';

import Input from './elements/Input';
import Select from './elements/Select';
import Collapsible from './elements/Collapsible';

function Home() {

	const [empresa, setEmpresa] = useState('/logo_carmel.png|CARMEL')

	const [campania, setCampania] = useState("")
	const [fecha, setFecha] = useState("")
	const [cliente, setCliente] = useState("")

	const articulos = useRef([])
	const [articulo, setArticulo] = useState("")
	const [precio, setPrecio] = useState(0)
	const [cantidad, setCantidad] = useState(0)

	const [faltantes, setFaltantes] = useState(false)
	const articulosFaltantes = useRef([])
	const [codigo, setCodigo] = useState("")
	const [faltante, setFaltante] = useState("")
	const [price, setPrice] = useState(0)

	const total = useRef(0.0)

	const [texto1, setTexto1] = useState('¡Gracias por tu compra y por apoyarme en este proyecto!');
	const [texto2, setTexto2] = useState('Si te interesa conseguir más ropa novedosa y accesible, ¡no dudes en revisar nuestro último catálogo CARMEL!');

	const inputRef = useRef(null)
	const ticketRef = useRef(null)

	const printTicket = useRef()

	const [delArt, setDelArt] = useState(false)
	const [delMis, setDelMis] = useState(false)

	let key = 0;
	let id = 0;

	useEffect(() => {
		if (faltantes) {
			setTexto1("Muchas gracias por tu compra. Lamentablemente, algunos de los productos de tu pedido estaban agotados:")
			setTexto2(`Sin embargo, si te interesa buscar ropa similar, ¡anímate a revisar nuestro nuevo catálogo ${empresa.split("|")[1]} Campaña ${campania+1}!`)
		} else {
			setTexto1("¡Gracias por tu compra y por apoyarme en este proyecto!")
			setTexto2(`Si te interesa conseguir más ropa novedosa y accesible, ¡no dudes en revisar nuestro último catálogo ${empresa.split("|")[1]}!`)
		}
	}, [faltantes, empresa])

	const onChangeFaltantes = (e) => {
		setFaltantes(e.target.checked)
	}

	const resetCamposFaltantes = () => {
		setCodigo("")
		setFaltante("")
		setPrice(0)
	}

	const resetCampos = () => {
		setArticulo("")
		setPrecio(0)
		setCantidad(0)
	}

	const resetTodo = () => {
		setCliente("")
		setArticulo("")
		setPrecio(0)
		setCantidad(0)
		total.current = 0
		articulos.current = []
		articulosFaltantes.current = []
		setDelArt(!delArt)
		setDelMis(!delMis)
		setFaltantes(false)
	}

	const pushArticulo = () => {
		const newArticulo = {
			articulo: articulo,
			cantidad: cantidad,
			precio: precio
		}
		articulos.current.push(newArticulo);
		let aux = parseFloat(total.current);
		aux += parseFloat(newArticulo.precio);
		total.current = aux.toFixed(2);
		resetCampos();
		inputRef.current.focus();
	}

	const spliceArticulo = (articulo) => {
		const index = articulos.current.indexOf(articulo);
		if (index > -1) articulos.current.splice(index, 1);
		let aux = parseFloat(total.current);
		aux -= parseFloat(articulo.precio);
		if (aux.toFixed(2) < 0) total.current = 0;
		total.current = aux.toFixed(2);
		setDelArt(!delArt)
	}

	const pushFaltante = () => {
		const newFaltante = {
			codigo: codigo,
			faltante: faltante,
			price: price
		}
		articulosFaltantes.current.push(newFaltante)
		resetCamposFaltantes();
	}

	const spliceFaltante = (artFaltante) => {
		const index = articulosFaltantes.current.indexOf(artFaltante);
		if (index > -1) articulosFaltantes.current.splice(index, 1);
		setDelMis(!delMis)
	}

	const makeTicket = async () => {
		const element = printTicket.current;
		const canvas = await html2canvas(element);
		const data = canvas.toDataURL('image/png');
		const link = document.createElement('a');
		if (typeof link.download === 'string') {
			link.href = data;
			link.download = `${empresa.split("|")[1] === 'CARMEL' ? "CRML_" : "PCFK_"}${campania}_${cliente.split(" ")[0] + "_"}${cliente.split(" ")[1]}.png`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} else {
			window.open(data);
		}
		resetTodo()
		ticketRef.current.focus()
	}

	const copyClipboard = async () => {
		var mensaje = ""
		if (articulosFaltantes.current.length > 0){
			console.log("entra faltantes")
			mensaje = `¡Hola, ${cliente}! Ya tenemos listo tu pedido ${empresa.split("|")[1]} 🥰 Tu monto total es S/${total.current}, ya que alguno de tus productos se encontraba agotado.`
		} else {
			console.log("entra faltantes completos")
			mensaje = `¡Hola, ${cliente}! Ya tenemos listo tu pedido ${empresa.split("|")[1]} 🥰 Tu monto total es S/${total.current}.`
		}
		navigator.clipboard.writeText(mensaje).then(
			() => {
				console.log("Copy to clipboard")
			},
			() => {
				console.log("Error: Something went wrong")
			}
		);
	}

	const executeBoth = async () => {
		makeTicket();
		copyClipboard();
	}

	const copyFaltante = async () => {
		var mensaje = ""
		var campana = Number(campania)+1
		var numero = 'c00'
		if (campana > 10){
			numero = `c${campana}`
		} else {
			numero = `c0${campana}`
		}
		if (empresa.split("|")[1] == 'CARMEL'){
			mensaje = `Hola, ${cliente}. Lamentablemente, tu pedido ${empresa.split("|")[1]} no pudo ser completado por falta de stock 😢 Si deseas, puedes pedir algo de nuestro catálogo actual. Aquí te envío los catálogos. Muchas gracias por la confianza ❣️
CARMEL Campaña ${campana}: https://catalogo.carmel.com.pe/2025${numero}/${numero}ed01-2025/
PACIFIKA Campaña ${campana}: https://catalogo.pacifika.com.pe/2025${numero}/${numero}ed02-2025/`
		} else {
			mensaje = `Hola, ${cliente}. Lamentablemente, tu pedido ${empresa.split("|")[1]} no pudo ser completado por falta de stock 😢 Si deseas, puedes pedir algo de nuestro catálogo actual. Aquí te envío los catálogos. Muchas gracias por la confianza ❣️
CARMEL Campaña ${campana}: https://catalogo.carmel.com.pe/2025${numero}/${numero}ed01-2025/
PACIFIKA Campaña ${campana}: https://catalogo.pacifika.com.pe/2025${numero}/${numero}ed02-2025/`
		}
		navigator.clipboard.writeText(mensaje).then(
			() => {
				console.log("Copy to clipboard")
			},
			() => {
				console.log("Error: Something went wrong")
			}
		);
	}

	return (
		<>
			<div className={Styles.mainContainer}>
				<div className={Styles.ticket} ref={printTicket}>
					<Image src={empresa.split("|")[0]} width={440} height={95} alt="logo empresa" priority></Image>
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
								key={key++}>
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
					{Array.from(Array(5).keys()).map(number => (
						<br key={number} />
					))}
					<div className={Styles.fondo}>
						<div className={Styles.fondoText1}>
							Hola, {cliente.split(" ")[0]}
							<p>{texto1}</p>
							{faltantes ? articulosFaltantes.current.map(articulo => (
								<div className={Styles.faltante} onClick={() => { spliceFaltante(articulo) }}
									key={id++}>
									<div>{articulo.codigo}&nbsp;&nbsp;&nbsp;{articulo.faltante}</div>
									<div>S/{articulo.price}</div>
								</div>
							)) : null}
							<p>{texto2}</p>
						</div>
					</div>
				</div>
				<div className={Styles.addForm}>
					<Collapsible label="Datos generales">
						<div className={Styles.miniFlex}>
							<Select estado={empresa} cambiarEstado={setEmpresa}></Select>
							<Input estado={campania} cambiarEstado={setCampania} label={"Campaña"} placeholder={"Agregue una campaña"} ></Input>
							<Input estado={fecha} cambiarEstado={setFecha} label={"Fecha"} placeholder={"Agregue una fecha"} ></Input>
						</div>
					</Collapsible>
					<Collapsible label="Datos del producto">
						<div className={Styles.miniFlex}>
							<Input estado={cliente} cambiarEstado={setCliente} label={"Cliente"} placeholder={"Agregue un cliente"} innerRef={ticketRef}></Input>
							<button type='button' className={Styles.botonArticulo} onClick={copyFaltante}>No llegaron</button>
							<Input estado={articulo} cambiarEstado={setArticulo} label={"Artículo"} placeholder={"Agregue un artículo"} innerRef={inputRef}></Input>
							<Input estado={precio} cambiarEstado={setPrecio} label={"Precio"} placeholder={"Agregue un precio"} tipo={"number"}></Input>
							<Input estado={cantidad} cambiarEstado={setCantidad} label={"Cantidad"} placeholder={"Agrege una cantidad de articulos"} tipo={"number"} ></Input>
							<button type='button' className={Styles.botonArticulo} onClick={pushArticulo}>Agregar artículo</button>
							<label><input
								type="checkbox"
								name="terminos"
								id="terminos"
								checked={faltantes}
								onChange={onChangeFaltantes}
							/>Prendas faltantes</label>
							{faltantes && <div className={Styles.miniFlex}>
								<Input estado={codigo} cambiarEstado={setCodigo} label={"Código"} placeholder={"Agregue un código"}></Input>
								<Input estado={faltante} cambiarEstado={setFaltante} label={"Artículo faltante"} placeholder={"Agregue un artículo faltante"}></Input>
								<Input estado={price} cambiarEstado={setPrice} label={"Precio"} placeholder={"Agregue un precio"} tipo={"number"}></Input>
								<button type='button' className={Styles.botonArticulo} onClick={pushFaltante}>Agregar faltante</button>
							</div>}
						</div>
					</Collapsible>
					<button type='button' className={Styles.botonTicket} onClick={executeBoth}>Finalizar ticket</button>
				</div>
			</div >

		</>
	)
}

export default Home;