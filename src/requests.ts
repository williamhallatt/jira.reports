import { handleError } from './utilities';
import axios, { AxiosRequestConfig } from 'axios';
import { SprintQuery, SprintReport } from './interfaces';

export const requestSprintsForBoard = async (
  boardId: number
): Promise<SprintQuery | null> => {
  const config: AxiosRequestConfig = {
    method: 'GET',
    url: `https://${process.env.URL}/rest/greenhopper/1.0/sprintquery/${boardId}?includeFutureSprints=true&includeHistoricSprints=true`,
    headers: {
      cookie: `_csrf=${process.env.CSRF}; atlassian.xsrf.token=${process.env.XSRF}; cloud.session.token=${process.env.CLOUD_SESSION}`,
    },
  };

  try {
    const res = await axios.request<SprintQuery>(config);
    return res.data;
  } catch (error) {
    handleError(error);
  }

  return null;
};

export const requestSprintReport = async (
  boardId: number,
  sprintId: number
): Promise<SprintReport | null> => {
  const config: AxiosRequestConfig = {
    method: 'GET',
    url: `https://${process.env.URL}/rest/greenhopper/1.0/rapid/charts/sprintreport?rapidViewId=${boardId}&sprintId=${sprintId}`,
    headers: {
      cookie: `_csrf=${process.env.CSRF}; atlassian.xsrf.token=${process.env.XSRF}; cloud.session.token=${process.env.CLOUD_SESSION}`,
    },
  };

  try {
    const res = await axios.request<SprintReport>(config);
    return res.data;
  } catch (error) {
    handleError(error);
  }

  return null;
};
