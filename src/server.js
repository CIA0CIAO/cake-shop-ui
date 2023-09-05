import axios from "axios";

const axiosInstance = axios.create({
  baseURL: 'http://localhost:10001'
})

axiosInstance.interceptors.request.use(config => {
  config.headers['Authorization'] = `Bearer ${localStorage.getItem("token")}`
  return config
}, function (error) {
  return Promise.reject(error);
});

let server = {}

server.login = function (username, password) {
  return axiosInstance.get('/auth/login', {
    params: {
      username,
      password
    }
  })
}

server.getUser = function () {
  return axiosInstance.get('/user')
}

server.getUsers = function () {
  return axiosInstance.get('/getUsers')
}

server.getGoods = function (pageNum, pageSize) {
  return axiosInstance.get('/goods', {
    params: {
      pageNum, pageSize
    }
  })
}

server.searchGood = function (constraints) {
  return axiosInstance.get('/search/good', {
    params: constraints
  })
}

server.register = function (user) {
  return axiosInstance.post("/user", user)
}

server.getUsersByAdmin = function (pageNum, pageSize) {
  return axiosInstance.get('/admin/users', {
    params: {
      pageNum, pageSize
    }
  })
}

server.lockUser = function (userId, locked) {
  return axiosInstance.put(`/admin/lock`, {
    userId,
    locked
  })
}

server.addGood = function (good) {
  return axiosInstance.post(`/admin/good`, good)
}

server.removeGood = function (goodId) {
  return axiosInstance.delete(`/admin/good/${goodId}`)
}

server.updateGood = function (good) {
  return axiosInstance.put(`/admin/good`, good)
}

server.getGoodById = function (goodId) {
  return axiosInstance.get(`/good/${goodId}`)
}

server.addOrder = function (order) {
  return axiosInstance.post(`/order`, order)
}

server.getOrdersByUser = function () {
  return axiosInstance.get(`/user/orders`)
}
server.getOrdersByAdmin = function () {
  return axiosInstance.get(`/admin/orders`)
}
server.removeOrder = function (orderId) {
  return axiosInstance.delete(`/order/${orderId}`)
}
export default server


