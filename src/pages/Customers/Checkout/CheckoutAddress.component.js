import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { DateInput } from 'react-hichestan-datetimepicker';
import { connect } from 'react-redux';
import { deleteCart } from '../../../redux/actions';



import Input from '@material-ui/core/Input';
import { finalizeCart } from '../../../api/API';

const useStyles$ = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

function Inputs() {
  const classes = useStyles$();

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <Input defaultValue="Hello world" inputProps={{ 'aria-label': 'description' }} />
      <Input placeholder="Placeholder" inputProps={{ 'aria-label': 'description' }} />
      <Input defaultValue="Disabled" disabled inputProps={{ 'aria-label': 'description' }} />
      <Input defaultValue="Error" error inputProps={{ 'aria-label': 'description' }} />
    </form>
  );
}





const useStyles = makeStyles((theme) => ({
  container: {
    // overflow:'auto'
  },
  label: {
    marginBottom: '10px'
  },
  typography: {
    textAlign: 'center',
    marginTop: 30,
    paddingBottom: 30
  },
  textField: {
    marginTop: 10
  },
  highlightText: {
    color: '#aaa'
  },
  datePicker: {
    height: 40,
    borderRadius: '5px',
    marginTop: 10,
    border: '1px solid #bbb',
    padding: '10px',
    '&:focus': {
      border: '2px solid #3F51B5',
      outline: 'none'
    },
    '&:hover': {
      border: '1px solid #111',
      outline: 'none'
    }
  }
}))


function PaymentAdd(props) {

  // convert date to iso to send server :
  const date = new Date()
  // const isoDate = date.toISOString()
  const time = date.getTime()
  const [state, setState] = useState(time)
  const [plainDate, setPlainDate] = useState(date)
  const [name, setName] = useState('')
  const [family, setFamily] = useState('')
  const [tell, setTell] = useState('')
  const [address, setAddress] = useState('')

  const classes = useStyles()

  const handleChangeDatePicker = (event) => {
    let plainDate = event.target.value
    const epochTime = new Date(plainDate).getTime()
    setState(epochTime);
    setPlainDate(plainDate)
  };


  const handleSubmitForm = async (event) => {
    event.preventDefault()
    const cart = JSON.stringify(props.cart)
    const sumPrice = JSON.stringify(props.price)
    console.log(sumPrice)



    const data = new FormData()
    data.append('customerName', name + ' ' + family)
    data.append('customerAddress', address)
    data.append('deliveryTime', state)
    data.append('orderList', cart)
    data.append('tell', tell)
    data.append('sumPrice', sumPrice)
    data.append('delivered', 'false')
    data.append('paid', 'false')

    try {
      const response = await finalizeCart(data)
      // console.log(response.data.id)
      const id = response.data.id
      const orderNumber = tell
      const paramName = name + ' ' + family
      // const paramPrice = props.price
      window.location.href = `http://localhost:3050/payment?number=${orderNumber}&name=${paramName}&id=${id}`;
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div className={classes.container}>
      {/* <Toolbar /> */}
      <Typography className={classes.typography} variant="h6" gutterBottom>
        نهایی کردن خرید
      </Typography>
      <form onSubmit={handleSubmitForm} >

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>

            <label className={classes.label} for='firstName' >نام :</label>
            <TextField
              className={classes.textField}
              size='small'
              required
              id="firstName"
              name="firstName"
              // label="First name"
              fullWidth
              variant='outlined'
              autoComplete="given-name"
              onChange={(event) => setName(event.target.value)}
            />

          </Grid>
          <Grid item xs={12} sm={6}>
            <label className={classes.label} for='lastName' >نام خانوادگی :</label>

            <TextField
              className={classes.textField}
              size='small'
              required
              id="lastName"
              name="lastName"
              fullWidth
              variant='outlined'
              autoComplete="family-name"
              onChange={(event) => setFamily(event.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <label className={classes.label} for='address1' >آدرس :</label>
            <TextField
              className={classes.textField}
              size='small'
              required
              id="address1"
              name="address1"
              fullWidth
              variant='outlined'
              autoComplete="shipping address-line1"
              onChange={(event) => setAddress(event.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <label className={classes.label} for='firstName' >  تلفن همراه  :<span className={classes.highlightText} > جهت هماهنگی ارسال سفارش</span></label>
            <TextField
              required
              className={classes.textField}
              size='small'
              id="address2"
              name="address2"
              variant='outlined'
              fullWidth
              autoComplete="shipping address-line2"
              onChange={(event) => setTell(event.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <label className={classes.label} for='date'> انتخاب تاریخ :</label>
            <DateInput
              className={classes.datePicker}
              id='date'
              value={plainDate}
              name={'myDateTime'}
              onChange={handleChangeDatePicker}
            />
          </Grid>

          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
            <Button type='submit' variant='contained' color='primary'  >
              پرداخت
            </Button>
          </Grid>

        </Grid>

      </form>

    </div>
  );
}

const mapStateToProps = (state) => ({
  cart: state.cart,
  price: state.price
})

const mapDispatchToProps = (dispatch) => {
  return {
    deleteCart: () => dispatch(deleteCart())
  }
}

const PaymentAddress = connect(mapStateToProps, mapDispatchToProps)(PaymentAdd)
export { PaymentAddress }



