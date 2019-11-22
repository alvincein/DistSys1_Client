import axios from "axios";

// RPC's URL
export default axios.create({
  baseURL: "https://distsys-api.herokuapp.com/rpc",
  responseType: "json"
});
