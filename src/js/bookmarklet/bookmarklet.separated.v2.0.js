javascript:
var samoGoodreadsScript=function(url,callback){
	var script=document.createElement('script');
	//script.setAttribute('type','text/javascript');
	script.setAttribute('src',url);
	if (callback){script.onload=callback;}
	//document.getElementsByTagName('head')[0].appendChild(script);
	document.head.insertBefore(script,document.head.firstElementChild);
};
samoGoodreadsScript(
	'https://asamorini.github.io/goodreads.utility/src/js/bookmarklet/config.samo.js',
	function(){
		samoGoodreadsScript('https://asamorini.github.io/goodreads.utility/dist/goodreads.utility.min.js')
	}
)