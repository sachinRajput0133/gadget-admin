import getConfig from "next/config";

const {publicRuntimeConfig} = getConfig()



const CONFIG = {
  API_URL: `${publicRuntimeConfig.NEXT_PUBLIC_FETCH_URL}/admin` || 'http://localhost:5000/admin'
};

export default CONFIG;