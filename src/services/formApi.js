import { toast } from "react-toastify";
import apiClient from "../config";

class FormApiProvider {

    async login(input) {
        try {
            const response = await apiClient.post(`/member-login`, input);

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch categories:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching category:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }


    async registerForm(input) {
        try {
            const response = await apiClient.post(`/members`, input);

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch register:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching register:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }

    async getChapterByMember(input) {
        try {
            const response = await apiClient.get(`/members/by-chapter/${input}`);

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch categories:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching category:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }

    async getAllChapter(input) {
        try {
            const response = await apiClient.get(`/chapters/list`);

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch categories:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching category:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }


    async submitOneToOne(input) {
        try {
            const response = await apiClient.post(`/onetoone`, input);

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch register:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching register:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }

    async submitvisitors(input) {
        try {
            const response = await apiClient.post(`/visitors`, input);

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                return { status: false, response: response.data };
            }
        } catch (error) {
            return { status: false, response: error.response?.data ?? null };
        }
    }


    // expectedvisitor
    async submitExpectedVisitors(input) {
        try {
            const token = localStorage.getItem("userToken");

            const response = await apiClient.post(`/expectedVisitors`, input, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                return { status: false, response: response.data };
            }
        } catch (error) {
            return { status: false, response: error.response?.data ?? null };
        }
    }

    async getExpectedVisitorsDatasById(from, to) {
  try {
    const token = localStorage.getItem("userToken");

    const response = await apiClient.get(
      "/expectedVisitors",
      {
        params: {
          fromDate: from,
          toDate: to,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      return { status: true, response: response.data };
    } else {
      return { status: false, response: response.data };
    }
  } catch (error) {
    return { status: false, response: error.response?.data ?? null };
  }
}





    async getOneToOneDatasById(from, to) {
        console.log("getOneToOneDatasById called with from:", from, "to:", to);

        try {
            const response = await apiClient.get(`/onetoone/list`, {
                params: {
                    fromDate: from,
                    toDate: to
                }
            });

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch categories:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching category:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }

    async getVisitorsDatasById(from, to) {
        try {
            const response = await apiClient.get(`/visitors/list`, {
                params: {
                    fromDate: from,
                    toDate: to
                }
            });

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch categories:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching category:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }

    async submitThankyouSlip(input) {
        try {
            const response = await apiClient.post(`/thankyouslips`, input);

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch register:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching register:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }

    async getThankyouSlipDatasById(from, to) {
        try {
            const response = await apiClient.get(`/thankyouslips/given/list`, {
                params: {
                    fromDate: from,
                    toDate: to
                }
            });

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch categories:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching category:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }

    async submitReferal(input) {
        try {
            const response = await apiClient.post(`/referralslip`, input);

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch register:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching register:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }

    async getReferalDatasById(from, to) {
        try {
            const response = await apiClient.get(`/referralslip/given/list`, {
                params: {
                    fromDate: from,
                    toDate: to
                }
            });

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch categories:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching category:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }

    async submitTestimonial(input) {
        try {
            const response = await apiClient.post(`/testimonialslips`, input);

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch register:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching register:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }

    async getTestimonialDatasById(input) {
        try {
            const response = await apiClient.get(`/testimonialslips/given/list`);

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch categories:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching category:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }

    async getThankyouReceivedDatasById(from, to) {
        try {
            const response = await apiClient.get(`/thankyouslips/received/list`, {
                params: {
                    fromDate: from,
                    toDate: to
                }
            });

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch categories:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching category:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }

    async getReferalReceivedDatasById(from, to) {
        try {
            const response = await apiClient.get(`/referralslip/received/list`, {
                params: {
                    fromDate: from,
                    toDate: to
                }
            });

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch categories:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching category:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }

    async getTestimonialReceivedDatasById(from, to) {
        try {
            const response = await apiClient.get(`/testimonialslips/received/list`, {
                params: {
                    fromDate: from,
                    toDate: to
                }
            });

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch categories:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching category:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }

    async getTestimonialGivenDatasById(from, to) {
        try {
            const response = await apiClient.get(`/testimonialslips/given/list`, {
                params: {
                    fromDate: from,
                    toDate: to
                }
            });

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch categories:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching category:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }
    async getDashboardFormCount(input) {
        try {
            // http://localhost:3004/api/admin/dashboard/count-summary?filterType=this month
            const response = await apiClient.get(`/dashboard/count-summary`, { params: input });

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch categories:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching category:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }

    async getMembersAttendanceCount(id) {
        try {
            const response = await apiClient.get(`/members/meetings-attendance-count/${id}`);


            if (response.status === 200 || response.status === 201) {
                return { success: true, data: response.data.data };
            } else {
                console.error("Failed to fetch attendance counts:", response.data?.message ?? "Something went wrong");
                return { success: false, data: {} };
            }
        } catch (error) {
            console.error("Error fetching attendance counts:", error);
            return { success: false, data: {} };
        }
    }

    async getOneToOneCounts(userId) {
        try {
            const response = await apiClient.get(`/members/one-to-one-count/${userId}`);

            if (response.status === 200 || response.status === 201) {
                return { success: true, data: response.data.data };
            } else {
                console.error("Failed to fetch one-to-one counts:", response.data?.message);
                return { success: false, data: {} };
            }
        } catch (error) {
            console.error("Error fetching one-to-one counts:", error);
            return { success: false, data: {} };
        }
    }

    async getOneToOneGivenCounts(userId) {
        try {
            const response = await apiClient.get(`/members/one-to-one-given-count/${userId}`);

            if (response.status === 200 || response.status === 201) {
                return { success: true, data: response.data.data };
            } else {
                console.error("Failed to fetch one-to-one given counts:", response.data?.message);
                return { success: false, data: {} };
            }
        } catch (error) {
            console.error("Error fetching one-to-one given counts:", error);
            return { success: false, data: {} };
        }
    }

    async getReferralCounts(userId) {
        try {
            const response = await apiClient.get(`/members/referral-count/${userId}`);

            if (response.status === 200 || response.status === 201) {
                return { success: true, data: response.data.data };
            } else {
                console.error("Failed to fetch referral counts:", response.data?.message);
                return { success: false, data: {} };
            }
        } catch (error) {
            console.error("Error fetching referral counts:", error);
            return { success: false, data: {} };
        }
    }

    async getReferralGivenCounts(userId) {
        try {
            const response = await apiClient.get(`/members/referral-given-count/${userId}`);

            if (response.status === 200 || response.status === 201) {
                return { success: true, data: response.data.data };
            } else {
                console.error("Failed to fetch referral given counts:", response.data?.message);
                return { success: false, data: {} };
            }
        } catch (error) {
            console.error("Error fetching referral given counts:", error);
            return { success: false, data: {} };
        }
    }

    async getThankYouSlipAmounts(userId) {
        try {
            const response = await apiClient.get(`/members/thank-you-slip-amounts/${userId}`);

            if (response.status === 200 || response.status === 201) {
                return { success: true, data: response.data.data };
            } else {
                console.error("Failed to fetch ThankYouSlip amounts:", response.data?.message);
                return { success: false, data: {} };
            }
        } catch (error) {
            console.error("Error fetching ThankYouSlip amounts:", error);
            return { success: false, data: {} };
        }
    }

    async getVisitorCounts(userId) {
        try {
            const response = await apiClient.get(`/members/visitor-count/${userId}`);

            if (response.status === 200 || response.status === 201) {
                return { success: true, data: response.data.data };
            } else {
                console.error("Failed to fetch visitor counts:", response.data?.message);
                return { success: false, data: {} };
            }
        } catch (error) {
            console.error("Error fetching visitor counts:", error);
            return { success: false, data: {} };
        }
    }

    async getVisitorReportCounts() {
        try {
            const response = await apiClient.post('/members/visitor-report-count', {
                memberIds: "fromUser",
            });

            if (response.status === 200 || response.status === 201) {
                return { success: true, data: response.data.data };
            } else {
                console.error("Failed to fetch visitor counts:", response.data?.message);
                return { success: false, data: {} };
            }
        } catch (error) {
            console.error("Error fetching visitor counts:", error);
            return { success: false, data: {} };
        }
    }

    // memberApiProvider.ts
    // memberApiProvider.ts
    async getTestimonialCounts(userId) {
        try {
            const response = await apiClient.get(`/members/testimonial-counts/${userId}`);

            if (response.status === 200 || response.status === 201) {
                return { success: true, data: response.data.data };
            } else {
                console.error("Failed to fetch testimonial counts:", response.data?.message);
                return { success: false, data: {} };
            }
        } catch (error) {
            console.error("Error fetching testimonial counts:", error);
            return { success: false, data: {} };
        }
    }


}
const formApiProvider = new FormApiProvider()
export default formApiProvider