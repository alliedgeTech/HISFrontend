import React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { styled } from '@mui/system';

const CustomLoadingButton = styled(LoadingButton)({
  background: "#25396f",
  textTransform: 'none',
  letterSpacing: "1px",
  transition: "background 0.3s ease",
  '&:hover': {
    background: 'rgba(37, 57, 111, 0.85)',
  },
});

function CustomButton({ variant, disabled, href, onClick = () => {}, color, size, startIcon, endIcon, buttonText,loading,fullWidth }) {
  return (
    <CustomLoadingButton
      variant={variant || "contained"}
      disabled={disabled}
      href={href}
      onClick={onClick}
      color={color}
      size={size}
      startIcon={startIcon}
      endIcon={endIcon}
      loading={loading}
      fullWidth={fullWidth}
    >
      {buttonText}
    </CustomLoadingButton>
  );
}

export default CustomButton;
