import { withSessionRoute } from '../../../lib/withSession';

async function getToken(request, response) {
  response.json({ token: request.session.token });
}

export default withSessionRoute(getToken);
