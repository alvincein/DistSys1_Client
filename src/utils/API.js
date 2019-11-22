import axios from "axios";

// API's URL
export default axios.create({
  baseURL: "https://distsys-api.herokuapp.com/api/",
  responseType: "json"
});
