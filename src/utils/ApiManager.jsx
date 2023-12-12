import toast from "react-hot-toast";
export default class APIManager {
  constructor(props) {

  }

  checkInternet() {
    if (!window.navigator.onLine) {
      toast.error('Please connect to internet');
      return false;
    }
    return true;
  }

  sendResponse(data) {
    if (!data) {
      return {  
        error:true,
        data:null,
        message:"Server is on maintenance",
      } ;
      // window.location.href = '/error404';
    }
    else if (!data.success) {
      toast.error(data.message || "something went wrong");
      return {
       error:true,
        data:null,  
        message:data.message,
      }
    }
    console.log("this is real data : ", data);
    return {
      data: data,
      error: !data.success,
      message: data.message
    };
  }

  async requestForm(endpoint, method, body) {
    if (this.checkInternet()) {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND}${endpoint}`,
        {
          method: method,
          headers: {
            accept: '*/*',
            // Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: body,
        },
      );
      const data = await response.json();
      return this.sendResponse(data, response);
    }
    return;
  }

  async request(endpoint, method, body, extraParam = {}) {
    const { isProtected = true } = extraParam;
    const baseUrl = `${process.env.REACT_APP_BACKEND}`;
    if (this.checkInternet()) {
      let response, data;
      try {
        console.log("this is i am get the base url : ",baseUrl);
        response = await fetch(`${baseUrl}${endpoint}`, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            accept: '*/*',
            // Authorization: `Bearer ${localStorage.getItem('boilerPlateToken')}`,
          },
          body: JSON.stringify(body),
        });
        data = await response.json();
      } catch (error) {
        // throw error;
      }
      return this.sendResponse(data, response);
    }
    return {error:true,data:null,message:"Please connect to internet"};
  }

  async get(endpoint, extraParams) {
    return await this.request(endpoint, 'GET', undefined, extraParams);
  }

  async post(endpoint, body, extraParams) {
    return await this.request(endpoint, 'POST', body, extraParams);
  }

  async postForm(endpoint, body, extraParams) {
    return await this.requestForm(endpoint, 'POST', body, extraParams);
  }

  async patchForm(endpoint, body, extraParams) {
    return await this.requestForm(endpoint, 'PATCH', body, extraParams);
  }

  async put(endpoint, body, extraParams) {
    return await this.request(endpoint, 'PUT', body, extraParams);
  }   

  async patch(endpoint, body, extraParams) {
    return await this.request(endpoint, 'PATCH', body, extraParams);
  }

  async delete(endpoint, body, extraParams) {
    return await this.request(endpoint, 'DELETE', body, extraParams);
  }
}
