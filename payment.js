const request = require('request'),
        moment = require('moment');


function checkPayment(number, token, startMoment, endMoment) {
    return new Promise(((resolve, reject) => {
        let headers = {
            Accept: 'application/json',
            Authorization: 'Bearer ' + token
        };
        let uri;
        if(!startMoment || !endMoment){
            uri = `http://edge.qiwi.com/payment-history/v2/persons/${number}/payments?rows=5&operation=IN`
        }
        else {
            uri = `http://edge.qiwi.com/payment-history/v2/persons/${number}/payments?rows=5&operation=IN&startDate=` + encodeURIComponent(startMoment) + '&endDate=' + encodeURIComponent(endMoment);
        }
        request({
            uri: uri,
            encoding: 'UTF-8',
            headers: headers
        }, (e, r, p) => {
            if(e || r.statusCode !== 200) reject(e || {status: r.statusCode, error: e, message: p});
            let data = JSON.parse(p)['data'];
            let arr = [];

            data.forEach(e =>{
                if(e.sum.currency == 643 && e.comment !== null) {
                    arr.push({
                        account: e.account,
                        date: e.date,
                        sum: e.sum.amount,
                        comment: e.comment
                    })
                }
            });
            resolve(arr)
        });
    }))
}



module.exports = {
    checkPayment: checkPayment
};
