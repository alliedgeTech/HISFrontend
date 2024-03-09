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
    console.log("this is date array : ",dateArray);
    return dateArray;

}