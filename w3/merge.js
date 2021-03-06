var fs=require('fs');
var uglify=require('uglify-js');
 
var open = fs.readFileSync;
 
var config=JSON.parse(open('config.json'));
var comment=config.comment&&open(config.comment).toString().replace(/%date%/g,newDate().toJSON());
 
var uglify_option=config.uglify_option||{};
var inputs=config.input;
var lf='\n';
 
if(!inputs||!inputs.length){
	console.log('no input files!');
	return;
}
// 转化
var results=inputs
.map(function(f){
	var code=open(f).toString();
	var output=lf+'// '+f+lf+uglify(code,uglify_option);
	console.log('uglify... <<< ',f,'\t',output.length+'/',code.length,'\t=',output.length/code.length);
	return output;
}).reduce(function(a,b){
	return a + b;
},comment);
 
// 写入
console.log('writing file >>>',config.output,results.length,'bytes');
fs.writeFile(config.output,results,function(err){
	if(err) throw err;
	console.log('all done!');
})