// 使用localStorage存储权限信息，这些信息可能是从实际项目中的服务器发送的
export function getAuthority() {
  return localStorage.getItem('antd-pro-authority') || 'admin';
}

export function setAuthority(authority) {
  return localStorage.setItem('antd-pro-authority', authority);
}
