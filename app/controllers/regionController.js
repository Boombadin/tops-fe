import { get as prop } from 'lodash';
import RegionService from '../services/regionService';

const getProvince = async (req, res) => {
  const store = req.headers['x-store-code'];
  const delivery = req.query.delivery;
  if (!store || store === '') return res.status(400).json({ message: 'store is required.' });

  try {
    const provinces = await RegionService.fetchProvince(store, delivery == 'true');

    if (typeof req.redis !== 'undefined') {
      req.redis.set(req.redisKey, JSON.stringify({ provinces }), 'EX', 86400);
    }

    return res.json({ provinces });
  } catch (e) {
    console.error(prop(e, 'message', ''));
    return res.json({ provinces: [] });
  }
};

const getDistrict = async (req, res) => {
  const store = req.headers['x-store-code'];
  const regionId = req.query.region_id;
  const delivery = req.query.delivery;
  if (!store || store === '') return res.status(400).json({ message: 'store is required.' });
  if (!regionId || regionId === '')
    return res.status(400).json({ message: 'region_id is required.' });

  try {
    const districts = await RegionService.fetchDistrict(store, regionId, delivery == 'true');

    if (typeof req.redis !== 'undefined') {
      req.redis.set(req.redisKey, JSON.stringify({ districts }), 'EX', 86400);
    }

    return res.json({ districts });
  } catch (e) {
    console.error(prop(e, 'message', ''));
    return res.json({ districts: [] });
  }
};

const getSubDistrict = async (req, res) => {
  const store = req.headers['x-store-code'];
  const regionId = req.query.region_id;
  const delivery = req.query.delivery;
  const districtId = req.query.district_id;

  if (!store || store === '') return res.status(400).json({ message: 'store is required.' });
  if (!regionId || regionId === '')
    return res.status(400).json({ message: 'region_id is required.' });
  if (!districtId || districtId === '')
    return res.status(400).json({ message: 'district_id is required.' });

  try {
    const subdistricts = await RegionService.fetchSubDistrict(
      store,
      regionId,
      districtId,
      delivery == 'true',
    );

    if (typeof req.redis !== 'undefined') {
      req.redis.set(req.redisKey, JSON.stringify({ subdistricts }), 'EX', 86400);
    }

    return res.json({ subdistricts });
  } catch (e) {
    console.error(prop(e, 'message', ''));
    return res.json({ subdistricts: [] });
  }
};

const getRegionByPostcode = async (req, res) => {
  const store = req.headers['x-store-code'];
  const { postcode, delivery = 'true' } = req.query;

  if (!store || store === '') return res.status(400).json({ message: 'store is required.' });

  if (!postcode || postcode === '')
    return res.status(400).json({ message: 'postcode is required.' });

  try {
    const region = await RegionService.fetchRegionByPostcode(store, postcode, delivery);

    if (typeof req.redis !== 'undefined') {
      req.redis.set(req.redisKey, JSON.stringify({ region }), 'EX', 86400);
    }

    return res.json({ region });
  } catch (e) {
    console.error(prop(e, 'message', ''));
    return res.json({ region: {} });
  }
};

export default {
  getProvince,
  getDistrict,
  getSubDistrict,
  getRegionByPostcode,
};
