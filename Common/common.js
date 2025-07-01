exports.cookieExtractor = (req)=>{
    let token = null;
    if(req&&req.cookies) token = req.cookies['jwt'];
    return token;
}
exports.sanitizeUser = (doc)=>{
    return {email:doc.email}
}