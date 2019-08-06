const queueFetch = require('./quest');

const axios = {
  post(obj, time = 1000) {
    return new Promise((resolve, reject) => {
      setTimeout(function () {
        resolve(obj)
      }, time);
    })
  }
}

axios.post = queueFetch(axios.post, 25)

for(let i = 0; i< 100; i++) {
  axios.post(i).then(resp => console.log(resp))
}
