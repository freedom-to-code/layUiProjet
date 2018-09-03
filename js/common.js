layui.use(['layer'], function () {
  var beforeSendFn = function (ajaxRequest) {
    ajaxRequest.setRequestHeader("Accept", "application/json");
  };
  var completeFn = function () {
  };
  var successFn = function (json, textStatus, jqXHR) {
    if (typeof json === 'string') {
      try {
        json = eval("(" + json + ")");
      } catch (e) {
      }
    }
    if (this.callBack) {
      this.callBack(json);
    }
  };
  var errorFn = function (x, t, e) {
    var data = {
      isSuccess: false
    };
    if (t == "timeout") {
      data.resultMsg = "请求超时";
    } else if (x.status == 404) {
      data.resultMsg = "404:您访问的资源不存在";
    } else if (x.status == 403) {
      data.resultMsg = "403:您的访问被拒绝";
    } else if (x.readyState < 4) {
      //data.resultMsg = "请求失败";
      //请求未完成不再提示
      return;
    } else {
      //data.resultMsg = "未知异常！源：" + (x && x.responseText) + "； 错误类型：" + t + "；异常：" + e;
      data.resultMsg = (x.responseJSON && x.responseJSON.resultMsg) || e || '未知错误' + ((x.responseJSON && x.responseJSON.errorCode) || x.statusText || '');
    }
    if (x.responseJSON && x.responseJSON.errorCode == 'error.notLogin') {
      var loginUrl = mpUrlsObj.login.login;
      var returnUrl = window.location.href;
      location.href = loginUrl + "&returnUrl=" + returnUrl;
      return;
    }
    if (this.callBack) {
      //类型处理暂定
      this.callBack(data);
    }

  };
  window.Common = {
    get: function (str, domain) {
      domain = domain || window.document;
      return domain.getElementById(str);
    },
    sendFormData: function (url, data, callBack, options) {
      if (!Common.preventSend || (options && options.important)) {
        var loader = layer.load(2, {
          shade: [0.1, '#fff'] //0.1透明度的白色背景
        });
        options = options || {};
        $.ajax($.extend({
          url: url,
          type: 'get',
          async: true,
          data: data,
          beforeSend: beforeSendFn,
          complete: function (XMLHttpRequest, textStatus) {
            layer.close(loader);
            completeFn(XMLHttpRequest, textStatus);
          },
          success: successFn,
          error: function (XMLHttpRequest, textStatus, errorThrown) {
            layer.close(loader);
            errorFn.call(this, XMLHttpRequest, textStatus, errorThrown);
          },
          callBack: callBack
        }, options));
      }
    }
  };
})


