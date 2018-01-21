var rp = require('request-promise');

var refresh_token = 'eyJ6aXAiOiJERUYiLCJlbmMiOiJBMTI4R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.dqR2gq8H25Ts8jLku3wevqtDAQ9clwJVViWi7nyxBayCrIjyfGq8Dpji07vEpnkmcLDfUsuVSuE0Je45EWatqi90az9-_IeISvGer3URlm6IgbufXdkWnwDODU4z70t46gX_Rfw-mQADSCwhQOTH36eLPJdWlt5GWZ-XybAdoHEwWiZrnSihDIRyvhkCBWsl7Gi0E9d67O3G83YvxGbQyc71Jv7chDBf-JeSYd8wzTbw8tjILMXXHX1L5Q4EbAZqzIX3UVYeD3j69h1n77Lr9aptG-BUJHjL_9VlLITMLPZKyRNiPTXeoxmudfbWn2uFGbY0Oq_I-FRLKOCfo7mz4g.iwa9sATpNjCTDfss.fjtfqIGjBiEI7aFqPFGAFIULQfxfsamYjjcWyWVJNAzYnBKoHnOo6kba5r3EGBNzmbla66aFr5uOKhKywg1VsT0SfUREJLNOe2-lkBdqAWIwfuRSy_9t-nptsTWGj50GLTVtwogDbkWYk25Ed0pYjHcXtBW0tj0MRwl6cKVce2jixcYjPHRIPURxOC03oJqOoMGTs4YACxYxTVIhrGNtGZyNdOaLdkXz4vI3BSSMeHL5ci4sWgwa0UDxiZsgObHv6GZaoE9pSPUXDbIrXRWNml6u8DiGSzninMxzai6VwFnxxHIHi-q6zb42mjwb9Iw4FFgcYWiPhxGHJvTRRW_XRza3Oft5A3uNkvod4pFEBeiBmvmPN6kr9iHBb2Rlp6fzxCOFgyx6Hx8qvoEgHRS66WjQGT77EUShM7SyhzQS3sxbnxcpxmdWyMfbBwgT-nk7OlWqE1NZAWTKI-bLeIGIGOfCuSblFf4eJf1UsPQ.vAgg9m-hKCs812l6wy9Qsw'

function refreshToken () {
  var options = {
    method: 'POST',
    uri: 'https://connect.bbva.com/token',
    json: true,
    qs: {
      grant_type: 'refresh_token'
    },
    headers: {
      Authorization: 'Basic YXBwLmJidmEudGFiaTp6bGZsTG1MQVRranN0TUxyalhsTHp4SipUSTUyeTl1SmMyS0Z5Wm45cEJuVm1wWSRCVSREZk1TVEY0TnY3ZlBk',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    formData: {
      refresh_token: refresh_token
    }
  }

  return rp(options)
    .catch(err => {
      console.log(err)
    })
}


var getUserSpend = function () {
  // return refreshToken()
  //   .then(json => {
  //     refreshToken = json.refresh_token;
    var json = {
      access_token: 'eyJ6aXAiOiJERUYiLCJlbmMiOiJBMTI4R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.J_-GSihdOHv1oBx0j44FyR_kKo0m9FH5TBamkzL5CN1pDQ8bSZozw8ymHLBWTaAIc4csO-VN7R8zl6KIpbfoJwpI9ENuNHcfGeAydp80wU9T9ZkiuEGVCySQOkZ-UAQDIFA_ErftUh_LsxcepA5CS4eOXEdELNmMb1cJj7K0QFcy60vw-NTDTIHhBcOQuqjI27dej1i2CSedgp7TVAJQjZn_jyEKmNMGPSK5n1lZqw1mg7SQe68caON1Xu9CZnQRbCRUkMQstsm1ewCNouxzO7LuA4taOTojP46zchWBINT5ZC1qjMRqYoAkUDZn9wX9-NhRZtiKi48dtHVNsdHcgw.AJIGQBaRgxAX5t0L.VFpDEQDgAS5wdI4CA6GXezQL7F_ervjnRI0vOmYwKWT6z7-aZPF8CWIxHTjy55dBYmraqrIbLlx-70Z8UnFuzHsfUG_iKfEhB_5zVF5yqKMtgoIM5h7ss7LDIhXJHIaowvvuULRxbGcRDo55IsxKp484SODTKrSucAxouExCScyxo2UI6pItU_ZQefeLy4ChHA1LMmI5vaxtdixFkb5Qi01mCA66oejW27IRPZSA9Li7sAdKm59uj6ceXelED2bq5H6HM1IJ1-fhsPAjeBRylwlpjHGOxowfmf6pdSRJFpgJomOAESFWr9j3_og7FkzYL7Zgz0iM4l7Js6r1JSzWzs15qU6UWyssWd6Vlx_65_0elzrn.4Ov6YslKx5jFV9hfZI2f5Q'
    }
    var options = {
      uri: 'https://apis.bbva.com/accounts-sbx/v1/me/accounts/ES0182002000000000500000000332046493XXXXXXXXX/transactions',
      json: true,
      headers: {
        Authorization: `jwt ${json.access_token}`,
        Accept: 'application/json'
      }
    }
    //   return rp(options)
    // })
    return rp(options)
    .then(res => {
      var amount = res.data.accountTransactions.filter(t => t.amount < 0).reduce((p, c) => p + c.amount, 0)
      console.log(amount)
      return Math.abs(amount) / 12
    })
    .catch(err => {
      console.log(err)
    })
}

module.exports.getUserSpend = getUserSpend
// getUserSpend()