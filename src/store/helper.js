
import { getCookie } from 'cookies-next'; 
const getAuthHeader = () => {
    const token = getCookie('token');
    return {
      headers: { Authorization: `jwt ${token}` }
    };
};
export{
    getAuthHeader
}  