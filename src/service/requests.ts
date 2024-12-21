import https from 'node:https';

const ADJUTOR_API_KEY = process.env.ADJUTOR_API_KEY as string;
const HOSTNAME = 'adjutor.lendsqr.com';

const makeHttpsRequest = (options: https.RequestOptions, params: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          resolve(parsedData);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', error => {
      reject(error);
    });

    req.write(params);
    req.end();
  });
}

type KarmaResponse = {
  karma_identity: string;
  amount_in_contention: string;
  reason?: string;
  default_date: Date;
  karma_type: Object;
  karma_identity_type: Object;
  reporting_entity: Object;
}

export const makeKarmaRequest = async(email: string): Promise<KarmaResponse> => {
  const options: https.RequestOptions = {
    method: "GET",
    hostname: HOSTNAME,
    port: 443,
    path: '/v2/verification/karma/' + email,
    headers: {
      Authorization: 'Bearer ' + ADJUTOR_API_KEY,
    }
  }
  const response = await makeHttpsRequest(options, "");
  if (response.status !== "success") throw new Error(response.message);
  return response.data;
}