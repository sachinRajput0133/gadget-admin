import { withSessionRoute } from '../../../lib/withSession';

async function loginRoute(request, response) {
  request.session.token = request.body.token;
  request.session.user = request.body.user;
  await request.session.save();
  response.send({ ok: true });
}

export default withSessionRoute(loginRoute);
