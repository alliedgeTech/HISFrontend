import React from 'react'
import TableClasses from './TableMainBox.module.css'
import CustomAddIcons from '../CustomeIcons/CustomAddIcons'
import CustomButton from '../Button/Button'

function TableMainHeader({title,buttonText,onClick}) {
    return (
        <div className={TableClasses["tableMainHeader-container"]}>
                <div style={{color:"#25396f"}} className={TableClasses["tableMainHeader-text"]}>{title}</div>
                <CustomButton buttonText={buttonText} onClick={onClick} size={"large"} variant={"contained"} startIcon={<CustomAddIcons/>}/>
        </div>
    )
}   

function TableMainBox({children,customHeader,title,buttonText,onClick}) {
  return (
    <div className={TableClasses["tableMainBox-container"]}>
        {
            customHeader ? customHeader : <TableMainHeader title={title} buttonText={buttonText} onClick={onClick} />
        }
            {children}
    </div>  
  )
}

export default TableMainBox