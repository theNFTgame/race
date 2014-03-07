varfs=require('fs');
varuglify=require('uglifyjs');
 
varopen=fs.readFileSync;
 
varconfig=JSON.parse(open('config.json'));
varcomment=config.comment&&open(config.comment).toString().replace(/%date%/g,newDate().toJSON());
 
varuglify_option=config.uglify_option||{};
varinputs=config.input;
varlf='\n';
 
if(!inputs||!inputs.length){
	console.log('no input files!');
	return;
}
// 转化
varresults=inputs
.map(function(f){
	varcode=open(f).toString();
	varoutput=lf+'// '+f+lf+uglify(code,uglify_option);
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