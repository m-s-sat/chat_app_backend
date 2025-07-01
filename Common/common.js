exports.cookieExtractor = (req)=>{
    let token = null;
    if(req&&req.cookies) token = req.cookies['jwt'];
    return token;
}
exports.sanitizeUser = (doc)=>{
    return {id:doc.id,email:doc.email}
}