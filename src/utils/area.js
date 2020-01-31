export function getArea(key = 'ALITX_SERVICE_GLOBAL.area') {
  return window[key] || 'china';
}

export function setArea(area = 'china', key = 'ALITX_SERVICE_GLOBAL.area') {
  window[key] = area;
}
