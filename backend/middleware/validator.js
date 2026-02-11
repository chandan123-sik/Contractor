export const validateMobileNumber = (req, res, next) => {
    const { mobileNumber } = req.body;
    
    if (!mobileNumber) {
        return res.status(400).json({
            success: false,
            message: 'Mobile number is required'
        });
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobileNumber)) {
        return res.status(400).json({
            success: false,
            message: 'Please enter a valid 10-digit mobile number'
        });
    }

    next();
};

export const validateRegistration = (req, res, next) => {
    const { mobileNumber, userType, firstName, lastName } = req.body;

    if (!mobileNumber || !userType || !firstName || !lastName) {
        return res.status(400).json({
            success: false,
            message: 'Please provide all required fields'
        });
    }

    const validUserTypes = ['User', 'Labour', 'Contractor'];
    if (!validUserTypes.includes(userType)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid user type'
        });
    }

    next();
};
