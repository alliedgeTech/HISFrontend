import React from 'react';
// import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
// import { styled } from '@mui/system';
import Icon from "@mui/material/Icon";

// const CustomEditIcon = styled(EditOutlinedIcon)({
//   // Add your custom styles here
//   color: '#25396f', // Set the desired color
//   cursor: 'pointer',
//   '&:hover': {
//     color: 'rgba(37, 57, 111, 0.8)', // Adjust the opacity for a lighter color on hover
//   },
// });

// // Define custom styles for the icon
// const CustomIconWrapper = styled(Icon)(({ theme }) => ({
//   color: '#25396f',
//   cursor: 'pointer',
//   '&:hover': {
//     color: 'rgba(37, 57, 111, 0.8)', // Utilize theme palette for consistent styling
//   },
// }));


function CustomIconButton({iconName='editOutlined',...rest}) {
  return (
      <Icon className="material-icons-outlined" {...rest}>{iconName}</Icon>
  );
}

export default CustomIconButton;
