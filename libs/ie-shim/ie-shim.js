define(['require','exports','../libs/ie-shim/bowser.min'], function(require, exports, module){
	    //['require', 'exports', './es5-shim.min', 'bowser.min', 'respond', 'json2', 'formdata'],
	    exports.init = function(){
		         if(bowser.msie && bowser.version <=9){
					 
					     require('../libs/ie-shim/json2')
					     require('../libs/ie-shim/respond')
					     require('../libs/ie-shim/formdata')
					     require('../libs/ie-shim/html5shiv')
					     require('../libs/ie-shim/html2canvas')
					     require('../libs/ie-shim/es5-shim.min')
						 alert()
				 }
		}	
})