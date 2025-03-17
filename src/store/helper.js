
import Cookies from 'js-cookie';
const getAuthHeader = () => {
    const token = Cookies.get('token');
    return {
      headers: { Authorization: `Bearer ${token}` }
    };
  };
export{
    getAuthHeader
}  