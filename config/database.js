if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI: 'mongodb://adi:1234@ds119060.mlab.com:19060/vidjotting-prod'}
} else {
    module.exports = {mongoURI: 'mongodb://localhost/vidjot-dev'}
}