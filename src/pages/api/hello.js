// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function helloAPI(request, response) {
  response.status(200).json({ name: 'John Doe' });
}
