import commonApi from 'api';

const transformTranslations = (translations) => {
  return translations.reduce((acc, curr) => {
    Object.entries(curr.data).forEach(([lang, translation]) => {
      if (!acc[lang]) {
        acc[lang] = { translation: {} };
      }
      acc[lang].translation[curr.code] = translation;
    });
    return acc;
  }, {});
};
const getLocalization = async (host) => {
  try {
    return await commonApi({
      action: 'getLocalize',
      data: {
        module: 'ADMIN',
      },
      config: { headers: { origin: host } },
    }).then(async ({ data = [] }) => {
      return transformTranslations(data.data);
    });
  } catch (error) {
    console.error('swr_error: ', error);
    return { localizeData: {} };
  }
};

export default async function swrHandler(req, res) {
  try {
    const LCdata = await getLocalization(req.headers.host);
    res.send(LCdata);
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
}
