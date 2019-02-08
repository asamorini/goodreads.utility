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
                  'my_favorites|&#9829;',
                  'f_audiobook|audiobook;',
                  'f_ebook|ebook;',
                  'o_biblioteca_mlol|MLOL;',
                  'o_biblioteca_|BIBLIOTECA ;',
                  'h_|STORICO ',
                  'y_|',
                  'toread-',
                  '1-read-next|&#10004;Read next',
                  '2-|&#10103; ',
                  '3-|&#10104; ',
                  'aaa-to-check|&#10067;To check',
                  'g_|GENERE ',
                  'storico-|STORICO ',
                  't_|&#9839;',
                  'w_|&#9873;',
                  'zz_|&#9787; '
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
		to-read:[
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
  }
};
