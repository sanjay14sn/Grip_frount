import apiClient from "../config";

const topAchiverApi = {
  async getTopAchiver(chapterId) {
    try {
      const token = localStorage.getItem("userToken");

      const response = await apiClient.get(
        `/chapters/top-performer-monthly/${chapterId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return {
        status: response.data.success ?? true,
        message: response.data.message,
        data: response.data.data,
      };
    } catch (error) {
      return {
        status: false,
        message: error.message,
        data: null,
      };
    }
  },
};

export default topAchiverApi;
