import { withSessionRoute } from '../../../lib/withSession';

async function getPermission(request, response) {
  response.json({ permissions: request.session.rolePermissions });
}

export default withSessionRoute(getPermission);
