import { withSessionRoute } from '../../../lib/withSession';

async function userData(request, response) {
  response.json({ user: request.session?.user });
}

export default withSessionRoute(userData);
