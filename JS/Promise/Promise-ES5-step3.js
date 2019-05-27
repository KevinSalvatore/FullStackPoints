const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

function _Promise(handle) {
  const _this = this;

  _this.value = null;
  _this.error = null;

  _this.onFulfilledCallback = undefined;
  _this.onRejectedCallback = undefined;

  function resolve(value) {
    setTimeout(() => {
      if (_this.onFulfilledCallback) {
        _this.onFulfilledCallback(value);
      }
    });
  }
  function reject(error) {
    setTimeout(() => {
      if (_this.onRejectedCallback) {
        _this.onRejectedCallback(error);
      }
    });
  }

  handle(resolve, reject);
}

_Promise.prototype.then = function(onFulfilled, onRejected) {
  const _this = this;
  _this.onFulfilledCallback = onFulfilled;
  _this.onRejectedCallback = onRejected;
};

new _Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(123);
  }, 1000);
}).then(data => {
  console.log(data);
});
