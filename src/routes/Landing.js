import React, { useState } from 'react';
import { TextField, Button, IconButton, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import logo from '../assets/orygoo.png';
import '../App.scss';

const OrygooManager = require('@orygoo/orygoo-sdk');

const orygoo = new OrygooManager();

orygoo.createInstance({
  clientKey: 'C-1ecb498e3f32476a9b43ba29da9c9d03',
  secretKey: 'STG-1fca401d5b4d49a3ac098de5462c6213c5061d8c7708406db865e4ceb0a1bf1b'
});

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export const Landing = () => {

  const [userId, setUserId] = useState('')
  const [color, setColor] = useState('')
  const [message, setMessage] = useState('Success!')
  const [severity, setSeverity] = useState('success')
  const [open, setOpen] = useState(false);

  const reset = () => {
    window.localStorage.clear();
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    window.location.reload();
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleSnackBar = (props) => {
    if(props === 'Initialize First'){
      setMessage(props)
      setSeverity('error')
    } else {
      setMessage('Success!')
      setSeverity('success')
    }

    setOpen(true)
  }

  function fetchWithCache(namespaces){
    orygoo.getVariants(['Button'], ['lol']).then(
        res => {
          if(res === 'Initialize First'){
            handleSnackBar('Initialize First')
          } else {
            let keyName = Object.keys(res.value)
            console.log(keyName, res.value[keyName], 'helo key name')
            setColor(res.value[keyName])
          }
        }
    )
  }

  function initialize(){
    orygoo.initialize(userId, null, '1', 'xdigoxinx@gmail.com', '081344559903', 'en', 'ID').then(
        res => {
          console.log(res, 'helo initialize')
          if(res){
            handleSnackBar(res)
          }
        }
    )
  }

  function track(eventName){
    orygoo.trackEvent(eventName, '', '', '').then(
        res => {
          console.log(res, 'helo track')
          if(res){
            handleSnackBar(res)
          }
        }
    )
  }

  const onChangeText = (e) => {
    e.preventDefault();
    setUserId(e.target.value)
  }

    return(
    <div className="App">
      <header className="App-header">
        <img src={logo} alt="orygoo.com" />

        <div className="container">
          <TextField
              id="outlined-basic"
              label="User ID"
              variant="outlined"
              onChange={onChangeText}
              size="small"
              className="input-user-id"
          />

          <Button size="small" color="primary" variant="contained" onClick={() => initialize()}>
            Go
          </Button>
        </div>

        <div className="container">
          <div style={{marginRight: 10}}>
            <Button size="small" color="secondary" variant="outlined" onClick={() => {
              track('Track_1')
            }}>Track 1</Button>
          </div>
          <div style={{marginRight: 10}}>
            <Button size="small" color="secondary" variant="outlined" onClick={() => {
              track('Track_2')
            }}>Track 2</Button>
          </div>
          <div style={{marginRight: 0}}>
            <Button size="small" color="primary" variant="outlined" onClick={() => {
              fetchWithCache()
            }}>Get Variant</Button>
          </div>
        </div>

        <IconButton color="primary" aria-label="upload picture" component="span" onClick={() => reset()}>
          <RotateLeftIcon />
        </IconButton>

        <div style={{ width: 50, height: 50, backgroundColor: color, borderRadius: 8}}/>
      </header>
      <Snackbar open={open} autoHideDuration={1000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </div>
    )
}