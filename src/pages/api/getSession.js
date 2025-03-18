import { withSessionRoute } from '../../../lib/withSession';

async function getSession(request, response) {
  await request.session.save();
  response.send({ ok: true });
}

export default withSessionRoute(getSession);
