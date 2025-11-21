import apiClient from "../config";

class ReferralApiProvider {
    
    async sendReferralStatusMail(input) {
        try {
            const response = await apiClient.post(`/referrals/send-status-mail`, input);

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to send mail:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error sending mail:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }
}

export default new ReferralApiProvider();
