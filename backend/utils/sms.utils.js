import axios from 'axios';

const SMSINDIAHUB_API_URL = 'http://cloud.smsindiahub.in/api/mt/SendSMS';

// Generate 6-digit OTP
export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP via SMS India Hub
 * Template: Welcome to the Majdoor Sathi powered by SMSINDIAHUB. Your OTP for registration is {otp}
 */
export const sendOTP = async (mobileNumber, otp) => {
    try {
        const SMSINDIAHUB_API_KEY = process.env.SMSINDIAHUB_API_KEY;
        const SMSINDIAHUB_SENDER_ID = process.env.SMSINDIAHUB_SENDER_ID;
        const NODE_ENV = process.env.NODE_ENV;

        // Formatted number for SMS India Hub (requires 91 prefix)
        let formattedNumber = mobileNumber.toString().trim();
        if (formattedNumber.length === 10) {
            formattedNumber = '91' + formattedNumber;
        }

        // Configuration check
        if (!SMSINDIAHUB_API_KEY || !SMSINDIAHUB_SENDER_ID) {
            console.error('❌ SMS India Hub credentials not configured');
            if (NODE_ENV === 'development') {
                logOTPInConsole(mobileNumber, otp);
                return { success: true, message: 'OTP logged to console (Missing API Key)' };
            }
            return { success: false, message: 'SMS service not configured' };
        }

        // EXACT Template provided by user
        const message = `Welcome to the Majdoor Sathi powered by SMSINDIAHUB. Your OTP for registration is ${otp}`;

        const params = {
            APIKey: SMSINDIAHUB_API_KEY,
            senderid: SMSINDIAHUB_SENDER_ID,
            channel: '2',      // 2 for Transactional/OTP
            DCS: '0',          // Normal text
            flashsms: '0', 
            number: formattedNumber,
            text: message,
            route: '31'        // Standard OTP route
        };

        console.log(`📤 Sending OTP to ${formattedNumber}...`);
        
        if (NODE_ENV === 'development') {
            logOTPInConsole(mobileNumber, otp);
        }

        try {
            const response = await axios.get(SMSINDIAHUB_API_URL, { 
                params,
                timeout: 10000 
            });

            // Handle API responses
            if (response.data && (response.data.ErrorCode === '000' || response.data.ErrorCode === '0')) {
                console.log(`✅ OTP sent successfully to ${formattedNumber}`);
                return { success: true, message: 'OTP sent successfully', data: response.data };
            } else {
                console.error(`❌ SMS API Error: ${JSON.stringify(response.data)}`);
                return { success: false, message: 'Failed to send OTP via gateway', error: response.data };
            }
        } catch (apiError) {
            console.error(`❌ SMS API Network Error: ${apiError.message}`);
            return { success: false, message: 'Network error connecting to SMS gateway' };
        }

    } catch (error) {
        console.error(`❌ Error in sendOTP: ${error.message}`);
        return { success: false, message: 'Internal error sending OTP' };
    }
};

const logOTPInConsole = (mobile, otp) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📱 [DEV] OTP FOR: ${mobile}`);
    console.log(`🔐 CODE: ${otp}`);
    console.log(`${'='.repeat(60)}\n`);
};
