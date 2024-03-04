import React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { styled } from '@mui/system';

// const CustomLoadingButton = styled(LoadingButton)({
//   background: "#25396f",
//   textTransform: 'none',
//   letterSpacing: "1px",
//   transition: "background 0.3s ease",
//   '&:hover': {
//     background: 'rgba(37, 57, 111, 0.85)',
//   },
// });

//* please provide me and color in hex code
const CustomLoadingButton = styled(LoadingButton)(({ hoverColor, buttonColor }) => ({
  background: buttonColor || "#25396f", // Use the provided buttonColor or fallback to the primary buttonColor from the theme
  textTransform: 'none',
  letterSpacing: "1px",
  transition: "background 0.3s ease",
  '&:hover': {
    background: hoverColor ? `${hoverColor}` : 'rgba(37, 57, 111, 0.85)', // Adjust hover buttonColor based on the provided buttonColor or primary buttonColor
  },
}));


function CustomButton({ variant, disabled, href, onClick = () => {}, color, size, startIcon, endIcon, buttonText,loading,fullWidth,type,hoverColor }) {
  return (
    <CustomLoadingButton
      type={type}
      variant={variant || "contained"}
      disabled={disabled}
      href={href}
      onClick={onClick}
      buttonColor={color}
      hoverColor={hoverColor}
      // color={color}
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
