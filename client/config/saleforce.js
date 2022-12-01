export default {
  staging: {
    liveChat: {
      liveChat_UrlBase: 'https://topsonline--dev.my.salesforce.com',
      liveChat_UrlService: 'https://dev-topsonline.cs6.force.com/livechat',
      liveChat_SlgId: '00DN0000000BdvH',
      liveChat_ContentUrl:
        'https://c.la1-c2cs-hnd.salesforceliveagent.com/content',
      liveChat_DeploymentId: '572N00000004CbG',
      liveChat_ButtonId_th: '573N00000004Cee',
      liveChat_ButtonId_en: '573N00000004Cet',
      liveChat_AgentUrl: 'https://d.la1-c2cs-hnd.salesforceliveagent.com/chat',
      liveChat_DevName_th: 'TOPS_Live_Chat_TH',
      liveChat_DevName_en:
        'EmbeddedServiceLiveAgent_Parent04IN00000008OJXMA2_168dac6f99d',
      liveChat_SetAttribute:
        'https://topsonline--dev.my.salesforce.com/embeddedservice/5.0/esw.min.js',
      liveChat_ScriptUrl:
        'https://c.la1-c2cs-hnd.salesforceliveagent.com/content/g/js/45.0/deployment.js',
      liveChat_Online_en: 'liveagent_button_online_573N00000004Cet',
      liveChat_Offline_en: 'liveagent_button_offline_573N00000004Cet',
      liveChat_Online_th: 'liveagent_button_online_573N00000004Cee',
      liveChat_Offline_th: 'liveagent_button_offline_573N00000004Cee',
    },
    web2case: {
      orgid: '00DN0000000BdvH',
      retURL: 'https://staging.tops.co.th/',
      lang: '00NN0000004Wen5',
      subject: '00NN0000004WhUI',
      contact: '00NN0000004Yko1',
      orderNumber: '00NN0000004YkoB',
      submitForm:
        'https://topsonline--dev.my.salesforce.com/servlet/servlet.WebToCase?encoding=UTF-8',
    },
  },
  uat: {
    liveChat: {
      liveChat_UrlBase: 'https://centralchatshop--uat.my.salesforce.com',
      liveChat_UrlService:
        'https://uat-centralchatshop.cs57.force.com/livechat',
      liveChat_SlgId: '00D0k0000001EFc',
      liveChat_ContentUrl:
        'https://c.la1-c1cs-ukb.salesforceliveagent.com/content',
      liveChat_DeploymentId: '5720k000000CakE',
      liveChat_ButtonId_th: '5730k0000008OaJ',
      liveChat_ButtonId_en: '5730k0000008OaE',
      liveChat_AgentUrl: 'https://d.la1-c1cs-ukb.salesforceliveagent.com/chat',
      liveChat_DevName_th:
        'EmbeddedServiceLiveAgent_Parent04I0k00000000IoEAI_174b5202aa3',
      liveChat_DevName_en:
        'EmbeddedServiceLiveAgent_Parent04I0k00000000IjEAI_174b51826cd',
      liveChat_SetAttribute:
        'https://centralchatshop--uat.my.salesforce.com/embeddedservice/5.0/esw.min.js',
      liveChat_ScriptUrl: 'https://d.la1-c1cs-ukb.salesforceliveagent.com/chat',
      liveChat_Online_en: 'liveagent_button_online_5730k0000008OaE',
      liveChat_Offline_en: 'liveagent_button_offline_5730k0000008OaE',
      liveChat_Online_th: 'liveagent_button_online_5730k0000008OaJ',
      liveChat_Offline_th: 'liveagent_button_offline_5730k0000008OaJ',
    },
    web2case: {
      orgid: '00D0k0000001EFc',
      retURL: 'https://uat.tops.co.th/',
      recordType: '0120k000000JKbm',
      lang: '00N0k000004QL5r',
      subject: 'subject',
      contact: '00N0k000004QL5S',
      orderNumber: '00N0k000004QL5I',
      submitForm:
        'https://centralchatshop--uat.my.salesforce.com/servlet/servlet.WebToCase?encoding=UTF-8',
    },
  },
  prod: {
    liveChat: {
      liveChat_UrlBase: 'https://centralchatshop.my.salesforce.com',
      liveChat_UrlService: 'https://centralchatshop.secure.force.com',
      liveChat_SlgId: '00D0o000000S2XT',
      liveChat_ContentUrl:
        'https://c.la1-c2-ukb.salesforceliveagent.com/content',
      liveChat_DeploymentId: '5720o000000PodB',
      liveChat_ButtonId_th: '5730o000000DBs3',
      liveChat_ButtonId_en: '5730o000000DBry',
      liveChat_AgentUrl: 'https://d.la1-c2-ukb.salesforceliveagent.com/chat',
      liveChat_DevName_th:
        'EmbeddedServiceLiveAgent_Parent04I0o000000TOj6EAG_174ba0d5910',
      liveChat_DevName_en:
        'EmbeddedServiceLiveAgent_Parent04I0o000000TOj1EAG_174b9ee901f',
      liveChat_SetAttribute:
        'https://centralchatshop.my.salesforce.com/embeddedservice/5.0/esw.min.js',
      liveChat_ScriptUrl:
        'https://c.la1-c2-ukb.salesforceliveagent.com/content/g/js/45.0/deployment.js',
      liveChat_Online_en: 'liveagent_button_online_5730o000000DBry',
      liveChat_Offline_en: 'liveagent_button_offline_5730o000000DBry',
      liveChat_Online_th: 'liveagent_button_online_5730o000000DBs3',
      liveChat_Offline_th: 'liveagent_button_offline_5730o000000DBs3',
    },
    web2case: {
      orgid: '00D0o000000S2XT',
      retURL: 'https://www.tops.co.th/',
      recordType: '0120o000001Cqu4',
      lang: '00N0o00000NyBFU',
      subject: 'subject',
      contact: '00N0o00000NyBEv',
      orderNumber: '00N0o00000NyBEq',
      submitForm:
        'https://webto.salesforce.com/servlet/servlet.WebToCase?encoding=UTF-8',
    },
  },
};
