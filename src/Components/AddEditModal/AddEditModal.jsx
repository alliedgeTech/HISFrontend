import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
  } from '@mui/material';
  import React from 'react';
  import LoadingButton from '@mui/lab/LoadingButton';
  import IconButton from '@mui/material/IconButton';
  import CloseIcon from '@mui/icons-material/Close';
import CustomButton from '../Button/Button';

  function AddEditModal({
    open,
    maxWidth = 'lg',
    children,
    handleClose,
    handleSubmit,
    modalTitle,
    isEdit,
    Loading,
    ButtonText
  }) {
    return (
      <>
        <Dialog  maxWidth={maxWidth} fullWidth open={open} onClose={(event,reason)=> { if(reason === 'backdropClick') return; handleClose(event,reason)}}   >
          <DialogTitle style={{fontWeight:550}}>{modalTitle} 
            <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 30,
              top: 10,
              fontSize:"10px",
              color:'GrayText'
            }}
          >
            <CloseIcon style={{fontSize:"25px"}}/>
          </IconButton>
          
          </DialogTitle>
          <DialogContent
            sx={{
              p: '2rem',
            }}
          >
            {children}
          </DialogContent>
          <DialogActions style={{display:"flex" ,gap:"0.5rem",paddingBottom:"1rem",paddingRight:"1.5rem"}}>
            {/* <Button onClick={handleClose}>Cancel</Button> */}
            <CustomButton loading={Loading} onClick={handleSubmit} buttonText={ ButtonText ? ButtonText : isEdit ? 'Update' : 'Add'}></CustomButton>
            {/* <LoadingButton loading={Loading} variant='contained' onClick={handleSubmit} >{}</LoadingButton> */}
          </DialogActions>
        </Dialog>
      </>
    );
  }
  
  export default AddEditModal;
  