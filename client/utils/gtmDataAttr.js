// import { get, isNull, map } from 'lodash';
export function gtmDataAttr(bannerLocation, position, imgUrl, linkUrl = '') {
  const bannerLocationData = bannerLocation ? `${bannerLocation}` : '-';
  const imgUrlData = imgUrl ? `${getImageNameFromSrc(imgUrl)}` : '-';
  const linkUrlData = linkUrl ? `${linkUrl}` : '-';
  const positionData = position ? `${position}` : '-';
  const gtmDataAttr = {
    'databanner-id': `${bannerLocationData}`,
    'databanner-name': `${bannerLocationData}|${imgUrlData}|${linkUrlData}`,
    'databanner-position': `${positionData}`,
  };
  return gtmDataAttr;
}

export const getImageNameFromSrc = imageSrc => {
  const imageSrcArr = imageSrc.split('/'); // split url by / symbol
  const imageName = imageSrcArr[imageSrcArr.length - 1]; // last index is image name
  return imageName || '';
};
