import axios from "axios";

// RPC's URL
export default axios.create({
  baseURL: "https://dist-sys-1.herokuapp.com/rpc",
  responseType: "json"
});
