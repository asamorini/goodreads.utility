/*
https://www.w3schools.com/charsets/ref_utf_symbols.asp
&#9888;	attenzione		check
&#9989;	spunta verde	readNext
&#9992;	aeroplano		w_
&#10004;	spunta nera		readNext
&#10067;	punto interrogativo 	check 
&#10102;	numero 1		biblio
&#10103;	numero 2
&#10104;	numero 3
&#10105;	numero 4
&#10106;	numero 5
&#10107;	numero 6
&#10108;	numero 7
&#10084;       cuore rosso
&#9899;        tondo nero
&#9775;        Yin Yang
&#9200;		Alarm Clock
&#9873;	bandiera nera	w_
&#9787;		smile Nero		authors
&Eta;		H				history
&Tau;		T				tema
&#Wopf;	W				w_
&#9864;	cerchio nero buco bianco		genre
&#9830;	seme carte quadri			genre
&#9829;	cuore			my_favorites
&#9856;	quadrarto con punto centrale		tema
&#9839;	diesis		tema
*/
var samoGoodreadsUtility={
  lang:'ita',
  shelvesViewer:{
    analyzeShelfDefault:'to-read',
    shelvesNames:[
                  'my_favorites|&#9829;My favorites',
                  'f_audiobook|audiobook',
                  'f_ebook|ebook',
                  'b_biblioteca_mlol|MLOL',
                  'b_biblioteca|BIBLIOTECA ',
	          'b-biblio-faenza-consultazio-temp|BIBLIOTECA consultazione',
	          'g_|GENERE ',
                  'h___|STORICO ',
                  'h__|TEMA ',
                  'h_|WAR ',
	          'waf-|&#9873;',
	          'wamc-|&#9873;',
	          'wamn-|&#9873;',
	          'wams-|&#9873;',
	          'wasc-|&#9873;',
	          'wase-|&#9873;',
	          'waso-|&#9873;',
	          'wass-|&#9873;',
	          'wasse-|&#9873;',
	          'we-|&#9873;',
	          'wo-|&#9873;',
	          'wp-|&#9873;',
                  'y_|',
                  'a_toread-next|&#10004;Read next',
                  'a_toread-owned|&#9899; OWNED',
	          'a_toread-tobuy|&#9981; To buy',
	          'htemp-bio_|&#128100; BIO ',
	          'htemp-|&#9995; ',
                  'aaa-to-check|&#10067;To check',
                  'storico-|STORICO ',
                  't_|OTHER '
    ].join(','),
    excludeShelves:{
      read:{s:'p_',c:'',e:''},
      'to-read':{s:'',c:'',e:''}
    },
    filterNumPages:[100,200,400,1000],
	columns:{
		read:[
//			'asin'
			'author'
//			,'avg_rating'
//			,'comments'
//			,'condition'
			,'cover'
//			,'date_added'
//			,'date_pub'
//			,'date_pub_edition'
//			,'date_purchased'
			,'date_read'
			,'date_started'
//			,'format'
//			,'isbn'
//			,'isbn13'
//			,'notes'
			,'num_pages'
//			,'num_ratings'
//			,'owned'
//			,'position'
//			,'purchae_location'
			,'rating'
//			,'read_count'
//			,'recommender'
//			,'review'
//			,'shelves'
			,'title'
//			,'votes'
		],
		'to-read':[
//			'asin'
			'author'
//			,'avg_rating'
//			,'comments'
//			,'condition'
			,'cover'
			,'date_added'
			,'date_pub'
//			,'date_pub_edition'
//			,'date_purchased'
//			,'date_read'
//			,'date_started'
//			,'format'
//			,'isbn'
//			,'isbn13'
			,'notes'
			,'num_pages'
//			,'num_ratings'
//			,'owned'
//			,'position'
//			,'purchae_location'
//			,'rating'
//			,'read_count'
//			,'recommender'
//			,'review'
			,'shelves'
			,'title'
//			,'votes'
		]
	}
  },
  reportByYear:{
    excludedShelvesStartsWith:[
        'a_',    //ex: "a_toread-next-0_now"
        'p_',    //ex: "p_mondadori"
        'w',    //ex: "we-" -> world europe
        'y_'    //ex: "y_1945-1970"
    ],
    rows_merge:{
    	'b_biblioteca_indaco': 'b_biblioteca'
    },
    rows_nameReplace_RegEx:[
    	[/^read$/, '  READ  '],
    	[/^undefined$/, '  undefined  '],
    	[/^h___historic$/, ' HISTORIC '],
    	[/^h___true_story$/, ' TRUE STORY '],
    	[/^1-100$/, ' 1\\100 '],
    	[/^101-200$/, ' 101\\200 '],
    	[/^201-400$/, ' 201\\400 '],
    	[/^401-1000$/, ' 401\\1000 '],
    	[/^1001+$/, ' 1001\\+ '],
    	[/^my_favorites$/, 'My Favorites'],
    	[/^b_biblioteca_mlol/, 'MLOL'],
    	[/^b_biblioteca/, ' Public library'],
    	[/^f_/, ''],
    	[/^g_/, ''],
    	[/^b_/, ''],
    	[/^h___/, ''],
    	[/^h__/, ''],
    	[/^h_/, ''],
    	[/-/g, ' '],
    	[/_/g, ' ']
    ],
    groups_equals:{
    	'f_audiobook':'format',
    	'f_ebook':    'format',
    	'b_biblioteca':        'source',
    	'b_biblioteca_mlol':   'source'
    },
    groups_startsWith:{
    	'g_':  'genre',
    	'h___':'history',
    	'h__':'topic',
    	'h_':'history'
    }
  }
};
