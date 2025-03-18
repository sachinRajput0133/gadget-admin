import { withSessionRoute } from '../../../lib/withSession';

async function logoutRoute(request, response) {
  await request.session.destroy();
  response.send({ ok: true });
}

export default withSessionRoute(logoutRoute);
