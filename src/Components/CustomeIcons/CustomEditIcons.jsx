import React from 'react';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { styled } from '@mui/system';

const CustomEditIcon = styled(EditOutlinedIcon)({
  // Add your custom styles here
  color: '#25396f', // Set the desired color
  cursor: 'pointer',
  '&:hover': {
    color: 'rgba(37, 57, 111, 0.8)', // Adjust the opacity for a lighter color on hover
  },
});

function CustomIconButton() {
  return (
    <CustomEditIcon />
  );
}

export default CustomIconButton;
