import { makeStyles } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { deleteProducts } from '../../../../../api/API'

const useStyle = makeStyles({
	deleteButton: {
		cursor: 'pointer',
		color: 'darkblue'
	}
})

function DeleteButton(props) {

	const classes = useStyle()

	const [id, setId] = useState()
	const [field, setField] = useState()


	useEffect(() => {

		if (props.productField) {
			const productField = props.productField
			setField(productField)
		}
		if (props.productId) {
			const productId = props.productId
			setId(productId)
		}

	}, [])

	const handleDeleteProduct = async () => {
		// Api enter ... 
		const productId = id
		const productField = field
		const confirm = window.confirm('Are you sure you want to remove this product ?')
		if (confirm) {

			try {
				await deleteProducts(productId, productField)
				props.isRerender('yes')
			}
			catch (error) {
				console.log(error.message)
			}

			console.log('product was removed ');
		} else {
			// Do nothing!
			console.log('product was not removed ');
		}
	}

	return (
		<span
			onClick={handleDeleteProduct}
			className={classes.deleteButton} >
			Delete
		</span >

	)
}

export default DeleteButton
