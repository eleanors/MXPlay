require.config({
     baseUrl: './libs/',	
	 
     urlArgs: "v=" + (new Date()).getTime(),
	
	 paths: {
		    'jquery': 'jquery/jquery-1.10.2',
		    'mootools': 'mootools/mootools',
		    'artTemplate': 'artTemplate/template',
		    'bootstrap': 'bootstrap/bootstrap.min',
			
	 },
	 
	 shim: {
		 
		    'bootstrap': {
			      deps: ['jquery']	
			}
		 
	 }
})

require(['../module/main/index'])