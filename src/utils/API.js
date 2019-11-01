import axios from "axios";

// API's URL
export default axios.create({
  baseURL: "https://dist-sys-1.herokuapp.com/api/",
  responseType: "json"
});
