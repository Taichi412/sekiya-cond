import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ja: {
    translation: {
      Returns: '稼働率', News: 'ニュース', Events: 'イベント', Chat: 'メッセージ', Me: 'マイページ',
      Occupancy: '稼働率', Payout: '還元額', Rooms: '所有部屋', Finalized: '確定', Unfinalized: '未確定',
    },
  },
  en: {
    translation: {
      Returns: 'Returns', News: 'News', Events: 'Events', Chat: 'Chat', Me: 'Me',
      Occupancy: 'Occupancy', Payout: 'Payout', Rooms: 'Rooms', Finalized: 'Finalized', Unfinalized: 'Unfinalized',
    },
  },
  'zh-Hant': {
    translation: {
      Returns: '回報', News: '消息', Events: '活動', Chat: '訊息', Me: '我的',
      Occupancy: '稼動率', Payout: '分紅', Rooms: '房號', Finalized: '已確定', Unfinalized: '未確定',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'ja',
  fallbackLng: 'ja',
  interpolation: { escapeValue: false },
});

export default i18n;

