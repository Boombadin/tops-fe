import zendeskService from '../services/zendeskTicketService';
import configService from '../services/storeConfigService';
import { get as prop } from 'lodash';
import { log } from '../utils/logger';

const postTicket = async (req, res) => {
  try {
    const data = req.body;
    
    if (data) {
      const config = await configService.getDefaultConfig();
      const url = prop(config, '[0].extension_attributes.zendesk_url', null);
      const token = prop(config, '[0].extension_attributes.zendesk_token', null);
      
      if (!url || !token) {
        return res.status(400).send({ error: 'Cannot get url and token from config' });
      }

      const ticket = await zendeskService.post({ data, url, token });
      log('zendesk', 'postTicket', req, ticket);
      
      return res.status(200).send({ ticket })
    } 
    
    return res.status(400).send({})
  } catch (e) {
    log('zendesk', 'postTicket', req, e.message, false);
    return res.status(500).send({ error: e.message })
  }
}

export default { postTicket };
