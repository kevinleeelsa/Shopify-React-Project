import React, { useEffect, useState } from 'react';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { connect } from 'react-redux';
import { addSumPrice, deleteCart } from '../../../redux/actions';
import { Toolbar } from '@material-ui/core';
import { TableContainer } from '../../../components/index.components'
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import DeleteOrder from './DeleteOrder.component'
import { BASE_URL } from '../../../api/Variables.api';

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




const useStyles = makeStyles({
  paper: {
    minWidth: 400,
  },
  row: {
    padding: 7
  },
  button: {
    height: 40
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between'
  },
  noCartText: {
    fontSize: 20,
    textAlign: 'center',
    alignSelf: 'center'
  },
  tableBottom: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: 0,
    alignItems: 'center',
  },
  link: {
    textDecoration: 'none'
  },
  sumPriceText: {
    color: '#111',
    fontWeight: 'bold',
    padding: '7px 10px',
    margin: 0,
    boxShadow: '0 0px 3px #ccc',
    borderRadius: '4px',
    height: 38,
    backgroundColor: 'rgb(206, 255, 206)'
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 5,
    border: '.5px solid #ccc'
  },
  imageCell: {
    margin: 0,
    padding: '6px 4px 0px 4px',
  }
});





function Cart(props) {

  const [state, setState] = useState({ data: [{}] })
  const [isRerender, setIsRerender] = useState('true')
  const [sumPrice = 0, setSumPrice] = useState(0)


  useEffect(async () => {
    if (isRerender === 'true') {

      setIsRerender('false')
      const cart = props.cart
      await setState({ data: cart })
      sumCart()


    }
    else {
      const cart = props.cart
      await setState({ data: cart })
      sumCart()
    }
  }, [isRerender])



  const classes = useStyles();


  const handleRerender = async (isRerender) => {
    console.log('rerender called')
    await setIsRerender(isRerender)
  }

  const sumCart = () => {
    let sumPrice = 0
    state.data.map(item => {
      const price = item.productPrice
      const count = item.number

      const sum = count * price

      sumPrice += sum
    })
    const persianNumberPrice = new Number(sumPrice).toLocaleString("fa-IR")
    setSumPrice(persianNumberPrice)
    props.addSumPrice(persianNumberPrice)

  }



  return (
    <TableContainer component={Paper} className={classes.paper}>
      <Toolbar />
      <div className={classes.container} >
        <div>
          <Table className={classes.table} aria-label="customized table">
            <TableHead>
              <TableRow>

                <StyledTableCell align="right">تصویر </StyledTableCell>
                <StyledTableCell align="right">کالا </StyledTableCell>
                <StyledTableCell align="right"> قیمت</StyledTableCell>
                <StyledTableCell align="right">  تعداد </StyledTableCell>
                <StyledTableCell align="right">  </StyledTableCell>


              </TableRow>
            </TableHead>
            {
              state.data[0] ? <TableBody>
                {
                  state.data.map((row) => (
                    <StyledTableRow key={Math.random()}>

                      <StyledTableCell className={classes.imageCell} align="right"><img className={classes.image} src={`${BASE_URL}${row.image}`} alt='تصویر کالا' />   </StyledTableCell>

                      <StyledTableCell className={classes.row} align="right">
                        <Link className={classes.link} to={`/home/products/${row.group}/${row.subgroup}/${row.productId}`}>
                          {row.productName}
                        </Link>
                      </StyledTableCell>
                      <StyledTableCell className={classes.row} align="right">{row.productPrice}</StyledTableCell>
                      <StyledTableCell className={classes.row} align="right">{row.number}</StyledTableCell>
                      <StyledTableCell className={classes.row} align="right">
                        <DeleteOrder id={row.id} group={row.group} isRerender={handleRerender} newCart={(newCart => setState(newCart))} />
                      </StyledTableCell>

                    </StyledTableRow>)
                  )
                }
              </TableBody> :
                <p className={classes.noCartText} > محصولی در سبد خرید موجود نمی باشد </p>
            }

          </Table>
        </div>

        <div className={classes.tableBottom} >
          <p className={classes.sumPriceText} >جمع خرید : {sumPrice}  تومان </p>
          {
            state.data[0] ? <Link className={classes.link} to='/checkout'>
              <Button variant='contained' color='secondary' className={classes.button} >
                نهایی کردن سبد خرید
              </Button>
            </Link> :
              <Button disabled='true' variant='contained' color='secondary' className={classes.button} >
                نهایی کردن سبد خرید
              </Button>
          }
        </div>

      </div>
    </TableContainer>


  );
}

const mapStateToProps = (state) => ({
  cart: state.cart
})

const mapDispatchToProps = (dispatch) => {
  return {
    deleteCart: () => dispatch(deleteCart()),
    addSumPrice: (price) => dispatch(addSumPrice(price))
  }
}


const ShoppingCart = connect(mapStateToProps, mapDispatchToProps)(Cart)
export { ShoppingCart }



