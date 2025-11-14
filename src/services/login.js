// import { apiClient } from '../config';

// export const login = async (input) => {
//   try {
//     const response = await apiClient.post('/member-login', {
//       mobileNumber: input.mobileNumber,
//       pin: input.pin
//     });
//     return response.data;
//   } catch (error) {
//     console.log(error,"rrrr");

//     throw error.response?.data || { message: 'Login failed' };
//   }
// };

// export const setAuthToken = (token) => {
//   if (token) {
//     localStorage.setItem('userToken', token);
//   } else {
//     localStorage.removeItem('userToken');
//   }
// };

// export const getCurrentUser = () => {
//   const user = localStorage.getItem('userData');
//   return user ? JSON.parse(user) : null;
// };

import apiClient from "../config";

class LoginApiProvider {
  
  async login(input) {
    try {
      const response = await apiClient.post(`/member-login`, input);

      if (response.status === 200 || response.status === 201) {
        return { status: true, response: response.data };
      } else {
        console.error(
          "Failed to fetch categories:",
          response.data?.message ?? "Something went wrong"
        );
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
        console.error(
          "Failed to fetch register:",
          response.data?.message ?? "Something went wrong"
        );
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



  
  async getMemberProfile(id) {
    try {
      const response = await apiClient.get(`/members/${id}`);
      return response.data;
    } catch (err) {
      console.error("Fetch error:", err);
      throw err;
    }
  }

  async updateMemberProfile(id, input) {
    try {
      const response = await apiClient.put(
        `/members/profile/update/${id}`,
        input
      );

      if (response.status === 200 || response.status === 201) {
        return { status: true, response: response.data };
      } else {
        console.error(
          "Failed to fetch register:",
          response.data?.message ?? "Something went wrong"
        );
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

  async getNotifications() {
    try {
      const response = await apiClient.get(`/notifications/list`);

      if (response.status === 200 || response.status === 201) {
        return { status: true, response: response.data };
      } else {
        console.error(
          "Failed to fetch categories:",
          response.data?.message ?? "Something went wrong"
        );
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
  async getMemberById(input) {
    try {
      const response = await apiClient.get(`/members/${input}`);

      if (response.status === 200 || response.status === 201) {
        return { status: true, response: response.data };
      } else {
        console.error(
          "Failed to fetch categories:",
          response.data?.message ?? "Something went wrong"
        );
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
  async profileCompletionPercentage(input) {
    try {
      console.log(input, "test55");
      const response = await apiClient.get(
        `/members/profile-Completion-Percentage/${input}`
      );

      if (response.status === 200 || response.status === 201) {
        return { status: true, response: response.data };
      } else {
        console.error(
          "Failed to fetch categories:",
          response.data?.message ?? "Something went wrong"
        );
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
}
const loginApiProvider = new LoginApiProvider()
export default loginApiProvider