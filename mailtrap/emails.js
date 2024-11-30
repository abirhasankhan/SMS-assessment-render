import { mailtrapClient, sender } from "./mailtrap.config.js";
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({  // Corrected 'sent' to 'send'
            from: sender,
            to: recipient,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email verification",
        });

        console.log("Email sent successfully", response);

    } catch (error) {
        console.log("Error sending email", error);
        throw new Error(`Error sending email: ${error}`);
    }
}

export const sendWelcomeEmail = async (email, name) => {

    const recipient = [{ email }];

    try {

        const response = await mailtrapClient.send({   
            from: sender,
            to: recipient,
            template_uuid: "75dda114-e57c-47be-9a02-f3205ea4a3d6",
            template_variables: {
                "company_info_name": "Auth Comp",
                "name": name
            }
        });

        console.log("Welcome email sent successfully", response);
        
        
    } catch (error) {

        console.log("Error sending welcome email", error);
        throw new Error(`Error sending welcome email: ${error}`);
    }

}

export const sendResetPasswordEmail = async (email, resetURL) => {

    const recipient = [{ email }];

    try {

        const response = await mailtrapClient.send({   
            from: sender,
            to: recipient,
            subject: "Reset password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password reset",

        });

        console.log("Reset password email sent successfully", response);
        
    } catch (error) {

        console.log("Error sending reset password email", error);

        throw new Error(`Error sending reset password email: ${error}`);
        
    }
}

export const sendResetSuccessEmail = async (email) => {  
    const recipient = [{ email }];

    try {

        const response = await mailtrapClient.send({   
            from: sender,
            to: recipient,
            subject: "Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password reset",
        });

        console.log("Password reset email sent successfully", response);
        
    } catch (error) {

        console.log("Error sending password reset success email", error);

        throw new Error(`Error sending password reset success email: ${error}`);
        
    }
}
