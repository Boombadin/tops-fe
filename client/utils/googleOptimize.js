import filter from 'lodash/filter';
import size from 'lodash/size';

export function googleOptimize(dataCookie, googleOptimizeExpId) {
  let dataSplit = [],
    dataFilter = [],
    dataLastLength = 0,
    featureEnable = false;

  if (dataCookie) {
    dataSplit = dataCookie.split('!');
    dataFilter = filter(dataSplit, val => val.includes(googleOptimizeExpId));

    if (size(dataFilter) > 0) {
      dataLastLength = dataFilter?.[0][dataFilter?.[0]?.length - 1] || 0;
    }

    featureEnable = dataLastLength > 0;
  }

  return featureEnable;
}
