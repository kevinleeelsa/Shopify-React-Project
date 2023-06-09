import React from 'react';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import style from './OrdersModal.module.scss'
import CancelIcon from '@material-ui/icons/Cancel';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Button } from '@material-ui/core';
import { editProducts as editOrder } from '../../../../../api/API';
import { toast } from 'react-toastify';

const useStyles = makeStyles((theme) => ({
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	paper: {
		backgroundColor: theme.palette.background.paper,
		outline: 'none',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
		borderRadius: '7px'
	},
	button: {
		cursor: 'pointer',
		color: 'darkblue'
	},
}));

export function OrdersModal(props) {
	const classes = useStyles();
	const [open, setOpen] = React.useState(false);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div>

			<p onClick={handleOpen} className={classes.button} >
				Edit
			</p>
			<Modal
				style={{ overflow: 'scroll' }}
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				className={classes.modal}
				open={open}
				onClose={handleClose}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500,
				}}
			>
				<Fade in={open}>
					<div className={classes.paper}>
						<div className={style.modalHeader}  >
							<h3> show order </h3>
							<CancelIcon onClick={handleClose} className={style.cancelIcon} />
						</div>

						<BasicTable data={props.data} handleClose={(close) => close && handleClose()} isRerender={isRerender => props.isRerender(isRerender)} />
					</div>
				</Fade>
			</Modal>
		</div>
	);
}

const StyledTableCell = withStyles((theme) => ({
	head: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white,
	},
	body: {
		fontSize: 14,
	},
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
	root: {
		'&:nth-of-type(odd)': {
			backgroundColor: theme.palette.action.hover,
		},
	},
}))(TableRow);

function BasicTable(props) {

	const useStyles = makeStyles({
		table: {
			minWidth: 400,
		},
		tableRow: {
			// height: '20px'
		},
		modalBottom: {
			display: 'flex',
			justifyContent: 'center',
			padding: '20px 0 0 0'
		},
		failText: {
			fontSize: 15,
			fontWeight: 'bold',
			color: 'red'
		}
	});
	const classes = useStyles();

	const convertDateToPersian = (epoch) => {
		const date = new Date(+epoch)
		const persianDate = date.toLocaleString('fa-IR')
		return persianDate
	}


	const orderDelivered = async () => {
		try {
			const id = props.data.id
			const group = 'orders'
			const data = new FormData()
			const endProccessTime = Date.now()
			data.append('delivered', 'true')
			data.append('endProccessTime', endProccessTime)

			await editOrder(data, group, id)

			props.handleClose(true)
			props.isRerender(true)

			toast.success(<p dir='rtl'> &emsp;<strong> ✔ </strong>&ensp;Status changed to :<strong>Delivered </strong>   </p>, {
				position: "bottom-left",
				autoClose: 7000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		}
		catch (error) {
			toast.error(<p>{error.message}</p>, {
				position: "bottom-left",
				autoClose: 7000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		}
	}

	return (
		<div>
			<section>
				<p className={style.text} >Customer Name : {props.data.customerName}</p>
				<p className={style.text} >Address : {props.data.customerAddress}</p>
				<p className={style.text} >Phone : {props.data.tell}</p>
				<p className={style.text}>Order time:{convertDateToPersian(props.data.createdAt)}</p>

			</section>
			<TableContainer component={Paper}>
				<Table size='small' className={classes.table} aria-label="customized table">
					<TableHead>
						<StyledTableRow className={classes.tableRow}   >
							<StyledTableCell align="right"> goods</StyledTableCell>
							<StyledTableCell align="right"> Number</StyledTableCell>
							<StyledTableCell align="right"> price </StyledTableCell>

						</StyledTableRow  >
					</TableHead>
					<TableBody>

						{
							JSON.parse(props.data.orderList).map(row => {
								return (
									<StyledTableRow key={row.id} className={classes.tableRow} >
										<StyledTableCell align="right">{row.productName}</StyledTableCell>
										<StyledTableCell align="right">{row.number}</StyledTableCell>
										<StyledTableCell align="right">{row.productPrice}</StyledTableCell>
									</StyledTableRow>
								)
							})
						}
					</TableBody>
				</Table>
			</TableContainer>
			<div className={classes.modalBottom}>
				{props.data.delivered == 'true' && props.data.paid == 'true' && <p className={style.bottomText} >Delivery time: {convertDateToPersian(props.data.endProccessTime)}</p>}
				{props.data.delivered == 'false' && props.data.paid == 'true' && <Button onClick={orderDelivered} variant='contained' color='primary' > delivered </Button>}
				{props.data.paid == 'false' && <p className={classes.failText} >payment failed</p>}
			</div>
		</div>
	);
}
