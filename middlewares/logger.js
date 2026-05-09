const logger = (req, res, next)=>{
    console.log(`[${new Date().toDateString()} ${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
}

module.exports = logger