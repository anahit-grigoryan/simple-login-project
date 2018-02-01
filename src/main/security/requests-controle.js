const requests = require('../../index')

function isAllowableCount(req){
    const now = Date.now();
    const aMinuteAgo = now - (1000 * 60*2);
    let cnt = 0;
    const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    console.log(ip);

    const ip_requests = requests.filter(request => request.ip == ip && request.url == req.url);

    for (let i = ip_requests.length - 1; i >= 0; i--) {
        if (ip_requests[i].date >= aMinuteAgo) {
            ++cnt;
        } else {
            break;
        }
    }

    if(cnt>3) return false;
    return true;

};

module.exports.isAllowableCount = isAllowableCount;



