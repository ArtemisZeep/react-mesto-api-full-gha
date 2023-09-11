const allowedCors = [
    'https://mesto.artemiszeep.nomoredomainsicu.ru',
    'http://mesto.artemiszeep.nomoredomainsicu.ru',
    'mesto.artemiszeep.nomoredomainsicu.ru',
    'https://localhost:3000',
    'http://localhost:3000',
  ];
  
  const corsHandler = (req, res, next) => {
    const { origin } = req.headers;
    const { method } = req; 
  
    // Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)
    const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
    const requestHeaders = req.headers['access-control-request-headers'];
    res.header('Access-Control-Allow-Credentials', true);
    if (allowedCors.includes(origin)) {
      // устанавливаем заголовок, который разрешает браузеру запросы с этого источника
      res.header('Access-Control-Allow-Origin', origin);
    }
  
    // Если это предварительный запрос, добавляем нужные заголовки
    if (method === 'OPTIONS') {
    // разрешаем кросс-доменные запросы любых типов (по умолчанию)
      res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
      // разрешаем кросс-доменные запросы с этими заголовками
      res.header('Access-Control-Allow-Headers', requestHeaders);
      // завершаем обработку запроса и возвращаем результат клиенту
      return res.end();
    }
    return next();
  };
  
  module.exports = corsHandler;