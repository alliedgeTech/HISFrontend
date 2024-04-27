import { numericRegex } from "../Constants/index.constant";

export const getDateArrayWithStartDateAndEndDateWithDoctorId = async (startDate, endDate, doctorId) => {
    const dateArray = [];
    
    // Convert startDate and endDate to Date objects
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    // Include startDate and endDate in the array
    if (startDate.getTime() === endDate.getTime()) {
        dateArray.push(doctorId + '_' + startDate.toISOString().split('T')[0]); // Push doctorId prefix + startDate as a string
    } else {
        // Loop through dates from startDate to endDate
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            dateArray.push(doctorId + '_' + currentDate.toISOString().split('T')[0]); // Push doctorId prefix + current date as a string
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }
    return dateArray;

}

export const getYearsOrBirthDate = (data) => {
    //* first we have to found this is date or year
    let isValidNumber = numericRegex.test(data);

    //* if this is year then we birth date of 1st january of that year
    if(isValidNumber) {
        let todayDate = new Date();
        let year = new Date(todayDate.getFullYear() - data,todayDate.getMonth(),todayDate.getDate());
        return year;
    }
    //* if this is date then we calculate the year and return it 
    else {
        let today = new Date();
        let birthDate = new Date(data);
        let age = today.getFullYear() - birthDate.getFullYear();
        let m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
}