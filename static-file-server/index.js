//Tanner Johnson
//IT410

const file = require('./src/file')
const http = require('http')

const port = 4242
var root = process.argv[2] || './'

function handler (req, res){
    var path = root + req.url
    file.exists(path).then(function (exists){
        if(exists){
            return file.getPathType(path).then(function (type){
                if(type === 'file'){
                    return file.readFile(path)
                }else if(type === 'directory'){
                    return file.exists(path + '/index.html').then(function (exists){
                        if(exists){
                            return file.readFile(path + '/index.html')
                        }else{
                            return file.getDirectoryTypes(path, 0).then(function (paths){
                                var index = '<html><head><title>'+req.url+' index</title></head><body><ul>'
                                Object.keys(paths).forEach(function (path){
                                    var p = path.replace(root + req.url + '/', '')
                                    var link = req.url !== '/' ? req.url + '/' + p : p 
                                    index += '<li><a href="'+link+'">'+p+'</a></li>'
                                })
                                return index + '</ul></body></html>'
                            })
                        }
                    })
                }else{
                    throw new Error('Not a valid path type')
                }
            })
        }else{
            throw new Error('File does not exist')
        }
    }).then(function (data){
        res.statusCode = 200
        res.write(data)
    }).catch(function (){
        res.statusCode = 404
        res.write('not found')
    }).then(function (){
        res.end()
    })
}

http.createServer(handler).listen(port, function (){
    console.log("Server listening on port ", port)
})
