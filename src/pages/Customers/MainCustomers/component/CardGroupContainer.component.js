import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { MediaCard } from '../../../../components/index.components';
import { getData } from '../../../../api/API';
import { Spinner } from '../../../../components/index.components'
import { Divider } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexGrow: 1,

    margin: ' 20px',
    [theme.breakpoints.up('sm')]: {
      minWidth: 1000,
    },
  },
  rootContainer: {
    borderRadius: 5,
  },
  title: {
    fontSize: '1.4rem',
    marginBottom: 50,
    color: "#777"
  },
  paper: {
    padding: 40
  },
  divider: {
    marginTop: 60,
    marginBottom: 30
  }

}));

function CardGroupContainer(props) {

  const [state, setState] = useState({ data: [{}] })
  const [loading, setLoading] = useState(true)

  useEffect(async () => {

    // set a new async function because in useEffect we cant use async request directly :  
    const fetchData = async () => {
      const field = props.field
      const pageNumber = 1
      const dataLimit = 6
      const { data,status } = await getData(field, pageNumber, dataLimit)
      setState({ data: data })
      return data
    }

    const data = await fetchData()
    if (data) {
      setLoading(false)
    }
  }, [loading])


  const classes = useStyles();
  if (!loading) {
    return (
      <div className={classes.rootContainer}>
        <div className={classes.root}>

          <Grid container spacing={3}  >
            <h2 className={classes.title}>{state.data[0].group} </h2>
          </Grid>

          <Grid container spacing={3} justify='space-evenly' >
            {
              state.data.map((row) => {
                return <MediaCard key={row.id} {...row} />
              })
            }
          </Grid>

        </div>
        <Divider variant='middle' className={classes.divider} />
      </div>
    );
  }

  if (loading === true) {
    return (
      <div className={classes.root}>
        <Grid container spacing={3}  >
          <h2 className={classes.title}> </h2>
        </Grid>

        <Grid container justify='center' >

          <Spinner />

        </Grid>
      </div>

    )
  }

}

export { CardGroupContainer }