var path = require('path');

var directories = ['Users', 'Jk', 'docs'];
var dirStr = directories.join();
console.log('dir : ' + dirStr);

var dirStr2 = directories.join(path.sep);
console.log('dir2 : ' + dirStr2);

var filepath = path.join('/Users/jk','notepad.exe');
console.log('filepath : ' + filepath);

var dirname = path.dirname(filepath);
console.log('dirname : ' + dirname);

var basename = path.basename(filepath);
console.log('basename : ' + basename);

var extname = path.extname(filepath);
console.log('extname : ' + extname);